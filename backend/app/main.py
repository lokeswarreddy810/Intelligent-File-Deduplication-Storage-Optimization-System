from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import global_exception_handler
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    Path(settings.upload_path).mkdir(parents=True, exist_ok=True)
    Path(settings.temp_path).mkdir(parents=True, exist_ok=True)
    yield


configure_logging()

app = FastAPI(
    title=settings.app_name,
    description="Intelligent File Deduplication and Storage Optimization API",
    version="1.0.0",
    debug=settings.debug,
    lifespan=lifespan
)

app.add_exception_handler(Exception, global_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router)