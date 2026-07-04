def test_list_products_empty(client):
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "pages" in data


def test_list_products_pagination_params(client):
    response = client.get("/api/products?page=2&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 2
    assert data["limit"] == 5


def test_get_product_not_found(client):
    response = client.get("/api/products/nonexistent-id")
    assert response.status_code == 404


def test_create_product_unauthenticated(client):
    response = client.post(
        "/api/products",
        json={"name": "Test", "brand": "Test", "category": "Test", "price": 99.99},
    )
    assert response.status_code == 403
