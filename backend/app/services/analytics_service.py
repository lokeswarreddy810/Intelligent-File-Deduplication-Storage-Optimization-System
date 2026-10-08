from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.file import File


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_storage_analytics(
        self,
        user_id: str,
        largest_limit: int = 10,
        recent_limit: int = 10
    ) -> dict:
        active_files_filter = (
            File.user_id == user_id,
            File.is_deleted.is_(False)
        )

        total_files = self.db.scalar(
            select(func.count(File.id))
            .where(*active_files_filter)
        ) or 0

        total_storage = self.db.scalar(
            select(func.coalesce(func.sum(File.file_size), 0))
            .where(*active_files_filter)
        ) or 0

        duplicate_files = self.db.scalar(
            select(func.count(File.id))
            .where(
                *active_files_filter,
                File.status == "duplicate"
            )
        ) or 0

        duplicate_storage = self.db.scalar(
            select(func.coalesce(func.sum(File.file_size), 0))
            .where(
                *active_files_filter,
                File.status == "duplicate"
            )
        ) or 0

        largest_files = list(
            self.db.scalars(
                select(File)
                .where(*active_files_filter)
                .order_by(
                    File.file_size.desc(),
                    File.created_at.desc()
                )
                .limit(largest_limit)
            ).all()
        )

        recent_uploads = list(
            self.db.scalars(
                select(File)
                .where(*active_files_filter)
                .order_by(File.created_at.desc())
                .limit(recent_limit)
            ).all()
        )

        return {
            "total_files": total_files,
            "total_storage": total_storage,
            "duplicate_files": duplicate_files,
            "duplicate_storage": duplicate_storage,
            "potential_storage_savings": duplicate_storage,
            "largest_files": largest_files,
            "recent_uploads": recent_uploads
        }