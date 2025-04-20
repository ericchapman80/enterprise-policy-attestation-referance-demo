import pytest
from datetime import datetime
from uuid import UUID
from app.models import Product, ProductImage, ProductVariant, ProductReview

def test_product_image_creation():
    """Test ProductImage model creation with default and custom values"""
    image = ProductImage(
        url="https://example.com/image.jpg",
        alt_text="Test Image"
    )
    assert isinstance(image.id, UUID)
    assert image.url == "https://example.com/image.jpg"
    assert image.alt_text == "Test Image"
    assert image.is_primary == False
    
    image = ProductImage(
        id=UUID("12345678-1234-5678-1234-567812345678"),
        url="https://example.com/primary.jpg",
        alt_text="Primary Image",
        is_primary=True
    )
    assert image.id == UUID("12345678-1234-5678-1234-567812345678")
    assert image.url == "https://example.com/primary.jpg"
    assert image.alt_text == "Primary Image"
    assert image.is_primary == True

def test_product_review_creation():
    """Test ProductReview model creation with default and custom values"""
    review = ProductReview(
        user_name="Test User",
        rating=4,
        comment="Great product!"
    )
    assert isinstance(review.id, UUID)
    assert review.user_name == "Test User"
    assert review.rating == 4
    assert review.comment == "Great product!"
    assert isinstance(review.created_at, datetime)
    
    test_date = datetime(2023, 1, 1, 12, 0, 0)
    review = ProductReview(
        id=UUID("12345678-1234-5678-1234-567812345678"),
        user_name="Another User",
        rating=5,
        comment="Excellent!",
        created_at=test_date
    )
    assert review.id == UUID("12345678-1234-5678-1234-567812345678")
    assert review.user_name == "Another User"
    assert review.rating == 5
    assert review.comment == "Excellent!"
    assert review.created_at == test_date

def test_product_variant_creation():
    """Test ProductVariant model creation with default and custom values"""
    variant = ProductVariant(
        name="Test Variant",
        sku="TEST-SKU",
        price=99.99,
        inventory_count=10
    )
    assert isinstance(variant.id, UUID)
    assert variant.name == "Test Variant"
    assert variant.sku == "TEST-SKU"
    assert variant.price == 99.99
    assert variant.sale_price is None
    assert variant.inventory_count == 10
    assert variant.color is None
    assert variant.size is None
    
    variant = ProductVariant(
        id=UUID("12345678-1234-5678-1234-567812345678"),
        name="Full Variant",
        sku="FULL-SKU",
        price=149.99,
        sale_price=129.99,
        inventory_count=5,
        color="Blue",
        size="Large"
    )
    assert variant.id == UUID("12345678-1234-5678-1234-567812345678")
    assert variant.name == "Full Variant"
    assert variant.sku == "FULL-SKU"
    assert variant.price == 149.99
    assert variant.sale_price == 129.99
    assert variant.inventory_count == 5
    assert variant.color == "Blue"
    assert variant.size == "Large"

def test_product_creation():
    """Test Product model creation with default and custom values"""
    product = Product(
        name="Test Product",
        description="Test Description",
        brand="Test Brand",
        category="Test Category",
        price=99.99
    )
    assert isinstance(product.id, UUID)
    assert product.name == "Test Product"
    assert product.description == "Test Description"
    assert product.brand == "Test Brand"
    assert product.category == "Test Category"
    assert product.price == 99.99
    assert product.sale_price is None
    assert product.average_rating == 0.0
    assert product.review_count == 0
    assert product.images == []
    assert product.variants == []
    assert product.reviews == []
    assert isinstance(product.created_at, datetime)
    assert isinstance(product.updated_at, datetime)
    
    test_date = datetime(2023, 1, 1, 12, 0, 0)
    image = ProductImage(url="https://example.com/image.jpg", alt_text="Test Image")
    variant = ProductVariant(name="Test Variant", sku="TEST-SKU", price=99.99, inventory_count=10)
    review = ProductReview(user_name="Test User", rating=4, comment="Great product!")
    
    product = Product(
        id=UUID("12345678-1234-5678-1234-567812345678"),
        name="Full Product",
        description="Full Description",
        brand="Full Brand",
        category="Full Category",
        price=199.99,
        sale_price=179.99,
        average_rating=4.5,
        review_count=10,
        images=[image],
        variants=[variant],
        reviews=[review],
        created_at=test_date,
        updated_at=test_date
    )
    assert product.id == UUID("12345678-1234-5678-1234-567812345678")
    assert product.name == "Full Product"
    assert product.description == "Full Description"
    assert product.brand == "Full Brand"
    assert product.category == "Full Category"
    assert product.price == 199.99
    assert product.sale_price == 179.99
    assert product.average_rating == 4.5
    assert product.review_count == 10
    assert len(product.images) == 1
    assert len(product.variants) == 1
    assert len(product.reviews) == 1
    assert product.created_at == test_date
    assert product.updated_at == test_date
