from collections.abc import Generator
from datetime import datetime, timedelta
from pathlib import Path

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.models import Base, User


@pytest.fixture
def db() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(engine)
    session = Session(engine)

    try:
        yield session
    finally:
        session.rollback()
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture
def user(db: Session) -> User:
    user = User(
        email="test@example.com",
        password_hash="test-password-hash",
        full_name="Test User",
        role="user",
        is_active=True
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture
def second_user(db: Session) -> User:
    user = User(
        email="second@example.com",
        password_hash="test-password-hash",
        full_name="Second User",
        role="user",
        is_active=True
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture
def temp_storage(tmp_path: Path) -> Path:
    storage_path = tmp_path / "storage"
    storage_path.mkdir(parents=True, exist_ok=True)
    return storage_path


@pytest.fixture
def sample_file(temp_storage: Path) -> Path:
    file_path = temp_storage / "sample.txt"
    file_path.write_bytes(b"intelligent file deduplication test data")
    return file_path


@pytest.fixture
def file_factory(db: Session, temp_storage: Path):
    counter = 0
    base_time = datetime(2026, 1, 1, 10, 0, 0)

    def create_file(
        user: User,
        filename: str = "sample.txt",
        size: int = 100,
        status: str = "processing",
        is_deleted: bool = False,
        created_at: datetime | None = None,
        content: bytes | None = None
    ):
        nonlocal counter
        counter += 1

        stored_filename = f"stored-{counter}.bin"
        storage_path = temp_storage / stored_filename

        if content is not None:
            storage_path.write_bytes(content)
        else:
            storage_path.write_bytes(b"x" * size)

        from app.models.file import File

        file = File(
            user_id=user.id,
            original_filename=filename,
            stored_filename=stored_filename,
            storage_path=str(storage_path),
            file_size=size if content is None else len(content),
            mime_type="text/plain",
            extension="txt",
            status=status,
            is_protected=False,
            is_deleted=is_deleted,
            created_at=created_at or base_time + timedelta(minutes=counter),
            updated_at=created_at or base_time + timedelta(minutes=counter)
        )

        db.add(file)
        db.flush()

        return file

    return create_file


@pytest.fixture
def client(db: Session, temp_storage: Path, monkeypatch):
    import sqlalchemy
    from fastapi.testclient import TestClient

    monkeypatch.setattr(
        sqlalchemy,
        "create_engine",
        lambda *args, **kwargs: db.get_bind()
    )

    from app.dependencies.database import get_db
    from app.main import app
    from app.services import file_service

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    monkeypatch.setattr(
        file_service,
        "get_storage_path",
        lambda stored_filename: temp_storage / stored_filename
    )

    monkeypatch.setattr(
        file_service,
        "file_exists",
        lambda stored_filename: (temp_storage / stored_filename).is_file()
    )

    monkeypatch.setattr(
        file_service.celery_app,
        "send_task",
        lambda *args, **kwargs: None
    )

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client, user):
    from app.core.security import create_access_token

    token = create_access_token(user.id)

    return {
        "Authorization": f"Bearer {token}"
    }


@pytest.fixture
def second_auth_headers(client, second_user):
    from app.core.security import create_access_token

    token = create_access_token(second_user.id)

    return {
        "Authorization": f"Bearer {token}"
    }