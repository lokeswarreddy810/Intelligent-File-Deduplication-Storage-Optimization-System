from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.deletion_history import DeletionHistory


class DeletionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        deletion: DeletionHistory
    ) -> DeletionHistory:
        self.db.add(deletion)
        self.db.flush()
        self.db.refresh(deletion)
        return deletion

    def list_by_user(
        self,
        user_id: str
    ) -> list[DeletionHistory]:
        statement = (
            select(DeletionHistory)
            .where(DeletionHistory.user_id == user_id)
            .order_by(DeletionHistory.deleted_at.desc())
        )

        return list(self.db.scalars(statement).all())