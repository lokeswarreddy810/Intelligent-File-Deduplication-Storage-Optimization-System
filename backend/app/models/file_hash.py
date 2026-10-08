from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.file import File


class FileHash(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "file_hashes"

    file_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True
    )

    algorithm: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="SHA256"
    )

    hash_value: Mapped[str] = mapped_column(
        String(64),
        nullable=False
    )

    hashed_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    file: Mapped["File"] = relationship(
        back_populates="file_hash"
    )

    __table_args__ = (
        Index(
            "ix_file_hashes_algorithm_hash",
            "algorithm",
            "hash_value"
        ),
    )