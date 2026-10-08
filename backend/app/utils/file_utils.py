import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower().lstrip(".")


def validate_file_extension(filename: str) -> str:
    extension = get_file_extension(filename)

    if not extension:
        raise ValueError("File extension is required")

    if extension not in settings.allowed_extensions_list:
        raise ValueError(
            f"File type '.{extension}' is not allowed"
        )

    return extension


def generate_stored_filename(extension: str) -> str:
    return f"{uuid.uuid4()}.{extension}"


def get_storage_path(stored_filename: str) -> Path:
    return Path(settings.upload_path) / stored_filename


async def save_uploaded_file(
    upload_file: UploadFile,
    destination: Path
) -> int:
    total_size = 0
    chunk_size = 1024 * 1024

    destination.parent.mkdir(parents=True, exist_ok=True)

    try:
        with destination.open("wb") as output_file:
            while True:
                chunk = await upload_file.read(chunk_size)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > settings.max_file_size_bytes:
                    raise ValueError(
                        f"File size exceeds the maximum allowed size of "
                        f"{settings.max_file_size_mb} MB"
                    )

                output_file.write(chunk)

    except Exception:
        if destination.exists():
            destination.unlink()

        raise

    return total_size


def delete_stored_file(stored_filename: str) -> None:
    file_path = get_storage_path(stored_filename)

    if file_path.exists():
        file_path.unlink()


def file_exists(stored_filename: str) -> bool:
    return get_storage_path(stored_filename).is_file()