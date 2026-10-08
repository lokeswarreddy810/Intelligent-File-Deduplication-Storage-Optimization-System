from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.file_hash import FileHash


class HashRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_file_id(
        self,
        file_id: str
    ) -> FileHash | None:
        statement = select(FileHash).where(
            FileHash.file_id == file_id
        )

        return self.db.scalar(statement)

    def get_by_hash(
        self,
        algorithm: str,
        hash_value: str
    ) -> list[FileHash]:
        statement = (
            select(FileHash)
            .where(
                FileHash.algorithm == algorithm,
                FileHash.hash_value == hash_value
            )
        )

        return list(self.db.scalars(statement).all())

    def create(
        self,
        file_hash: FileHash
    ) -> FileHash:
        self.db.add(file_hash)
        self.db.flush()
        self.db.refresh(file_hash)
        return file_hash