from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    File as FastAPIFile,
    HTTPException,
    Query,
    UploadFile
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.file import (
    FileListResponse,
    FileMetadataResponse,
    FileResponse as FileResponseSchema
)
from app.services.file_service import (
    FileNotFoundError,
    FileService,
    FileValidationError
)
from app.services.metadata_service import (
    MetadataNotFoundError,
    MetadataService
)

router = APIRouter(
    prefix="/files",
    tags=["Files"]
)


@router.post(
    "/upload",
    response_model=FileResponseSchema,
    status_code=201
)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FileService(db)

    try:
        return await service.upload(
            user_id=current_user.id,
            upload_file=file
        )
    except FileValidationError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc


@router.get(
    "",
    response_model=FileListResponse
)
def list_files(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    extension: str | None = Query(None),
    min_size: int | None = Query(None, ge=0),
    max_size: int | None = Query(None, ge=0),
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    duplicate_only: bool = Query(False),
    sort_by: str = Query(
        "created_at",
        pattern="^(filename|size|created_at|updated_at|extension)$"
    ),
    sort_order: str = Query(
        "desc",
        pattern="^(asc|desc)$"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FileService(db)

    if (
        min_size is not None
        and max_size is not None
        and min_size > max_size
    ):
        raise HTTPException(
            status_code=400,
            detail="min_size cannot be greater than max_size"
        )

    if (
        start_date is not None
        and end_date is not None
        and start_date > end_date
    ):
        raise HTTPException(
            status_code=400,
            detail="start_date cannot be greater than end_date"
        )

    files, total, total_pages = service.list_files(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        search=search,
        extension=extension,
        min_size=min_size,
        max_size=max_size,
        start_date=start_date,
        end_date=end_date,
        duplicate_only=duplicate_only,
        sort_by=sort_by,
        sort_order=sort_order
    )

    return FileListResponse(
        items=files,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages
    )


@router.get(
    "/{file_id}/metadata",
    response_model=FileMetadataResponse
)
def get_file_metadata(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = MetadataService(db)

    try:
        return service.get_file_metadata(
            user_id=current_user.id,
            file_id=file_id
        )
    except MetadataNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        ) from exc


@router.get(
    "/{file_id}",
    response_model=FileResponseSchema
)
def get_file_details(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FileService(db)

    try:
        return service.get_file(
            user_id=current_user.id,
            file_id=file_id
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        ) from exc


@router.get(
    "/{file_id}/download"
)
def download_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FileService(db)

    try:
        file = service.get_file(
            user_id=current_user.id,
            file_id=file_id
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        ) from exc

    return FileResponse(
        path=file.storage_path,
        filename=file.original_filename,
        media_type=file.mime_type
    )