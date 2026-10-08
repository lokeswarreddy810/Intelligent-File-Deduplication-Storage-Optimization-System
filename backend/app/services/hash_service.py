from pathlib import Path

from sqlalchemy.orm import Session

from app.models.file import File
from app.repositories.file_repository import FileRepository
from app.services.duplicate_service import DuplicateService
from app.utils.hash_utils import calculate_sha256


class HashService:
    def __init__(self, db: Session):
        self.db = db
        self.file_repository = FileRepository(db)
        self.duplicate_service = DuplicateService(db)

    def process_file(
        self,
        file_id: str,
        user_id: str
    ) -> bool:
        file = self.file_repository.get_by_id(
            file_id=file_id,
            user_id=user_id
        )

        if not file:
            raise ValueError("File not found")

        file_path = Path(file.storage_path)

        if not file_path.is_file():
            file.status = "failed"
            self.db.commit()
            raise FileNotFoundError(
                "Stored file is not available"
            )

        hash_value = calculate_sha256(file_path)

        is_duplicate = self.duplicate_service.process_hash(
            file=file,
            hash_value=hash_value
        )

        self.db.commit()

        return is_duplicate