from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DuplicateFileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    original_filename: str
    file_size: int
    mime_type: str
    extension: str
    status: str
    created_at: datetime


class DuplicateGroupResponse(BaseModel):
    id: str
    hash_value: str
    algorithm: str
    original_file: DuplicateFileResponse
    duplicate_files: list[DuplicateFileResponse]
    total_files: int
    file_size: int
    total_storage: int
    potential_savings: int
    last_detected_at: datetime