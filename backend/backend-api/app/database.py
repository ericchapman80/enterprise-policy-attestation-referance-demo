from app.models import Product, ProductImage, ProductVariant, ProductReview
from uuid import uuid4, UUID
from datetime import datetime, timedelta
import random

products_db = {}

def seed_database():
    """Seed the database with sample products"""
    if products_db:
        return [UUID(pid) for pid in products_db.keys()]
    
    product_ids = []
    
    product_id = uuid4()
    product_ids.append(product_id)
    
    images = [
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Pro+Main",
            alt_text="Widget Pro Main Image",
            is_primary=True
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Pro+Side",
            alt_text="Widget Pro Side View"
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Pro+Back",
            alt_text="Widget Pro Back View"
        )
    ]
    
    variants = [
        ProductVariant(
            name="Widget Pro Small Black",
            sku="WP-S-BLK",
            price=99.99,
            inventory_count=25,
            color="Black",
            size="Small"
        ),
        ProductVariant(
            name="Widget Pro Medium Black",
            sku="WP-M-BLK",
            price=99.99,
            inventory_count=15,
            color="Black",
            size="Medium"
        ),
        ProductVariant(
            name="Widget Pro Large Black",
            sku="WP-L-BLK",
            price=99.99,
            inventory_count=10,
            color="Black",
            size="Large"
        ),
        ProductVariant(
            name="Widget Pro Small Blue",
            sku="WP-S-BLU",
            price=99.99,
            inventory_count=20,
            color="Blue",
            size="Small"
        ),
        ProductVariant(
            name="Widget Pro Medium Blue",
            sku="WP-M-BLU",
            price=99.99,
            inventory_count=12,
            color="Blue",
            size="Medium"
        ),
        ProductVariant(
            name="Widget Pro Large Blue",
            sku="WP-L-BLU",
            price=99.99,
            inventory_count=8,
            color="Blue",
            size="Large"
        )
    ]
    
    reviews = []
    for i in range(5):
        days_ago = random.randint(1, 30)
        reviews.append(
            ProductReview(
                user_name=f"User{i+1}",
                rating=random.randint(3, 5),
                comment=f"This is a great product! Review {i+1}",
                created_at=datetime.now() - timedelta(days=days_ago)
            )
        )
    
    products_db[str(product_id)] = Product(
        id=product_id,
        name="Widget Pro",
        description="The Widget Pro is our flagship product with advanced features and premium build quality.",
        brand="WidgetCo",
        category="Premium Widgets",
        price=99.99,
        average_rating=4.5,
        review_count=len(reviews),
        images=images,
        variants=variants,
        reviews=reviews
    )
    
    product_id = uuid4()
    product_ids.append(product_id)
    
    images = [
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Lite+Main",
            alt_text="Widget Lite Main Image",
            is_primary=True
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Lite+Side",
            alt_text="Widget Lite Side View"
        )
    ]
    
    variants = [
        ProductVariant(
            name="Widget Lite Red",
            sku="WL-RED",
            price=49.99,
            inventory_count=30,
            color="Red"
        ),
        ProductVariant(
            name="Widget Lite Green",
            sku="WL-GRN",
            price=49.99,
            inventory_count=25,
            color="Green"
        ),
        ProductVariant(
            name="Widget Lite Blue",
            sku="WL-BLU",
            price=49.99,
            inventory_count=20,
            color="Blue"
        )
    ]
    
    reviews = []
    for i in range(3):
        days_ago = random.randint(1, 30)
        reviews.append(
            ProductReview(
                user_name=f"User{i+10}",
                rating=random.randint(3, 5),
                comment=f"Good budget option! Review {i+1}",
                created_at=datetime.now() - timedelta(days=days_ago)
            )
        )
    
    products_db[str(product_id)] = Product(
        id=product_id,
        name="Widget Lite",
        description="The Widget Lite is our budget-friendly option with essential features.",
        brand="WidgetCo",
        category="Basic Widgets",
        price=49.99,
        average_rating=4.0,
        review_count=len(reviews),
        images=images,
        variants=variants,
        reviews=reviews
    )
    
    product_id = uuid4()
    product_ids.append(product_id)
    
    images = [
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Ultra+Main",
            alt_text="Widget Ultra Main Image",
            is_primary=True
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Ultra+Side",
            alt_text="Widget Ultra Side View"
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Ultra+Back",
            alt_text="Widget Ultra Back View"
        ),
        ProductImage(
            url="https://placehold.co/600x400?text=Widget+Ultra+Detail",
            alt_text="Widget Ultra Detail View"
        )
    ]
    
    variants = [
        ProductVariant(
            name="Widget Ultra Titanium",
            sku="WU-TI",
            price=199.99,
            sale_price=179.99,
            inventory_count=5,
            color="Titanium"
        ),
        ProductVariant(
            name="Widget Ultra Gold",
            sku="WU-GLD",
            price=249.99,
            inventory_count=3,
            color="Gold"
        )
    ]
    
    reviews = []
    for i in range(2):
        days_ago = random.randint(1, 15)
        reviews.append(
            ProductReview(
                user_name=f"User{i+20}",
                rating=5,
                comment=f"Absolutely premium quality! Review {i+1}",
                created_at=datetime.now() - timedelta(days=days_ago)
            )
        )
    
    products_db[str(product_id)] = Product(
        id=product_id,
        name="Widget Ultra",
        description="The Widget Ultra is our premium offering with exclusive features and luxury materials.",
        brand="WidgetCo",
        category="Luxury Widgets",
        price=199.99,
        sale_price=179.99,
        average_rating=5.0,
        review_count=len(reviews),
        images=images,
        variants=variants,
        reviews=reviews
    )
    
    return product_ids

def get_all_products():
    """Get all products from the database"""
    if not products_db:
        seed_database()
    return list(products_db.values())

def get_product(product_id: str):
    """Get a product by ID"""
    if not products_db:
        seed_database()
    return products_db.get(product_id)
