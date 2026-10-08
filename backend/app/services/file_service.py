import math
from datetime import datetime

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.models.file import File
from app.models.file_metadata import FileMetadata
from app.repositories.file_repository import FileRepository
from app.repositories.metadata_repository import MetadataRepository
from app.utils.file_utils import (
    delete_stored_file,
    file_exists,
    generate_stored_filename,
    get_storage_path,
    save_uploaded_file,
    validate_file_extension
)


class FileServiceError(Exception):
    pass


class FileNotFoundError(FileServiceError):
    pass


class FileValidationError(FileServiceError):
    pass


class ProtectedFileError(FileServiceError):
    pass


class FileService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = FileRepository(db)
        self.metadata_repository = MetadataRepository(db)

    async def upload(
        self,
        user_id: str,
        upload_file: UploadFile
    ) -> File:
        if not upload_file.filename:
            raise FileValidationError(
                "Filename is required"
            )

        try:
            extension = validate_file_extension(
                upload_file.filename
            )
        except ValueError as exc:
            raise FileValidationError(
                str(exc)
            ) from exc

        stored_filename = generate_stored_filename(
            extension
        )

        destination = get_storage_path(
            stored_filename
        )

        try:
            file_size = await save_uploaded_file(
                upload_file,
                destination
            )
        except ValueError as exc:
            raise FileValidationError(
                str(exc)
            ) from exc

        if file_size == 0:
            delete_stored_file(
                stored_filename
            )

            raise FileValidationError(
                "Empty files are not allowed"
            )

        file = File(
            user_id=user_id,
            original_filename=upload_file.filename,
            stored_filename=stored_filename,
            storage_path=str(destination),
            file_size=file_size,
            mime_type=(
                upload_file.content_type
                or "application/octet-stream"
            ),
            extension=extension,
            status="processing",
            is_protected=False,
            is_deleted=False
        )

        try:
            self.repository.create(file)

            metadata = FileMetadata(
                file_id=file.id,
                file_type=upload_file.content_type,
                created_date=datetime.fromtimestamp(
                    destination.stat().st_ctime
                ),
                modified_date=datetime.fromtimestamp(
                    destination.stat().st_mtime
                ),
                last_accessed=datetime.fromtimestamp(
                    destination.stat().st_atime
                ),
                metadata_json={
                    "original_filename": (
                        upload_file.filename
                    ),
                    "extension": extension
                }
            )

            self.metadata_repository.create(
                metadata
            )

            self.db.commit()
            self.db.refresh(file)

            celery_app.send_task(
                "process_file_hash",
                args=[
                    file.id,
                    user_id
                ]
            )

            return file

        except Exception:
            self.db.rollback()
            delete_stored_file(
                stored_filename
            )
            raise

    def get_file(
        self,
        user_id: str,
        file_id: str
    ) -> File:
        file = self.repository.get_by_id(
            file_id=file_id,
            user_id=user_id
        )

        if not file:
            raise FileNotFoundError(
                "File not found"
            )

        if not file_exists(
            file.stored_filename
        ):
            raise FileNotFoundError(
                "Stored file is no longer available"
            )

        return file

    def list_files(
        self,
        user_id: str,
        page: int,
        page_size: int,
        search: str | None = None,
        extension: str | None = None,
        min_size: int | None = None,
        max_size: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        duplicate_only: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> tuple[list[File], int, int]:
        files, total = self.repository.list_files(
            user_id=user_id,
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

        total_pages = (
            math.ceil(
                total / page_size
            )
            if total
            else 0
        )

        return files, total, total_pages

    def delete(
        self,
        user_id: str,
        file_id: str
    ) -> File:
        file = self.repository.get_by_id(
            file_id=file_id,
            user_id=user_id
        )

        if not file:
            raise FileNotFoundError(
                "File not found"
            )

        if file.is_protected:
            raise ProtectedFileError(
                "Protected files cannot be deleted"
            )

        return file