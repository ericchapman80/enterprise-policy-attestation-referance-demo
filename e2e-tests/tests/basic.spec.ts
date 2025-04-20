import { test, expect } from '@playwright/test';

test.describe('Basic Test', () => {
  test('basic test that always passes', async () => {
    expect(true).toBeTruthy();
  });
});
