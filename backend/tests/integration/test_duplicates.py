from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models.duplicate_group import DuplicateGroup
from app.models.file_hash import FileHash


def test_duplicate_groups_requires_authentication(
    client: TestClient
):
    response = client.get("/api/v1/duplicates")

    assert response.status_code == 401


def test_list_duplicate_groups_returns_group_data(
    client: TestClient,
    auth_headers: dict[str, str],
    db,
    user,
    file_factory
):
    first = file_factory(
        user,
        filename="original.txt",
        size=100,
        status="original",
        created_at=datetime(2026, 1, 1, 10, 0, 0)
    )

    second = file_factory(
        user,
        filename="duplicate.txt",
        size=100,
        status="duplicate",
        created_at=datetime(2026, 1, 1, 11, 0, 0)
    )

    first_hash = FileHash(
        file_id=first.id,
        algorithm="SHA256",
        hash_value="a" * 64
    )

    second_hash = FileHash(
        file_id=second.id,
        algorithm="SHA256",
        hash_value="a" * 64
    )

    db.add_all([first_hash, second_hash])
    db.flush()

    group = DuplicateGroup(
        user_id=user.id,
        hash_id=first_hash.id,
        original_file_id=first.id,
        total_files=2,
        file_size=100,
        total_storage=200,
        potential_savings=100
    )

    db.add(group)
    db.commit()

    response = client.get(
        "/api/v1/duplicates",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["id"] == group.id
    assert data[0]["hash_value"] == "a" * 64
    assert data[0]["algorithm"] == "SHA256"
    assert data[0]["total_files"] == 2
    assert data[0]["total_storage"] == 200
    assert data[0]["potential_savings"] == 100
    assert data[0]["original_file"]["id"] == first.id
    assert len(data[0]["duplicate_files"]) == 1
    assert data[0]["duplicate_files"][0]["id"] == second.id


def test_get_duplicate_group_returns_not_found_for_unknown_group(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.get(
        "/api/v1/duplicates/non-existent-group",
        headers=auth_headers
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Duplicate group not found"


def test_duplicate_group_isolated_between_users(
    client: TestClient,
    auth_headers: dict[str, str],
    second_auth_headers: dict[str, str],
    db,
    user,
    file_factory
):
    first = file_factory(
        user,
        filename="user-one.txt",
        size=100,
        status="original"
    )

    second = file_factory(
        user,
        filename="user-one-duplicate.txt",
        size=100,
        status="duplicate"
    )

    first_hash = FileHash(
        file_id=first.id,
        algorithm="SHA256",
        hash_value="b" * 64
    )

    second_hash = FileHash(
        file_id=second.id,
        algorithm="SHA256",
        hash_value="b" * 64
    )

    db.add_all([first_hash, second_hash])
    db.flush()

    group = DuplicateGroup(
        user_id=user.id,
        hash_id=first_hash.id,
        original_file_id=first.id,
        total_files=2,
        file_size=100,
        total_storage=200,
        potential_savings=100
    )

    db.add(group)
    db.commit()

    response = client.get(
        f"/api/v1/duplicates/{group.id}",
        headers=second_auth_headers
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Duplicate group not found"


def test_duplicate_group_excludes_deleted_files(
    client: TestClient,
    auth_headers: dict[str, str],
    db,
    user,
    file_factory
):
    original = file_factory(
        user,
        filename="original.txt",
        size=100,
        status="original"
    )

    duplicate = file_factory(
        user,
        filename="deleted-duplicate.txt",
        size=100,
        status="duplicate",
        is_deleted=True
    )

    original_hash = FileHash(
        file_id=original.id,
        algorithm="SHA256",
        hash_value="c" * 64
    )

    duplicate_hash = FileHash(
        file_id=duplicate.id,
        algorithm="SHA256",
        hash_value="c" * 64
    )

    db.add_all([original_hash, duplicate_hash])
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

    response = client.get(
        f"/api/v1/duplicates/{group.id}",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["original_file"]["id"] == original.id
    assert data["duplicate_files"] == []