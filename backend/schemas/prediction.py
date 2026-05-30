from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, ConfigDict


class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    face_detected: bool
    model_version: str


class PredictionRecord(BaseModel):
    id: int
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    face_detected: bool
    model_version: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PredictionHistoryResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[PredictionRecord]
