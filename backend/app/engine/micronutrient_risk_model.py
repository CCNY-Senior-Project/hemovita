"""
micronutrient_risk_model.py

Utility module for estimating micronutrient deficiency risk from the
`master_micronutrient_data 2.csv` dataset and exposing a clean, JSON-friendly
API that can be called from the HemoVita FastAPI recommendation engine.

Main entrypoint for FastAPI:
    get_micronutrient_risk_profile(profile: dict) -> dict

Expected input profile keys:
    - country: str
    - population: str
    - gender: str
    - age: float or int
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List, Any, Optional

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Allow overriding data path via environment variable.
DATA_PATH_ENV = "HEMOVITA_RISK_DATA"
DEFAULT_DATA_FILENAME = "micronutrient_data.csv"


# You can tune this list to match your dataset exactly.
VALID_MICRONUTRIENTS = [
    "iron",
    "iron_deficiency_anemia",
    "vitamin_a",
    "vitamin_b6",
    "vitamin_b12",
    "folate",
    "vitamin_c",
    "vitamin_d",
    "vitamin_e",
    "zinc",
    "magnesium",
    "calcium",
]


# Global cache for the dataframe so we only load once.
_DATAFRAME_CACHE: Optional[pd.DataFrame] = None


# ---------------------------------------------------------------------------
# Data loading & preprocessing
# ---------------------------------------------------------------------------

def _get_data_path() -> Path:
    """
    Resolve the path to the CSV file.

    Priority:
    1. HEMOVITA_RISK_DATA environment variable (absolute or relative)
    2. DEFAULT_DATA_FILENAME next to this file
    3. DEFAULT_DATA_FILENAME in project_root/data
    """
    env_path = os.getenv(DATA_PATH_ENV)
    if env_path:
        p = Path(env_path)
        if not p.is_absolute():
            # make it relative to project root instead of engine folder
            project_root = Path(__file__).resolve().parents[2]
            p = project_root / p
        return p

    # 2) Try next to this file (backend/app/engine/)
    local = Path(__file__).resolve().parent / DEFAULT_DATA_FILENAME
    if local.exists():
        return local

    # 3) Try backend/data/micronutrient_data.csv
    project_root = Path(__file__).resolve().parents[2]  # .../backend
    data_path = project_root / "data" / DEFAULT_DATA_FILENAME
    return data_path



def _load_dataframe() -> pd.DataFrame:
    """
    Load and preprocess the master_micronutrient_data CSV.
    This is called lazily and cached.
    """
    global _DATAFRAME_CACHE
    if _DATAFRAME_CACHE is not None:
        return _DATAFRAME_CACHE

    csv_path = _get_data_path()
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Micronutrient risk data file not found at: {csv_path}. "
            f"Set {DATA_PATH_ENV} or place '{DEFAULT_DATA_FILENAME}' next to this module."
        )

    df = pd.read_csv(csv_path)

    # Impute age if missing
    if "Age" in df.columns:
        df["Age"] = df["Age"].fillna(15.0)

    # Rename P_Deficiency_Primary -> True_Risk and convert from % to 0..1
    if "P_Deficiency_Primary" in df.columns and "True_Risk" not in df.columns:
        df = df.rename(columns={"P_Deficiency_Primary": "True_Risk"})

    if "True_Risk" not in df.columns:
        raise KeyError("Expected column 'True_Risk' (or 'P_Deficiency_Primary') in risk data.")

    # If values look like percentages, scale; otherwise assume already 0..1.
    # Heuristic: if max > 1.0, treat as 0..100.
    if df["True_Risk"].max() > 1.0:
        df["True_Risk"] = df["True_Risk"] / 100.0

    # Ensure required columns exist
    required_cols = ["Country", "Population", "Gender", "Micronutrient", "Age", "True_Risk"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise KeyError(f"Missing required column(s) in risk data: {missing}")

    # Restrict to micronutrients we consider valid
    df = df[df["Micronutrient"].isin(VALID_MICRONUTRIENTS)].copy()

    _DATAFRAME_CACHE = df
    return df


# ---------------------------------------------------------------------------
# Core risk logic
# ---------------------------------------------------------------------------

def risk_bucket(p: float) -> str:
    """Map a risk probability in [0,1] to a human-readable bucket."""
    if p < 0.10:
        return "low"
    elif p < 0.30:
        return "moderate"
    elif p < 0.60:
        return "high"
    else:
        return "very high"


def _filter_by_profile(
    df: pd.DataFrame,
    country: str,
    population: str,
    gender: str,
    age: float,
    age_window: float,
    min_group_size: int,
) -> pd.DataFrame:
    """
    Apply progressive filtering by (Country, Population, Gender, Age) with fallbacks.
    """
    subset = df[
        (df["Country"] == country)
        & (df["Population"] == population)
        & (df["Gender"] == gender)
    ]

    # Progressive fallbacks if subset is empty
    if subset.empty:
        subset = df[(df["Country"] == country) & (df["Population"] == population)]

    if subset.empty:
        subset = df[df["Country"] == country]

    if subset.empty:
        subset = df.copy()

    # Age window (only if enough samples)
    age_subset = subset[np.abs(subset["Age"] - age) <= age_window]
    if len(age_subset) >= min_group_size:
        subset = age_subset

    return subset


def compute_micronutrient_risks(
    country: str,
    population: str,
    gender: str,
    age: float,
    *,
    age_window: float = 10.0,
    min_group_size: int = 5,
    top_n: int = 5,
    min_risk_threshold: float = 0.15,
) -> List[Dict[str, Any]]:
    """
    Core computation: given a profile, compute per-micronutrient risk estimates.

    Returns a list of dicts, sorted by descending risk, each with:
        {
            "micronutrient": str,
            "risk": float,          # 0..1
            "risk_bucket": str,
            "n_samples": int,
        }
    """
    df = _load_dataframe()
    subset = _filter_by_profile(df, country, population, gender, age, age_window, min_group_size)

    if subset.empty:
        return []

    # Compute mean risk and sample count per micronutrient
    grouped = (
        subset.groupby("Micronutrient", observed=False)["True_Risk"]
        .agg(["mean", "count"])
        .dropna()
        .reset_index()
        .rename(columns={"mean": "mean_risk", "count": "n_samples"})
    )

    if grouped.empty:
        return []

    grouped = grouped.sort_values("mean_risk", ascending=False)

    # Filter by threshold or keep top_n
    risky = grouped[grouped["mean_risk"] >= min_risk_threshold]
    if risky.empty:
        risky = grouped.head(top_n)
    else:
        risky = risky.head(top_n)

    results: List[Dict[str, Any]] = []
    for _, row in risky.iterrows():
        risk = float(row["mean_risk"])
        results.append(
            {
                "micronutrient": str(row["Micronutrient"]),
                "risk": risk,
                "risk_bucket": risk_bucket(risk),
                "n_samples": int(row["n_samples"]),
            }
        )

    return results


def get_micronutrient_risk_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    High-level function intended to be called from FastAPI.

    Parameters
    ----------
    profile : dict
        Expected keys (case-sensitive):
            - "country": str
            - "population": str
            - "gender": str
            - "age": float or int

    Returns
    -------
    dict
        JSON-serializable structure with:
            {
                "input_profile": {...},
                "micronutrient_risks": [...],
                "top_micronutrient": {...} or None,
                "summary_text": str,
            }
    """
    country = str(profile.get("country", "")).strip()
    population = str(profile.get("population", "")).strip()
    gender = str(profile.get("gender", "")).strip()
    age_raw = profile.get("age", 0)
    age = float(age_raw)

    if not country:
        raise ValueError("Profile is missing 'country'.")
    if not population:
        raise ValueError("Profile is missing 'population'.")
    if not gender:
        raise ValueError("Profile is missing 'gender'.")

    risks = compute_micronutrient_risks(country, population, gender, age)

    # Build summary information
    top_micro: Optional[Dict[str, Any]] = risks[0] if risks else None

    if top_micro is None:
        summary_text = (
            "No micronutrient risk estimates could be computed for the given profile; "
            "the dataset may not contain any matching or similar records."
        )
    else:
        risk = top_micro["risk"]
        bucket = top_micro["risk_bucket"]
        name = top_micro["micronutrient"]
        summary_text = (
            f"For a {age:.0f}-year-old {gender} in {country} from the '{population}' group, "
            f"the model predicts a {risk * 100:.1f}% chance of {name} deficiency, "
            f"which we would describe as a {bucket} risk level. "
            f"In plain terms: out of 100 people with this profile, "
            f"about {risk * 100:.0f} might be deficient in this micronutrient."
        )

    return {
        "input_profile": {
            "country": country,
            "population": population,
            "gender": gender,
            "age": age,
        },
        "micronutrient_risks": risks,
        "top_micronutrient": top_micro,
        "summary_text": summary_text,
    }


# ---------------------------------------------------------------------------
# Simple CLI test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Example manual test
    example_profile = {
        "country": "Korea",
        "population": "Men",
        "gender": "Male",
        "age": 50.0,
    }
    result = get_micronutrient_risk_profile(example_profile)
    import json
    print(json.dumps(result, indent=2))
