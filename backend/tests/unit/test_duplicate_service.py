from sqlalchemy import select

from app.models.duplicate_group import DuplicateGroup
from app.models.file_hash import FileHash
from app.services.duplicate_service import DuplicateService


def test_process_hash_marks_unique_file_ready(
    db,
    user,
    file_factory
):
    file = file_factory(
        user,
        filename="unique.txt",
        size=100
    )

    service = DuplicateService(db)

    result = service.process_hash(
        file=file,
        hash_value="a" * 64
    )

    db.commit()

    assert result is False
    assert file.status == "ready"

    assert db.scalar(
        select(DuplicateGroup)
    ) is None

    file_hash = db.scalar(
        select(FileHash).where(
            FileHash.file_id == file.id
        )
    )

    assert file_hash.hash_value == "a" * 64


def test_process_hash_creates_duplicate_group_for_identical_content(
    db,
    user,
    file_factory
):
    first = file_factory(
        user,
        filename="first.txt",
        size=100
    )

    second = file_factory(
        user,
        filename="renamed.txt",
        size=100
    )

    service = DuplicateService(db)

    first_result = service.process_hash(
        file=first,
        hash_value="b" * 64
    )

    second_result = service.process_hash(
        file=second,
        hash_value="b" * 64
    )

    db.commit()

    group = db.scalar(
        select(DuplicateGroup)
    )

    assert first_result is False
    assert second_result is True

    assert group is not None
    assert group.user_id == user.id
    assert group.original_file_id == first.id
    assert group.total_files == 2
    assert group.file_size == 100
    assert group.total_storage == 200
    assert group.potential_savings == 100

    assert first.status == "original"
    assert second.status == "duplicate"


def test_process_hash_adds_third_copy_to_existing_group(
    db,
    user,
    file_factory
):
    first = file_factory(
        user,
        filename="first.txt",
        size=100
    )

    second = file_factory(
        user,
        filename="second.txt",
        size=100
    )

    third = file_factory(
        user,
        filename="third.txt",
        size=100
    )

    service = DuplicateService(db)

    service.process_hash(
        file=first,
        hash_value="c" * 64
    )

    service.process_hash(
        file=second,
        hash_value="c" * 64
    )

    service.process_hash(
        file=third,
        hash_value="c" * 64
    )

    db.commit()

    groups = list(
        db.scalars(
            select(DuplicateGroup)
        ).all()
    )

    assert len(groups) == 1
    assert groups[0].total_files == 3
    assert groups[0].total_storage == 300
    assert groups[0].potential_savings == 200

    assert first.status == "original"
    assert second.status == "duplicate"
    assert third.status == "duplicate"


def test_process_hash_reconciles_existing_group_when_file_becomes_unique(
    db,
    user,
    file_factory
):
    first = file_factory(
        user,
        filename="first.txt",
        size=100
    )

    second = file_factory(
        user,
        filename="second.txt",
        size=100
    )

    service = DuplicateService(db)

    service.process_hash(
        file=first,
        hash_value="d" * 64
    )

    service.process_hash(
        file=second,
        hash_value="d" * 64
    )

    assert db.scalar(
        select(DuplicateGroup)
    ) is not None

    service.process_hash(
        file=second,
        hash_value="e" * 64
    )

    db.commit()

    assert db.scalar(
        select(DuplicateGroup)
    ) is None

    assert first.status == "ready"
    assert second.status == "ready"


def test_process_hash_does_not_cross_user_boundaries(
    db,
    user,
    second_user,
    file_factory
):
    first = file_factory(
        user,
        filename="user-one.txt",
        size=100
    )

    second = file_factory(
        second_user,
        filename="user-two.txt",
        size=100
    )

    service = DuplicateService(db)

    first_result = service.process_hash(
        file=first,
        hash_value="f" * 64
    )

    second_result = service.process_hash(
        file=second,
        hash_value="f" * 64
    )

    db.commit()

    groups = list(
        db.scalars(
            select(DuplicateGroup)
        ).all()
    )

    assert first_result is False
    assert second_result is False
    assert len(groups) == 0

    assert first.status == "ready"
    assert second.status == "ready"


def test_process_hash_ignores_deleted_matching_files(
    db,
    user,
    file_factory
):
    active = file_factory(
        user,
        filename="active.txt",
        size=100
    )

    deleted = file_factory(
        user,
        filename="deleted.txt",
        size=100,
        is_deleted=True
    )

    service = DuplicateService(db)

    service.process_hash(
        file=active,
        hash_value="1" * 64
    )

    service.process_hash(
        file=deleted,
        hash_value="1" * 64
    )

    db.commit()

    assert active.status == "ready"

    assert db.scalar(
        select(DuplicateGroup)
    ) is None