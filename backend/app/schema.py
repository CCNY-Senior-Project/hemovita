# backend/app/schema.py

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from typing_extensions import Literal

class PatientPayload(BaseModel):
    age: int
    sex: str
    country: Optional[str] = None
    notes: Optional[str] = None
    pregnant: Optional[bool] = None


class ReportRequest(BaseModel):
    labs: Dict[str, float]
    patient: PatientPayload
    diet_filter: Optional[str] = None  # you can wire this into suggest_foods later


class FoodItem(BaseModel):
    name: str
    serving_g: Optional[float] = None
    category: Optional[str] = None



class RiskProfileInput(BaseModel):
    country: str
    population: str
    gender: str
    age: float

class RiskMicronutrient(BaseModel):
    micronutrient: str
    predicted_risk: float


class RiskMeta(BaseModel):
    country: Optional[str] = None
    population: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None


class RiskProfile(BaseModel):
    overall_risk: float
    risk_bucket: Literal["low", "moderate", "high"]
    high_risk_micronutrients: List[RiskMicronutrient]
    micronutrient_risks: List[RiskMicronutrient]
    summary_text: str
    meta: RiskMeta

class ReportResponse(BaseModel):
    labels: Dict[str, str]
    supplement_plan: Dict[str, List[str]]
    foods: Dict[str, List[FoodItem]]
    network_notes: List[str]
    report_text: str
    micronutrient_risks: Optional[list[dict]] = None
    risk_summary_text: Optional[str] = None
    risk_profile: Optional[RiskProfile] = None