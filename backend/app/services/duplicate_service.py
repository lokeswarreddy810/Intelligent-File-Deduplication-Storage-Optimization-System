from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.duplicate_group import DuplicateGroup
from app.models.file import File
from app.models.file_hash import FileHash
from app.repositories.hash_repository import HashRepository


class DuplicateService:
    def __init__(self, db: Session):
        self.db = db
        self.hash_repository = HashRepository(db)

    def process_hash(
        self,
        file: File,
        hash_value: str
    ) -> bool:
        existing_hash = self.hash_repository.get_by_file_id(file.id)

        if existing_hash:
            existing_hash.algorithm = "SHA256"
            existing_hash.hash_value = hash_value
            file_hash = existing_hash
        else:
            file_hash = FileHash(
                file_id=file.id,
                algorithm="SHA256",
                hash_value=hash_value
            )
            self.hash_repository.create(file_hash)
            self.db.flush()

        matching_hashes = self.hash_repository.get_by_hash(
            algorithm="SHA256",
            hash_value=hash_value
        )

        matching_file_ids = [
            item.file_id
            for item in matching_hashes
        ]

        matching_files = list(
            self.db.scalars(
                select(File)
                .where(
                    File.id.in_(matching_file_ids),
                    File.user_id == file.user_id,
                    File.is_deleted.is_(False)
                )
                .order_by(File.created_at.asc())
            ).all()
        )

        duplicate_group = self.db.scalar(
            select(DuplicateGroup)
            .join(
                FileHash,
                DuplicateGroup.hash_id == FileHash.id
            )
            .where(
                DuplicateGroup.user_id == file.user_id,
                FileHash.algorithm == "SHA256",
                FileHash.hash_value == hash_value
            )
        )

        if len(matching_files) < 2:
            file.status = "ready"

            if duplicate_group:
                original_file = self.db.get(
                    File,
                    duplicate_group.original_file_id
                )

                if original_file and original_file.id != file.id:
                    original_file.status = "ready"

                self.db.delete(duplicate_group)
                self.db.flush()

            return False

        original_file = matching_files[0]

        if duplicate_group is None:
            duplicate_group = DuplicateGroup(
                user_id=file.user_id,
                hash_id=file_hash.id,
                original_file_id=original_file.id,
                total_files=len(matching_files),
                file_size=original_file.file_size,
                total_storage=sum(
                    matching_file.file_size
                    for matching_file in matching_files
                ),
                potential_savings=(
                    sum(
                        matching_file.file_size
                        for matching_file in matching_files
                    ) - original_file.file_size
                )
            )

            self.db.add(duplicate_group)
        else:
            duplicate_group.hash_id = file_hash.id
            duplicate_group.original_file_id = original_file.id
            duplicate_group.total_files = len(matching_files)
            duplicate_group.file_size = original_file.file_size
            duplicate_group.total_storage = sum(
                matching_file.file_size
                for matching_file in matching_files
            )
            duplicate_group.potential_savings = (
                duplicate_group.total_storage
                - original_file.file_size
            )
            duplicate_group.last_detected_at = datetime.now(
                timezone.utc
            ).replace(tzinfo=None)

        for matching_file in matching_files:
            matching_file.status = (
                "original"
                if matching_file.id == original_file.id
                else "duplicate"
            )

        self.db.flush()

        return file.id != original_file.id