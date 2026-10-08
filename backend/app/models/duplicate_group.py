from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.file import File
    from app.models.file_hash import FileHash
    from app.models.user import User


class DuplicateGroup(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "duplicate_groups"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    hash_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("file_hashes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    original_file_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("files.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    total_files: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=2
    )

    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False
    )

    total_storage: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False
    )

    potential_savings: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0
    )

    last_detected_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        back_populates="duplicate_groups"
    )

    hash_record: Mapped["FileHash"] = relationship()

    original_file: Mapped["File"] = relationship(
        foreign_keys=[original_file_id]
    )