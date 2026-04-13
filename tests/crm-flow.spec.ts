import { test, expect } from '@playwright/test';

test.describe('CRM Core Functionality', () => {
  
  test('Inventory should display products', async ({ page }) => {
    await page.goto('/inventory');
    
    // Check header
    await expect(page.locator('h2')).toContainText('Product Intelligence');
    
    // Check results count (from fix we did earlier)
    const resultsText = page.locator('.nothing-dot-matrix', { hasText: /Found \d+ Results/i });
    await expect(resultsText).toBeVisible();
    
    // Verify it's not 0
    const countText = await resultsText.innerText();
    const count = parseInt(countText.match(/\d+/)?.[0] || '0');
    console.log(`Inventory count: ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test('Leads page should show New Inquiry modal', async ({ page }) => {
    await page.goto('/leads');
    await page.waitForLoadState('networkidle');
    
    // Check header
    await expect(page.getByRole('heading', { name: 'Active Leads' })).toBeVisible();
    
    // Click New Inquiry button
    await page.click('button:has-text("New Inquiry")');
    
    // Check if modal appears - use a more specific selector for the modal heading
    const modalHeading = page.locator('h2', { hasText: 'Record New Inquiry' });
    await expect(modalHeading).toBeVisible({ timeout: 10000 });
    
    // Check for customer selection label
    await expect(page.locator('label', { hasText: '01 / Select Customer' })).toBeVisible();
  });

  test('Customer Directory should allow registration and show categories', async ({ page }) => {
    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
    
    // Click Add Customer
    await page.click('button:has-text("Add Customer")');
    
    // Check modal heading specifically
    const modalHeading = page.locator('h2', { hasText: 'Register New Customer' });
    await expect(modalHeading).toBeVisible({ timeout: 10000 });
    
    // Check for Category dropdown label
    await expect(page.locator('label', { hasText: 'Customer Category' })).toBeVisible();
    
    // Open custom dropdown
    await page.click('text=Select Category');
    
    // Check if categories appear
    const categoryOption = page.locator('div').filter({ hasText: /^Regular|Silver|Gold|Reseller$/i }).first();
    await expect(categoryOption).toBeVisible();
  });
});
