from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.deletion import (
    DeletionHistoryResponse,
    DeletionImpactResponse,
    FileDeleteRequest,
    FileDeleteResponse
)
from app.services.deletion_service import (
    DeletionConfirmationError,
    DeletionFileNotFoundError,
    DeletionService,
    ProtectedFileError
)

router = APIRouter(
    prefix="/deletion",
    tags=["Deletion"]
)


@router.get(
    "/{file_id}/impact",
    response_model=DeletionImpactResponse
)
def get_deletion_impact(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DeletionService(db)

    try:
        return service.get_deletion_impact(
            user_id=current_user.id,
            file_id=file_id
        )
    except DeletionFileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        ) from exc


@router.post(
    "/{file_id}",
    response_model=FileDeleteResponse
)
def delete_file(
    file_id: str,
    request: FileDeleteRequest,
    http_request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DeletionService(db)

    client_ip = (
        http_request.client.host
        if http_request.client
        else None
    )

    try:
        return service.delete_file(
            user_id=current_user.id,
            file_id=file_id,
            confirm=request.confirm,
            ip_address=client_ip
        )
    except DeletionConfirmationError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc
    except ProtectedFileError as exc:
        raise HTTPException(
            status_code=403,
            detail=str(exc)
        ) from exc
    except DeletionFileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        ) from exc


@router.get(
    "/history",
    response_model=list[DeletionHistoryResponse]
)
def get_deletion_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DeletionService(db)

    return service.list_deletion_history(
        user_id=current_user.id
    )