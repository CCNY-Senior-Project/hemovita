# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schema import ReportRequest, ReportResponse, FoodItem
from .engine import (
    PatientInfo,
    classify_panel,
    build_supplement_plan,
    load_food_data,
    suggest_foods,
    generate_report,
    FOOD_CSV_DEFAULT,
)


app = FastAPI(title="HemoVita API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/report", response_model=ReportResponse)
def api_report(payload: ReportRequest):
    # Build PatientInfo from incoming payload
    patient = PatientInfo(
        age=payload.patient.age,
        sex=payload.patient.sex,
        pregnant=payload.patient.pregnant,
        country=payload.patient.country,
        notes=payload.patient.notes,
    )

    # 1) Full text report
    report_text = generate_report(
        payload.labs,
        patient,
        FOOD_CSV_DEFAULT,
    )

    # 2) Structured extras for frontend
    labels = classify_panel(payload.labs)
    supp_plan = build_supplement_plan(labels)

    foods = {}
    if FOOD_CSV_DEFAULT.exists():
        food_df = load_food_data(FOOD_CSV_DEFAULT)
        foods_raw = suggest_foods(labels, food_df, top_n=5)
        for key, lst in foods_raw.items():
            foods[key] = [
                FoodItem(name=name, serving_g=serv_g, category=cat)
                for (name, serv_g, cat) in lst
            ]

    network_notes = [
        "Iron is scheduled away from calcium/zinc based on the nutrient interaction network.",
        "Vitamin C / D are co-dosed with iron when possible to boost absorption.",
    ]

    return ReportResponse(
        labels=labels,
        supplement_plan=supp_plan,
        foods=foods,
        network_notes=network_notes,
        report_text=report_text,
    )
