from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DeletionImpactResponse(BaseModel):
    file_id: str
    filename: str
    file_size: int
    is_protected: bool
    is_duplicate: bool
    is_original: bool
    storage_recovered: int
    replacement_original_id: str | None
    requires_confirmation: bool


class FileDeleteRequest(BaseModel):
    confirm: bool


class FileDeleteResponse(BaseModel):
    file_id: str
    filename: str
    storage_recovered: int
    deleted_at: datetime
    message: str


class DeletionHistoryResponse(BaseModel):
    id: str
    file_id: str
    filename: str
    file_size: int
    reason: str
    storage_recovered: int
    deleted_at: datetime

    model_config = ConfigDict(from_attributes=True)