def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200

def test_login_user(client):
    client.post(
        "/api/auth/register",
        json={"username": "loginuser", "password": "pass"}
    )

    response = client.post(
        "/api/auth/login",
        data={"username": "loginuser", "password": "pass"}
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
