from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.file_hash import FileHash
    from app.models.file_metadata import FileMetadata
    from app.models.user import User


class File(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "files"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    stored_filename: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    storage_path: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True
    )

    mime_type: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    extension: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="processing",
        nullable=False,
        index=True
    )

    is_protected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )

    user: Mapped["User"] = relationship(
        back_populates="files"
    )

    file_hash: Mapped["FileHash | None"] = relationship(
        back_populates="file",
        uselist=False,
        cascade="all, delete-orphan"
    )

    metadata_record: Mapped["FileMetadata | None"] = relationship(
        back_populates="file",
        uselist=False,
        cascade="all, delete-orphan"
    )