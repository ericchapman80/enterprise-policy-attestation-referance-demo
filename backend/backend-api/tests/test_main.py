import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import Product

client = TestClient(app)

def test_healthz():
    """Test the health check endpoint"""
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_list_products():
    """Test the list products endpoint"""
    response = client.get("/api/products")
    assert response.status_code == 200
    products = response.json()
    assert isinstance(products, list)
    assert len(products) > 0
    
    product = products[0]
    assert "id" in product
    assert "name" in product
    assert "description" in product
    assert "brand" in product
    assert "category" in product
    assert "price" in product
    assert "average_rating" in product
    assert "review_count" in product

def test_list_products_with_filters():
    """Test the list products endpoint with filters"""
    all_products = client.get("/api/products").json()
    if not all_products:
        pytest.skip("No products available for testing filters")
    
    category = all_products[0]["category"]
    response = client.get(f"/api/products?category={category}")
    assert response.status_code == 200
    filtered_products = response.json()
    assert all(p["category"] == category for p in filtered_products)
    
    brand = all_products[0]["brand"]
    response = client.get(f"/api/products?brand={brand}")
    assert response.status_code == 200
    filtered_products = response.json()
    assert all(p["brand"] == brand for p in filtered_products)
    
    min_price = 50.0
    response = client.get(f"/api/products?min_price={min_price}")
    assert response.status_code == 200
    filtered_products = response.json()
    assert all(p["price"] >= min_price for p in filtered_products)
    
    max_price = 150.0
    response = client.get(f"/api/products?max_price={max_price}")
    assert response.status_code == 200
    filtered_products = response.json()
    assert all(p["price"] <= max_price for p in filtered_products)
    
    response = client.get(f"/api/products?min_price={min_price}&max_price={max_price}")
    assert response.status_code == 200
    filtered_products = response.json()
    assert all(min_price <= p["price"] <= max_price for p in filtered_products)

def test_get_product_details():
    """Test the get product details endpoint"""
    all_products = client.get("/api/products").json()
    if not all_products:
        pytest.skip("No products available for testing product details")
    
    product_id = all_products[0]["id"]
    response = client.get(f"/api/products/{product_id}")
    assert response.status_code == 200
    product = response.json()
    
    assert product["id"] == product_id
    assert "name" in product
    assert "description" in product
    assert "brand" in product
    assert "category" in product
    assert "price" in product
    assert "average_rating" in product
    assert "review_count" in product
    
    assert "images" in product
    assert "variants" in product
    assert "reviews" in product

def test_get_product_details_not_found():
    """Test the get product details endpoint with invalid ID"""
    response = client.get("/api/products/non-existent-id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}
