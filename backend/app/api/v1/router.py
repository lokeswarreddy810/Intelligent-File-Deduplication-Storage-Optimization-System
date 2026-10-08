from fastapi import APIRouter

from app.api.v1 import (
    analytics,
    audit,
    auth,
    deletion,
    duplicates,
    files,
    health
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(files.router)
api_router.include_router(duplicates.router)
api_router.include_router(analytics.router)
api_router.include_router(deletion.router)
api_router.include_router(audit.router)