from fastapi.testclient import TestClient


def test_register_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "integration@example.com",
            "password": "Password123!",
            "full_name": "Integration User"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "integration@example.com"
    assert data["full_name"] == "Integration User"
    assert data["role"] == "user"
    assert data["is_active"] is True
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_email_returns_conflict(
    client: TestClient
):
    payload = {
        "email": "duplicate@example.com",
        "password": "Password123!",
        "full_name": "Duplicate User"
    }

    first = client.post(
        "/api/v1/auth/register",
        json=payload
    )

    second = client.post(
        "/api/v1/auth/register",
        json=payload
    )

    assert first.status_code == 201
    assert second.status_code == 409
    assert second.json()["detail"] == (
        "Email address is already registered"
    )


def test_login_returns_access_token(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "Password123!",
            "full_name": "Login User"
        }
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "Password123!"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_login_with_invalid_password_returns_unauthorized(
    client: TestClient
):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "invalid-login@example.com",
            "password": "Password123!",
            "full_name": "Invalid Login User"
        }
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "invalid-login@example.com",
            "password": "WrongPassword123!"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_me_requires_authentication(client: TestClient):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401


def test_me_returns_authenticated_user(
    client: TestClient,
    auth_headers: dict[str, str]
):
    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"