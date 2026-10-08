from fastapi.testclient import TestClient


def test_upload_file_requires_authentication(
    client: TestClient
):
    response = client.post(
        "/api/v1/files/upload",
        files={
            "file": (
                "sample.txt",
                b"test content",
                "text/plain"
            )
        }
    )

    assert response.status_code == 401


def test_upload_file_returns_file_metadata(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "sample.txt",
                b"test content",
                "text/plain"
            )
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_filename"] == "sample.txt"
    assert data["file_size"] == len(b"test content")
    assert data["extension"] == "txt"
    assert data["status"] == "processing"
    assert data["is_deleted"] is False


def test_upload_rejects_unsupported_file_type(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "malware.exe",
                b"test content",
                "application/octet-stream"
            )
        }
    )

    assert response.status_code == 400
    assert "not allowed" in response.json()["detail"]


def test_upload_rejects_empty_file(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "empty.txt",
                b"",
                "text/plain"
            )
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Empty files are not allowed"


def test_list_files_supports_search_and_pagination(
    client: TestClient,
    auth_headers: dict[str, str]
):
    for filename in [
        "alpha.txt",
        "beta.txt",
        "alpha-report.txt"
    ]:
        response = client.post(
            "/api/v1/files/upload",
            headers=auth_headers,
            files={
                "file": (
                    filename,
                    filename.encode(),
                    "text/plain"
                )
            }
        )

        assert response.status_code == 201

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "search": "alpha",
            "page": 1,
            "page_size": 1
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 2
    assert data["page"] == 1
    assert data["page_size"] == 1
    assert data["total_pages"] == 2
    assert len(data["items"]) == 1


def test_list_files_filters_by_extension(
    client: TestClient,
    auth_headers: dict[str, str]
):
    for filename, content_type in [
        ("document.txt", "text/plain"),
        ("image.png", "image/png")
    ]:
        response = client.post(
            "/api/v1/files/upload",
            headers=auth_headers,
            files={
                "file": (
                    filename,
                    b"content",
                    content_type
                )
            }
        )

        assert response.status_code == 201

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={"extension": "png"}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["original_filename"] == "image.png"


def test_list_files_rejects_invalid_size_range(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "min_size": 100,
            "max_size": 10
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "min_size cannot be greater than max_size"
    )


def test_get_file_details(
    client: TestClient,
    auth_headers: dict[str, str]
):
    upload = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "details.txt",
                b"details content",
                "text/plain"
            )
        }
    )

    assert upload.status_code == 201

    file_id = upload.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json()["id"] == file_id
    assert response.json()["original_filename"] == "details.txt"


def test_download_file(
    client: TestClient,
    auth_headers: dict[str, str]
):
    content = b"download content"

    upload = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "download.txt",
                content,
                "text/plain"
            )
        }
    )

    assert upload.status_code == 201

    file_id = upload.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}/download",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.content == content
    assert "attachment" in response.headers["content-disposition"]
    assert "download.txt" in response.headers["content-disposition"]


def test_user_cannot_access_another_users_file(
    client: TestClient,
    auth_headers: dict[str, str],
    second_auth_headers: dict[str, str]
):
    upload = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "private.txt",
                b"private content",
                "text/plain"
            )
        }
    )

    assert upload.status_code == 201

    file_id = upload.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}",
        headers=second_auth_headers
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


def test_get_file_metadata(
    client,
    auth_headers
):
    upload = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "metadata-test.txt",
                b"metadata test content",
                "text/plain"
            )
        }
    )

    assert upload.status_code == 201

    file_id = upload.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}/metadata",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["file_id"] == file_id
    assert data["file_type"] == "text/plain"
    assert data["metadata_json"]["original_filename"] == (
        "metadata-test.txt"
    )
    assert data["metadata_json"]["extension"] == "txt"
    assert data["created_date"] is not None
    assert data["modified_date"] is not None
    assert data["last_accessed"] is not None


def test_get_file_metadata_requires_authentication(
    client
):
    response = client.get(
        "/api/v1/files/non-existent-file/metadata"
    )

    assert response.status_code == 401


def test_get_file_metadata_returns_not_found_for_unknown_file(
    client,
    auth_headers
):
    response = client.get(
        "/api/v1/files/non-existent-file/metadata",
        headers=auth_headers
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


def test_user_cannot_access_another_users_file_metadata(
    client,
    auth_headers,
    second_auth_headers
):
    upload = client.post(
        "/api/v1/files/upload",
        headers=auth_headers,
        files={
            "file": (
                "private-metadata.txt",
                b"private metadata content",
                "text/plain"
            )
        }
    )

    assert upload.status_code == 201

    file_id = upload.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}/metadata",
        headers=second_auth_headers
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


def test_list_files_filters_duplicate_files_only(
    client,
    auth_headers,
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

    duplicate = file_factory(
        user,
        filename="duplicate.txt",
        size=100,
        status="duplicate"
    )

    file_factory(
        user,
        filename="unique.txt",
        size=200,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "duplicate_only": True
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["id"] == duplicate.id
    assert data["items"][0]["status"] == "duplicate"


def test_list_files_duplicate_filter_returns_empty_when_no_duplicates_exist(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="unique-one.txt",
        size=100,
        status="ready"
    )

    file_factory(
        user,
        filename="unique-two.txt",
        size=200,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "duplicate_only": True
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["items"] == []
    assert data["total_pages"] == 0


def test_list_files_duplicate_filter_respects_search(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    matching_duplicate = file_factory(
        user,
        filename="report-duplicate.txt",
        size=100,
        status="duplicate"
    )

    file_factory(
        user,
        filename="other-duplicate.txt",
        size=100,
        status="duplicate"
    )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "duplicate_only": True,
            "search": "report"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["id"] == matching_duplicate.id
    assert data["items"][0]["status"] == "duplicate"


def test_list_files_duplicate_filter_respects_pagination(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    duplicates = []

    for index in range(3):
        duplicates.append(
            file_factory(
                user,
                filename=f"duplicate-{index}.txt",
                size=100,
                status="duplicate"
            )
        )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "duplicate_only": True,
            "page": 1,
            "page_size": 2
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert data["total_pages"] == 2
    assert len(data["items"]) == 2


def test_list_files_rejects_invalid_date_range(
    client,
    auth_headers
):
    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "start_date": "2026-10-10T00:00:00",
            "end_date": "2026-10-01T00:00:00"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "start_date cannot be greater than end_date"
    )


def test_list_files_accepts_valid_date_range(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="date-filter.txt",
        size=100,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "start_date": "2025-12-01T00:00:00",
            "end_date": "2026-12-31T23:59:59"
        }
    )

    assert response.status_code == 200
    assert response.json()["total"] == 1


def test_list_files_accepts_same_start_and_end_date(
    client,
    auth_headers,
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="same-date.txt",
        size=100,
        status="ready"
    )

    db.commit()

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
        params={
            "start_date": "2026-01-01T10:00:00",
            "end_date": "2026-01-01T10:00:00"
        }
    )

    assert response.status_code == 200