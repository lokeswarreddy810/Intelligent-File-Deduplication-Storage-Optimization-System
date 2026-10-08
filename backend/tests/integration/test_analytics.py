from fastapi.testclient import TestClient


def test_storage_analytics_requires_authentication(
    client: TestClient
):
    response = client.get("/api/v1/analytics/storage")

    assert response.status_code == 401


def test_storage_analytics_returns_user_storage_metrics(
    client: TestClient,
    auth_headers: dict[str, str],
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="original.txt",
        size=100,
        status="original"
    )

    file_factory(
        user,
        filename="duplicate.txt",
        size=100,
        status="duplicate"
    )

    file_factory(
        user,
        filename="unique.txt",
        size=50,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/analytics/storage",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_files"] == 3
    assert data["total_storage"] == 250
    assert data["duplicate_files"] == 1
    assert data["duplicate_storage"] == 100
    assert data["potential_storage_savings"] == 100
    assert len(data["largest_files"]) == 3
    assert len(data["recent_uploads"]) == 3


def test_storage_analytics_respects_limits(
    client: TestClient,
    auth_headers: dict[str, str],
    db,
    user,
    file_factory
):
    for index in range(5):
        file_factory(
            user,
            filename=f"file-{index}.txt",
            size=100 + index,
            status="ready"
        )

    db.commit()

    response = client.get(
        "/api/v1/analytics/storage",
        headers=auth_headers,
        params={
            "largest_limit": 2,
            "recent_limit": 3
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["largest_files"]) == 2
    assert len(data["recent_uploads"]) == 3


def test_storage_analytics_isolated_between_users(
    client: TestClient,
    auth_headers: dict[str, str],
    second_auth_headers: dict[str, str],
    db,
    user,
    second_user,
    file_factory
):
    file_factory(
        user,
        filename="user-one.txt",
        size=100,
        status="ready"
    )

    file_factory(
        second_user,
        filename="user-two.txt",
        size=500,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/analytics/storage",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json()["total_files"] == 1
    assert response.json()["total_storage"] == 100

    second_response = client.get(
        "/api/v1/analytics/storage",
        headers=second_auth_headers
    )

    assert second_response.status_code == 200
    assert second_response.json()["total_files"] == 1
    assert second_response.json()["total_storage"] == 500