import pytest
from uuid import UUID
from app.database import seed_database, get_all_products, get_product

def test_seed_database():
    """Test that seed_database creates products and returns product IDs"""
    product_ids = seed_database()
    
    assert len(product_ids) > 0
    assert all(isinstance(pid, UUID) for pid in product_ids)
    
    original_ids = [str(pid) for pid in product_ids]
    seed_database()  # Should not recreate database
    
    products = get_all_products()
    current_ids = [str(p.id) for p in products]
    
    assert sorted(original_ids) == sorted(current_ids)

def test_get_all_products():
    """Test that get_all_products returns a list of products"""
    products = get_all_products()
    
    assert len(products) > 0
    
    for product in products:
        assert product.name
        assert product.description
        assert product.brand
        assert product.category
        assert product.price > 0
        assert product.average_rating >= 0
        assert product.review_count >= 0
        
        if product.images:
            assert len(product.images) > 0
            assert product.images[0].url
            assert product.images[0].alt_text
        
        if product.variants:
            assert len(product.variants) > 0
            assert product.variants[0].name
            assert product.variants[0].sku
            assert product.variants[0].price > 0
            assert product.variants[0].inventory_count >= 0
        
        if product.reviews:
            assert len(product.reviews) > 0
            assert product.reviews[0].user_name
            assert 1 <= product.reviews[0].rating <= 5
            assert product.reviews[0].comment

def test_get_product():
    """Test that get_product returns a specific product by ID"""
    products = get_all_products()
    assert len(products) > 0
    
    product_id = str(products[0].id)
    product = get_product(product_id)
    
    assert product is not None
    assert str(product.id) == product_id
    
    assert get_product("non-existent-id") is None
