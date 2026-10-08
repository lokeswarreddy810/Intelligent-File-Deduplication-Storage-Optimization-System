from pathlib import Path
from unittest.mock import ANY, MagicMock

import pytest

from app.services.hash_service import HashService


def test_process_file_raises_when_file_does_not_exist():
    db = MagicMock()
    repository = MagicMock()
    repository.get_by_id.return_value = None

    service = HashService(db)
    service.file_repository = repository

    with pytest.raises(ValueError, match="File not found"):
        service.process_file(
            file_id="missing-file",
            user_id="user-1"
        )


def test_process_file_raises_when_storage_file_is_missing():
    db = MagicMock()

    file_record = MagicMock()
    file_record.storage_path = "/missing/path/file.txt"

    repository = MagicMock()
    repository.get_by_id.return_value = file_record

    service = HashService(db)
    service.file_repository = repository

    with pytest.raises(
        FileNotFoundError,
        match="Stored file is not available"
    ):
        service.process_file(
            file_id="file-1",
            user_id="user-1"
        )

    assert file_record.status == "failed"
    db.commit.assert_called_once()


def test_process_file_calculates_hash_and_processes_duplicate(
    sample_file: Path
):
    db = MagicMock()

    file_record = MagicMock()
    file_record.storage_path = str(sample_file)

    repository = MagicMock()
    repository.get_by_id.return_value = file_record

    duplicate_service = MagicMock()
    duplicate_service.process_hash.return_value = True

    service = HashService(db)
    service.file_repository = repository
    service.duplicate_service = duplicate_service

    result = service.process_file(
        file_id="file-1",
        user_id="user-1"
    )

    assert result is True

    duplicate_service.process_hash.assert_called_once_with(
        file=file_record,
        hash_value=ANY
    )

    db.commit.assert_called_once()


def test_process_file_returns_false_for_unique_file(
    sample_file: Path
):
    db = MagicMock()

    file_record = MagicMock()
    file_record.storage_path = str(sample_file)

    repository = MagicMock()
    repository.get_by_id.return_value = file_record

    duplicate_service = MagicMock()
    duplicate_service.process_hash.return_value = False

    service = HashService(db)
    service.file_repository = repository
    service.duplicate_service = duplicate_service

    result = service.process_file(
        file_id="file-1",
        user_id="user-1"
    )

    assert result is False

    duplicate_service.process_hash.assert_called_once_with(
        file=file_record,
        hash_value=ANY
    )

    db.commit.assert_called_once()