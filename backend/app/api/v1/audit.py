from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.services.deletion_service import DeletionService


class AuditLogResponse(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: str | None
    details: dict | None
    ip_address: str | None
    created_at: datetime


router = APIRouter(
    prefix="/audit",
    tags=["Audit"]
)


@router.get(
    "/logs",
    response_model=list[AuditLogResponse]
)
def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DeletionService(db)

    return service.list_audit_logs(
        user_id=current_user.id
    )