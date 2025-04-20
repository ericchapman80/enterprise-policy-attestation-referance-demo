import { test, expect } from '@playwright/test';

test.describe('Product Listing Page', () => {
  test('displays product cards with correct information', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="product-card"]');
    
    const productCards = await page.locator('[data-testid="product-card"]').all();
    expect(productCards.length).toBeGreaterThan(0);
    
    const firstCard = productCards[0];
    await expect(firstCard.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="product-image"]')).toBeVisible();
    
    await page.screenshot({ path: './screenshots/product-listing.png' });
  });
  
  test('allows filtering products by category', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="product-card"]');
    
    const initialProductCount = await page.locator('[data-testid="product-card"]').count();
    
    await page.selectOption('[data-testid="category-filter"]', 'Premium Widgets');
    
    await page.waitForTimeout(500);
    
    const filteredProductCount = await page.locator('[data-testid="product-card"]').count();
    expect(filteredProductCount).toBeLessThanOrEqual(initialProductCount);
    
    await page.screenshot({ path: './screenshots/product-filtering.png' });
  });
  
  test('navigates to product detail page when clicking on a product', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="product-card"]');
    
    const productName = await page.locator('[data-testid="product-card"]').first().locator('[data-testid="product-name"]').textContent();
    
    await page.locator('[data-testid="product-card"]').first().click();
    
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await expect(page.locator('[data-testid="product-detail-name"]')).toHaveText(productName);
    
    await page.screenshot({ path: './screenshots/product-navigation.png' });
  });
});
