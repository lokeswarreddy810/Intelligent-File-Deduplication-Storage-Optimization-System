from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.file import File


class FileMetadata(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "file_metadata"

    file_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True
    )

    file_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    created_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    modified_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    last_accessed: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    metadata_json: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    file: Mapped["File"] = relationship(
        back_populates="metadata_record"
    )