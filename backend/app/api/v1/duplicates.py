from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.duplicate_group import DuplicateGroup
from app.models.file import File
from app.models.file_hash import FileHash
from app.models.user import User
from app.schemas.duplicate import (
    DuplicateFileResponse,
    DuplicateGroupResponse
)

router = APIRouter(
    prefix="/duplicates",
    tags=["Duplicates"]
)


@router.get(
    "",
    response_model=list[DuplicateGroupResponse]
)
def list_duplicate_groups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    groups = list(
        db.scalars(
            select(DuplicateGroup)
            .where(
                DuplicateGroup.user_id == current_user.id
            )
            .order_by(
                DuplicateGroup.last_detected_at.desc()
            )
        ).all()
    )

    response = []

    for group in groups:
        hash_record = db.scalar(
            select(FileHash).where(
                FileHash.id == group.hash_id
            )
        )

        original_file = db.scalar(
            select(File).where(
                File.id == group.original_file_id,
                File.user_id == current_user.id,
                File.is_deleted.is_(False)
            )
        )

        if not hash_record or not original_file:
            continue

        duplicate_files = list(
            db.scalars(
                select(File)
                .join(
                    FileHash,
                    FileHash.file_id == File.id
                )
                .where(
                    FileHash.algorithm == hash_record.algorithm,
                    FileHash.hash_value == hash_record.hash_value,
                    File.user_id == current_user.id,
                    File.id != original_file.id,
                    File.is_deleted.is_(False)
                )
                .order_by(File.created_at.asc())
            ).all()
        )

        response.append(
            DuplicateGroupResponse(
                id=group.id,
                hash_value=hash_record.hash_value,
                algorithm=hash_record.algorithm,
                original_file=DuplicateFileResponse.model_validate(
                    original_file
                ),
                duplicate_files=[
                    DuplicateFileResponse.model_validate(
                        item
                    )
                    for item in duplicate_files
                ],
                total_files=group.total_files,
                file_size=group.file_size,
                total_storage=group.total_storage,
                potential_savings=group.potential_savings,
                last_detected_at=group.last_detected_at
            )
        )

    return response


@router.get(
    "/{group_id}",
    response_model=DuplicateGroupResponse
)
def get_duplicate_group(
    group_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    group = db.scalar(
        select(DuplicateGroup).where(
            DuplicateGroup.id == group_id,
            DuplicateGroup.user_id == current_user.id
        )
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Duplicate group not found"
        )

    hash_record = db.scalar(
        select(FileHash).where(
            FileHash.id == group.hash_id
        )
    )

    original_file = db.scalar(
        select(File).where(
            File.id == group.original_file_id,
            File.user_id == current_user.id,
            File.is_deleted.is_(False)
        )
    )

    if not hash_record or not original_file:
        raise HTTPException(
            status_code=404,
            detail="Duplicate group data is incomplete"
        )

    duplicate_files = list(
        db.scalars(
            select(File)
            .join(
                FileHash,
                FileHash.file_id == File.id
            )
            .where(
                FileHash.algorithm == hash_record.algorithm,
                FileHash.hash_value == hash_record.hash_value,
                File.user_id == current_user.id,
                File.id != original_file.id,
                File.is_deleted.is_(False)
            )
            .order_by(File.created_at.asc())
        ).all()
    )

    return DuplicateGroupResponse(
        id=group.id,
        hash_value=hash_record.hash_value,
        algorithm=hash_record.algorithm,
        original_file=DuplicateFileResponse.model_validate(
            original_file
        ),
        duplicate_files=[
            DuplicateFileResponse.model_validate(item)
            for item in duplicate_files
        ],
        total_files=group.total_files,
        file_size=group.file_size,
        total_storage=group.total_storage,
        potential_savings=group.potential_savings,
        last_detected_at=group.last_detected_at
    )