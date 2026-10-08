from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.file_metadata import FileMetadata


class MetadataRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        metadata: FileMetadata
    ) -> FileMetadata:
        self.db.add(metadata)
        self.db.flush()
        self.db.refresh(metadata)
        return metadata

    def get_by_file_id(
        self,
        file_id: str
    ) -> FileMetadata | None:
        statement = select(FileMetadata).where(
            FileMetadata.file_id == file_id
        )

        return self.db.scalar(statement)