from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import psycopg

from app.models import Product
from app.database import get_all_products, get_product, seed_database

app = FastAPI(
    title="Commerce API",
    description="API for product details in a commerce application",
    version="1.0.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup"""
    seed_database()

@app.get("/api/products", response_model=List[Product])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    brand: Optional[str] = Query(None, description="Filter by product brand"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter")
):
    """
    Get a list of all products with optional filtering
    """
    products = get_all_products()
    
    if category:
        products = [p for p in products if p.category.lower() == category.lower()]
    
    if brand:
        products = [p for p in products if p.brand.lower() == brand.lower()]
    
    if min_price is not None:
        products = [p for p in products if p.price >= min_price]
    
    if max_price is not None:
        products = [p for p in products if p.price <= max_price]
    
    return products

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product_details(product_id: str):
    """
    Get detailed information about a specific product
    """
    product = get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
