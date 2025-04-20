from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4

class ProductImage(BaseModel):
    id: UUID = uuid4()
    url: str
    alt_text: str
    is_primary: bool = False

class ProductReview(BaseModel):
    id: UUID = uuid4()
    user_name: str
    rating: int
    comment: str
    created_at: datetime = datetime.now()

class ProductVariant(BaseModel):
    id: UUID = uuid4()
    name: str
    sku: str
    price: float
    sale_price: Optional[float] = None
    inventory_count: int
    color: Optional[str] = None
    size: Optional[str] = None

class Product(BaseModel):
    id: UUID = uuid4()
    name: str
    description: str
    brand: str
    category: str
    price: float
    sale_price: Optional[float] = None
    average_rating: float = 0.0
    review_count: int = 0
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    reviews: List[ProductReview] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
