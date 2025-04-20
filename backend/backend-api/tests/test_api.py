import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_product, seed_database

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_product_by_id():
    product_ids = seed_database()
    product_id = str(product_ids[0])
    
    response = client.get(f"/api/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["id"] == product_id

def test_product_not_found():
    response = client.get("/api/products/nonexistent-id")
    assert response.status_code == 404
