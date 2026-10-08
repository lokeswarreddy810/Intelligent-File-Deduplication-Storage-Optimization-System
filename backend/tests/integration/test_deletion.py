from datetime import datetime

from sqlalchemy import select

from app.models.audit_log import AuditLog
from app.models.duplicate_group import DuplicateGroup
from app.models.file_hash import FileHash


def test_delete_original_records_correct_audit_status(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    original = file_factory(
        user,
        filename="original.txt",
        size=100,
        status="original",
        created_at=datetime(2026, 1, 1, 10, 0, 0)
    )

    duplicate = file_factory(
        user,
        filename="duplicate.txt",
        size=100,
        status="duplicate",
        created_at=datetime(2026, 1, 1, 11, 0, 0)
    )

    original_hash = FileHash(
        file_id=original.id,
        algorithm="SHA256",
        hash_value="d" * 64
    )

    duplicate_hash = FileHash(
        file_id=duplicate.id,
        algorithm="SHA256",
        hash_value="d" * 64
    )

    db.add_all(
        [
            original_hash,
            duplicate_hash
        ]
    )

    db.flush()

    group = DuplicateGroup(
        user_id=user.id,
        hash_id=original_hash.id,
        original_file_id=original.id,
        total_files=2,
        file_size=100,
        total_storage=200,
        potential_savings=100
    )

    db.add(group)
    db.commit()

    response = client.post(
        f"/api/v1/deletion/{original.id}",
        headers=auth_headers,
        json={
            "confirm": True
        }
    )

    assert response.status_code == 200

    audit_log = db.scalar(
        select(AuditLog)
        .where(
            AuditLog.user_id == user.id,
            AuditLog.entity_id == original.id,
            AuditLog.action == "FILE_DELETED"
        )
        .order_by(AuditLog.created_at.desc())
    )

    assert audit_log is not None
    assert audit_log.details["was_original"] is True
    assert audit_log.details["was_duplicate"] is False
    assert audit_log.details["replacement_original_id"] == duplicate.id

    refreshed_duplicate = db.get(
        type(duplicate),
        duplicate.id
    )

    assert refreshed_duplicate.status == "ready"

    remaining_group = db.scalar(
        select(DuplicateGroup).where(
            DuplicateGroup.id == group.id
        )
    )

    assert remaining_group is None