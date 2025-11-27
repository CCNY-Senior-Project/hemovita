# backend/app/schema.py

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


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


class ReportResponse(BaseModel):
    labels: Dict[str, str]
    supplement_plan: Dict[str, List[str]]
    foods: Dict[str, List[FoodItem]]
    network_notes: List[str]
    report_text: str
