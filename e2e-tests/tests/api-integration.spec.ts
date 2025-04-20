import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('backend API returns product data correctly', async ({ request }) => {
    const productsResponse = await request.get('http://localhost:8000/api/products');
    expect(productsResponse.ok()).toBeTruthy();
    
    const products = await productsResponse.json();
    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);
    
    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('brand');
    expect(product).toHaveProperty('category');
  });
  
  test('backend API returns single product details correctly', async ({ request }) => {
    const productsResponse = await request.get('http://localhost:8000/api/products');
    const products = await productsResponse.json();
    const productId = products[0].id;
    
    const productResponse = await request.get(`http://localhost:8000/api/products/${productId}`);
    expect(productResponse.ok()).toBeTruthy();
    
    const product = await productResponse.json();
    expect(product).toHaveProperty('id', productId);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('images');
    expect(product).toHaveProperty('variants');
    expect(product).toHaveProperty('reviews');
    
    expect(Array.isArray(product.images)).toBeTruthy();
    if (product.images.length > 0) {
      const image = product.images[0];
      expect(image).toHaveProperty('url');
      expect(image).toHaveProperty('alt_text');
    }
    
    expect(Array.isArray(product.variants)).toBeTruthy();
    if (product.variants.length > 0) {
      const variant = product.variants[0];
      expect(variant).toHaveProperty('name');
      expect(variant).toHaveProperty('sku');
      expect(variant).toHaveProperty('price');
      expect(variant).toHaveProperty('inventory_count');
    }
    
    expect(Array.isArray(product.reviews)).toBeTruthy();
    if (product.reviews.length > 0) {
      const review = product.reviews[0];
      expect(review).toHaveProperty('user_name');
      expect(review).toHaveProperty('rating');
      expect(review).toHaveProperty('comment');
    }
  });
  
  test('backend API returns 404 for non-existent product', async ({ request }) => {
    const productResponse = await request.get('http://localhost:8000/api/products/non-existent-id');
    expect(productResponse.status()).toBe(404);
  });
});
