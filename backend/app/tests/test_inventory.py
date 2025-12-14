def test_purchase_decreases_quantity(client, admin_token):
    client.post(
        "/api/sweets",
        json={
            "name": "Barfi",
            "category": "Indian",
            "price": 25,
            "quantity": 2
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    response = client.post(
        "/api/sweets/1/purchase",
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert response.status_code == 200
