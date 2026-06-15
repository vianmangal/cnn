from typing import Dict

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    face_detected: bool
    model_version: str
