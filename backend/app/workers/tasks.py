from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.services.hash_service import HashService


@celery_app.task(
    name="process_file_hash",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3}
)
def process_file_hash(
    self,
    file_id: str,
    user_id: str
) -> str:
    db = SessionLocal()

    try:
        is_duplicate = HashService(db).process_file(
            file_id=file_id,
            user_id=user_id
        )

        return "duplicate" if is_duplicate else "processed"

    finally:
        db.close()


@celery_app.task(name="health_check_task")
def health_check_task() -> str:
    return "Celery worker is healthy"