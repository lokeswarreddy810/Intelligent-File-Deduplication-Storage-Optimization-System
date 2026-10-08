from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.analytics import StorageAnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/storage",
    response_model=StorageAnalyticsResponse
)
def get_storage_analytics(
    largest_limit: int = Query(
        default=10,
        ge=1,
        le=100
    ),
    recent_limit: int = Query(
        default=10,
        ge=1,
        le=100
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)

    return service.get_storage_analytics(
        user_id=current_user.id,
        largest_limit=largest_limit,
        recent_limit=recent_limit
    )