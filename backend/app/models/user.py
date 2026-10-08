from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.audit_log import AuditLog
    from app.models.deletion_history import DeletionHistory
    from app.models.duplicate_group import DuplicateGroup
    from app.models.file import File


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    role: Mapped[str] = mapped_column(
        Enum("user", "admin", name="user_role"),
        default="user",
        nullable=False,
        index=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    files: Mapped[list["File"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    duplicate_groups: Mapped[list["DuplicateGroup"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    deletion_history: Mapped[list["DeletionHistory"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    audit_logs: Mapped[list["AuditLog"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )