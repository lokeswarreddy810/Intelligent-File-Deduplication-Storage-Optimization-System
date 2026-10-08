from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class FileMetadataResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    file_id: str
    file_type: str | None
    created_date: datetime | None
    modified_date: datetime | None
    last_accessed: datetime | None
    metadata_json: dict[str, Any] | None


class FileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    original_filename: str
    stored_filename: str
    file_size: int
    mime_type: str
    extension: str
    status: str
    is_protected: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime


class FileListResponse(BaseModel):
    items: list[FileResponse]
    page: int
    page_size: int
    total: int
    total_pages: int


class FileDeleteResponse(BaseModel):
    id: str
    filename: str
    storage_recovered: int
    message: str