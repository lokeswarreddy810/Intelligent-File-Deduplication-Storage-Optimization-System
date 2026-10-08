import shutil
import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.audit_log import AuditLog
from app.models.deletion_history import DeletionHistory
from app.models.duplicate_group import DuplicateGroup
from app.models.file import File
from app.models.file_hash import FileHash
from app.repositories.audit_repository import AuditRepository
from app.repositories.deletion_repository import DeletionRepository
from app.schemas.deletion import FileDeleteResponse


class DeletionServiceError(Exception):
    pass


class DeletionFileNotFoundError(DeletionServiceError):
    pass


class ProtectedFileError(DeletionServiceError):
    pass


class DeletionConfirmationError(DeletionServiceError):
    pass


class DeletionService:
    def __init__(self, db: Session):
        self.db = db
        self.deletion_repository = DeletionRepository(db)
        self.audit_repository = AuditRepository(db)

    def get_deletion_impact(
        self,
        user_id: str,
        file_id: str
    ) -> dict:
        file = self._get_file(user_id, file_id)

        duplicate_group = self._get_duplicate_group(
            user_id=user_id,
            file_id=file_id
        )

        is_duplicate = file.status == "duplicate"
        is_original = (
            duplicate_group is not None
            and duplicate_group.original_file_id == file.id
        )

        replacement_original_id = None

        if is_original:
            replacement = self._get_replacement_file(
                user_id=user_id,
                group=duplicate_group,
                excluded_file_id=file.id
            )

            if replacement:
                replacement_original_id = replacement.id

        return {
            "file_id": file.id,
            "filename": file.original_filename,
            "file_size": file.file_size,
            "is_protected": file.is_protected,
            "is_duplicate": is_duplicate,
            "is_original": is_original,
            "storage_recovered": file.file_size,
            "replacement_original_id": replacement_original_id,
            "requires_confirmation": True
        }

    def delete_file(
        self,
        user_id: str,
        file_id: str,
        confirm: bool,
        ip_address: str | None = None
    ) -> FileDeleteResponse:
        if not confirm:
            raise DeletionConfirmationError(
                "Deletion confirmation is required"
            )

        file = self._get_file(user_id, file_id)

        if file.is_protected:
            raise ProtectedFileError(
                "Protected files cannot be deleted"
            )

        duplicate_group = self._get_duplicate_group(
            user_id=user_id,
            file_id=file_id
        )

        was_duplicate = file.status == "duplicate"
        was_original = (
            duplicate_group is not None
            and duplicate_group.original_file_id == file.id
        )

        replacement_original = None

        if was_original:
            replacement_original = self._get_replacement_file(
                user_id=user_id,
                group=duplicate_group,
                excluded_file_id=file.id
            )

        source_path = Path(file.storage_path)

        if not source_path.is_file():
            raise DeletionFileNotFoundError(
                "Stored file is no longer available"
            )

        temp_directory = Path(settings.temp_path)
        temp_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        temporary_path = (
            temp_directory
            / f"delete-{uuid.uuid4()}-{file.stored_filename}"
        )

        try:
            shutil.move(
                str(source_path),
                str(temporary_path)
            )

            file.is_deleted = True
            file.status = "deleted"

            if duplicate_group:
                self._update_duplicate_group(
                    group=duplicate_group,
                    deleted_file=file,
                    replacement_original=replacement_original
                )

            deletion = DeletionHistory(
                user_id=user_id,
                file_id=file.id,
                filename=file.original_filename,
                file_size=file.file_size,
                reason="User requested file deletion",
                storage_recovered=file.file_size
            )

            self.deletion_repository.create(deletion)

            audit_log = AuditLog(
                user_id=user_id,
                action="FILE_DELETED",
                entity_type="file",
                entity_id=file.id,
                details={
                    "filename": file.original_filename,
                    "file_size": file.file_size,
                    "storage_recovered": file.file_size,
                    "was_duplicate": was_duplicate,
                    "was_original": was_original,
                    "replacement_original_id": (
                        replacement_original.id
                        if replacement_original
                        else None
                    )
                },
                ip_address=ip_address
            )

            self.audit_repository.create(audit_log)

            self.db.commit()

            temporary_path.unlink(missing_ok=True)

            return FileDeleteResponse(
                file_id=file.id,
                filename=file.original_filename,
                storage_recovered=file.file_size,
                deleted_at=deletion.deleted_at,
                message="File deleted successfully"
            )

        except Exception:
            self.db.rollback()

            if temporary_path.exists() and not source_path.exists():
                source_path.parent.mkdir(
                    parents=True,
                    exist_ok=True
                )

                shutil.move(
                    str(temporary_path),
                    str(source_path)
                )

            raise

    def list_deletion_history(
        self,
        user_id: str
    ) -> list[DeletionHistory]:
        return self.deletion_repository.list_by_user(user_id)

    def list_audit_logs(
        self,
        user_id: str
    ) -> list[AuditLog]:
        return self.audit_repository.list_by_user(user_id)

    def _get_file(
        self,
        user_id: str,
        file_id: str
    ) -> File:
        statement = select(File).where(
            File.id == file_id,
            File.user_id == user_id,
            File.is_deleted.is_(False)
        )

        file = self.db.scalar(statement)

        if not file:
            raise DeletionFileNotFoundError(
                "File not found"
            )

        return file

    def _get_duplicate_group(
        self,
        user_id: str,
        file_id: str
    ) -> DuplicateGroup | None:
        file_hash = self.db.scalar(
            select(FileHash).where(
                FileHash.file_id == file_id
            )
        )

        if not file_hash:
            return None

        statement = (
            select(DuplicateGroup)
            .join(
                FileHash,
                FileHash.id == DuplicateGroup.hash_id
            )
            .where(
                DuplicateGroup.user_id == user_id,
                FileHash.algorithm == file_hash.algorithm,
                FileHash.hash_value == file_hash.hash_value
            )
            .limit(1)
        )

        return self.db.scalar(statement)

    def _get_replacement_file(
        self,
        user_id: str,
        group: DuplicateGroup,
        excluded_file_id: str
    ) -> File | None:
        group_hash = self.db.scalar(
            select(FileHash).where(
                FileHash.id == group.hash_id
            )
        )

        if not group_hash:
            return None

        statement = (
            select(File)
            .join(
                FileHash,
                FileHash.file_id == File.id
            )
            .where(
                File.user_id == user_id,
                FileHash.algorithm == group_hash.algorithm,
                FileHash.hash_value == group_hash.hash_value,
                File.id != excluded_file_id,
                File.is_deleted.is_(False)
            )
            .order_by(
                File.created_at.asc(),
                File.id.asc()
            )
            .limit(1)
        )

        return self.db.scalar(statement)

    def _get_remaining_files(
        self,
        group: DuplicateGroup,
        deleted_file_id: str
    ) -> list[File]:
        group_hash = self.db.scalar(
            select(FileHash).where(
                FileHash.id == group.hash_id
            )
        )

        if not group_hash:
            return []

        statement = (
            select(File)
            .join(
                FileHash,
                FileHash.file_id == File.id
            )
            .where(
                File.user_id == group.user_id,
                FileHash.algorithm == group_hash.algorithm,
                FileHash.hash_value == group_hash.hash_value,
                File.id != deleted_file_id,
                File.is_deleted.is_(False)
            )
            .order_by(
                File.created_at.asc(),
                File.id.asc()
            )
        )

        return list(
            self.db.scalars(statement).all()
        )

    def _update_duplicate_group(
        self,
        group: DuplicateGroup,
        deleted_file: File,
        replacement_original: File | None
    ) -> None:
        remaining_files = self._get_remaining_files(
            group=group,
            deleted_file_id=deleted_file.id
        )

        if len(remaining_files) < 2:
            self.db.delete(group)

            for remaining_file in remaining_files:
                remaining_file.status = "ready"

            return

        original_file = replacement_original

        if original_file is None:
            original_file = min(
                remaining_files,
                key=lambda item: (
                    item.created_at,
                    item.id
                )
            )

        original_hash = self.db.scalar(
            select(FileHash).where(
                FileHash.file_id == original_file.id
            )
        )

        if not original_hash:
            raise DeletionServiceError(
                "Original file hash record is missing"
            )

        group.original_file_id = original_file.id
        group.hash_id = original_hash.id
        group.total_files = len(remaining_files)
        group.file_size = original_file.file_size
        group.total_storage = sum(
            item.file_size
            for item in remaining_files
        )
        group.potential_savings = (
            group.total_storage - original_file.file_size
        )

        for remaining_file in remaining_files:
            remaining_file.status = (
                "original"
                if remaining_file.id == original_file.id
                else "duplicate"
            )