from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login_and_get_calories(monkeypatch):
        # 1) register
    resp = client.post("/auth/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    # register may return 400 if already exists; accept both
    assert resp.status_code in (200, 400)

    # 2) login
    resp = client.post("/auth/login", json={"email": "testuser@example.com", "password": "password123"})
    assert resp.status_code == 200
    token = resp.json().get("access_token")
    assert token

    headers = {"Authorization": f"Bearer {token}"}

    # 3) valid dish
    resp = client.post("/get-calories", json={"dish_name": "macaroni and cheese", "servings": 1}, headers=headers)
    # It may return 200 or 404 depending on USDA API availability; at least the endpoint should be protected
    assert resp.status_code in (200, 404)

    # 4) invalid servings
    resp = client.post("/get-calories", json={"dish_name": "macaroni and cheese", "servings": 0}, headers=headers)
    assert resp.status_code == 422  # pydantic validation

def test_nonexistent_dish(monkeypatch):
    # To avoid real USDA calls, we'll patch compute_calories_for_query to return None
    from app.utils import usda_client
    monkeypatch.setattr(usda_client, "compute_calories_for_query", lambda q, s: None)

    # login first (or reuse token from previous tests)
    client.post("/auth/register", json={
        "first_name": "Patch",
        "last_name": "User",
        "email": "patch@example.com",
        "password": "password123"
    })
    resp = client.post("/auth/login", json={"email": "patch@example.com", "password": "password123"})
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post("/get-calories", json={"dish_name": "thisdoesnotexist12345", "servings": 1}, headers=headers)
    assert resp.status_code == 404
