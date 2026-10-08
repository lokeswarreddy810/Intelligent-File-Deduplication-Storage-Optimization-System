from sqlalchemy.orm import Session

from app.models.file_metadata import FileMetadata
from app.repositories.file_repository import FileRepository
from app.repositories.metadata_repository import MetadataRepository


class MetadataServiceError(Exception):
    pass


class MetadataNotFoundError(MetadataServiceError):
    pass


class MetadataService:
    def __init__(self, db: Session):
        self.db = db
        self.file_repository = FileRepository(db)
        self.metadata_repository = MetadataRepository(db)

    def get_file_metadata(
        self,
        user_id: str,
        file_id: str
    ) -> FileMetadata:
        file = self.file_repository.get_by_id(
            file_id=file_id,
            user_id=user_id
        )

        if not file:
            raise MetadataNotFoundError(
                "File not found"
            )

        metadata = self.metadata_repository.get_by_file_id(
            file_id=file_id
        )

        if not metadata:
            raise MetadataNotFoundError(
                "File metadata not found"
            )

        return metadata