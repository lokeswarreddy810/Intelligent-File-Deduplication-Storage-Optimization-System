from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.file import File


class FileRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, file: File) -> File:
        self.db.add(file)
        self.db.flush()
        self.db.refresh(file)
        return file

    def get_by_id(
        self,
        file_id: str,
        user_id: str
    ) -> File | None:
        statement = select(File).where(
            File.id == file_id,
            File.user_id == user_id,
            File.is_deleted.is_(False)
        )

        return self.db.scalar(statement)

    def list_files(
        self,
        user_id: str,
        page: int,
        page_size: int,
        search: str | None = None,
        extension: str | None = None,
        min_size: int | None = None,
        max_size: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        duplicate_only: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> tuple[list[File], int]:
        filters = [
            File.user_id == user_id,
            File.is_deleted.is_(False)
        ]

        if search:
            filters.append(
                File.original_filename.ilike(f"%{search}%")
            )

        if extension:
            filters.append(
                File.extension == extension.lower().lstrip(".")
            )

        if min_size is not None:
            filters.append(File.file_size >= min_size)

        if max_size is not None:
            filters.append(File.file_size <= max_size)

        if start_date is not None:
            filters.append(File.created_at >= start_date)

        if end_date is not None:
            filters.append(File.created_at <= end_date)

        if duplicate_only:
            filters.append(File.status == "duplicate")

        sort_columns = {
            "filename": File.original_filename,
            "size": File.file_size,
            "created_at": File.created_at,
            "updated_at": File.updated_at,
            "extension": File.extension
        }

        sort_column = sort_columns.get(
            sort_by,
            File.created_at
        )

        if sort_order.lower() == "asc":
            order_expression = sort_column.asc()
        else:
            order_expression = sort_column.desc()

        count_statement = select(
            func.count(File.id)
        ).where(*filters)

        total = self.db.scalar(count_statement) or 0

        statement = (
            select(File)
            .where(*filters)
            .order_by(order_expression)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        files = list(
            self.db.scalars(statement).all()
        )

        return files, total

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

        return int(
            self.db.scalar(statement) or 0
        )

    def mark_deleted(
        self,
        file: File
    ) -> File:
        file.is_deleted = True
        file.status = "deleted"
        self.db.flush()
        self.db.refresh(file)
        return file