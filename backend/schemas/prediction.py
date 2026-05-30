from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    face_detected: bool
    model_version: str


class PredictionRecord(BaseModel):
    id: UUID
    image_filename: Optional[str] = None
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    source: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PredictionHistoryResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[PredictionRecord]
