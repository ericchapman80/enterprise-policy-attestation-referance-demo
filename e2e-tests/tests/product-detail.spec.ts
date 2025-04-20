import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('displays product details correctly', async ({ page }) => {
    await page.goto('/products/1');
    
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await expect(page.locator('[data-testid="product-detail-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-detail-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-detail-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-detail-brand"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-detail-category"]')).toBeVisible();
    
    await expect(page.locator('[data-testid="product-image-gallery"]')).toBeVisible();
    
    await page.screenshot({ path: './screenshots/product-detail.png' });
  });
  
  test('allows selecting product variants', async ({ page }) => {
    await page.goto('/products/1');
    
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await expect(page.locator('[data-testid="variant-selector"]')).toBeVisible();
    
    await page.selectOption('[data-testid="variant-selector"]', { index: 1 });
    
    await expect(page.locator('[data-testid="selected-variant"]')).toBeVisible();
    
    await page.screenshot({ path: './screenshots/product-variant-selection.png' });
  });
  
  test('allows adjusting quantity and adding to cart', async ({ page }) => {
    await page.goto('/products/1');
    
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await expect(page.locator('[data-testid="quantity-selector"]')).toBeVisible();
    
    await page.click('[data-testid="increase-quantity"]');
    await page.click('[data-testid="increase-quantity"]');
    
    await expect(page.locator('[data-testid="quantity-input"]')).toHaveValue('3');
    
    await page.click('[data-testid="add-to-cart-button"]');
    
    await expect(page.locator('[data-testid="cart-notification"]')).toBeVisible();
    
    await page.screenshot({ path: './screenshots/add-to-cart.png' });
  });
  
  test('displays product reviews', async ({ page }) => {
    await page.goto('/products/1');
    
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await page.click('[data-testid="reviews-tab"]');
    
    await expect(page.locator('[data-testid="product-reviews"]')).toBeVisible();
    await expect(page.locator('[data-testid="review-item"]')).toBeVisible();
    
    await page.screenshot({ path: './screenshots/product-reviews.png' });
  });
});
