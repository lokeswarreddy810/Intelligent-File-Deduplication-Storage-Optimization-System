from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalyticsFileItem(BaseModel):
    id: str
    original_filename: str
    file_size: int
    mime_type: str
    extension: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StorageAnalyticsResponse(BaseModel):
    total_files: int
    total_storage: int
    duplicate_files: int
    duplicate_storage: int
    potential_storage_savings: int
    largest_files: list[AnalyticsFileItem]
    recent_uploads: list[AnalyticsFileItem]