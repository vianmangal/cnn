from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_session
from backend.models.db_models import Prediction, User
from backend.routers.auth import get_current_user_optional
from backend.schemas.prediction import PredictionResponse
from backend.services.inference import run_inference

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("", response_model=PredictionResponse)
async def predict_emotion(
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
    user: Optional[User] = Depends(get_current_user_optional),
):
    if not image:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing image.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty image payload.")

    try:
        result = run_inference(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if user is not None:
        record = Prediction(
            user_id=user.id,
            emotion=result["emotion"],
            confidence=result["confidence"],
            all_scores=result["all_scores"],
            face_detected=result["face_detected"],
            model_version=result["model_version"],
        )
        session.add(record)
        await session.commit()

    return result
