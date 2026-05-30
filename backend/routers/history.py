from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models.db_models import Prediction, User
from backend.routers.auth import get_current_user
from backend.schemas.prediction import PredictionHistoryResponse

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=PredictionHistoryResponse)
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    total_result = await session.execute(
        select(func.count()).select_from(Prediction).where(Prediction.user_id == user.id)
    )
    total = int(total_result.scalar_one())

    offset = (page - 1) * page_size
    result = await session.execute(
        select(Prediction)
        .where(Prediction.user_id == user.id)
        .order_by(Prediction.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    items = result.scalars().all()

    return PredictionHistoryResponse(
        page=page,
        page_size=page_size,
        total=total,
        items=items,
    )
