from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.duplicate_group import DuplicateGroup


class DuplicateRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_hash_id(
        self,
        user_id: str,
        hash_id: str
    ) -> DuplicateGroup | None:
        statement = select(DuplicateGroup).where(
            DuplicateGroup.user_id == user_id,
            DuplicateGroup.hash_id == hash_id
        )

        return self.db.scalar(statement)

    def create(
        self,
        duplicate_group: DuplicateGroup
    ) -> DuplicateGroup:
        self.db.add(duplicate_group)
        self.db.flush()
        self.db.refresh(duplicate_group)
        return duplicate_group