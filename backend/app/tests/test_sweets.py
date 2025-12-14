def test_admin_can_create_sweet(client, admin_token):
    response = client.post(
        "/api/sweets",
        json={
            "name": "Gulab Jamun",
            "category": "Indian",
            "price": 20,
            "quantity": 10
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200

def test_user_cannot_create_sweet(client, user_token):
    response = client.post(
        "/api/sweets",
        json={
            "name": "Rasgulla",
            "category": "Indian",
            "price": 15,
            "quantity": 5
        },
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403

def test_get_all_sweets(client, admin_token):
    response = client.get(
        "/api/sweets",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
