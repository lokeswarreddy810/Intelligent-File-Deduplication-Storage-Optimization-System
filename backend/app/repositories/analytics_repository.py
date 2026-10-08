from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.file import File


class AnalyticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_total_files(
        self,
        user_id: str
    ) -> int:
        statement = select(
            func.count(File.id)
        ).where(
            File.user_id == user_id,
            File.is_deleted.is_(False)
        )

        return int(self.db.scalar(statement) or 0)

    def get_total_storage(
        self,
        user_id: str
    ) -> int:
        statement = select(
            func.coalesce(func.sum(File.file_size), 0)
        ).where(
            File.user_id == user_id,
            File.is_deleted.is_(False)
        )

        return int(self.db.scalar(statement) or 0)

    def get_duplicate_files(
        self,
        user_id: str
    ) -> int:
        statement = select(
            func.count(File.id)
        ).where(
            File.user_id == user_id,
            File.status == "duplicate",
            File.is_deleted.is_(False)
        )

        return int(self.db.scalar(statement) or 0)

    def get_duplicate_storage(
        self,
        user_id: str
    ) -> int:
        statement = select(
            func.coalesce(func.sum(File.file_size), 0)
        ).where(
            File.user_id == user_id,
            File.status == "duplicate",
            File.is_deleted.is_(False)
        )

        return int(self.db.scalar(statement) or 0)

    def get_largest_files(
        self,
        user_id: str,
        limit: int = 10
    ) -> list[File]:
        statement = (
            select(File)
            .where(
                File.user_id == user_id,
                File.is_deleted.is_(False)
            )
            .order_by(File.file_size.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def get_recent_uploads(
        self,
        user_id: str,
        limit: int = 10
    ) -> list[File]:
        statement = (
            select(File)
            .where(
                File.user_id == user_id,
                File.is_deleted.is_(False)
            )
            .order_by(File.created_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())