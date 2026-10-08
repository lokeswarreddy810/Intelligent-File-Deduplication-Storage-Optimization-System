from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Intelligent File Deduplication System"
    app_env: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    redis_url: str
    celery_broker_url: str
    celery_result_backend: str

    storage_root: str = "storage"
    upload_directory: str = "uploads"
    temp_directory: str = "temp"

    max_file_size_mb: int = 1024
    allowed_extensions: str = ""
    cors_origins: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    @property
    def allowed_extensions_list(self) -> list[str]:
        return [
            item.strip().lower()
            for item in self.allowed_extensions.split(",")
            if item.strip()
        ]

    @property
    def cors_origins_list(self) -> list[str]:
        return [
            item.strip()
            for item in self.cors_origins.split(",")
            if item.strip()
        ]

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def upload_path(self) -> str:
        return f"{self.storage_root}/{self.upload_directory}"

    @property
    def temp_path(self) -> str:
        return f"{self.storage_root}/{self.temp_directory}"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()