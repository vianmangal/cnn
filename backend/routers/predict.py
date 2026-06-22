from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models.db_models import Prediction
from backend.schemas.prediction import PredictionResponse
from backend.services.inference import run_inference

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("", response_model=PredictionResponse)
async def predict_emotion(
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
):
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty image payload.")

    try:
        result = run_inference(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    record = Prediction(
        image_filename=image.filename or "upload.jpg",
        emotion=result["emotion"],
        confidence=result["confidence"],
        all_scores=result["all_scores"],
    )
    session.add(record)
    await session.commit()

    return result
