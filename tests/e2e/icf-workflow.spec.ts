import { test, expect } from '@playwright/test';

test.describe('ICF Assessment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete ICF observation analysis', async ({ page }) => {
    // Navigate to ICF Demo
    await page.click('text=WHO ICF Demo');
    
    // Wait for page to load
    await expect(page.locator('h1, h2, h3')).toContainText(/ICF/i);
    
    // Enter observation text
    const textarea = page.locator('textarea').first();
    await textarea.fill('Elsa har svårt att läsa självständigt men klarar det med ljudböcker');
    
    // Click analyze button
    await page.click('button:has-text("Analysera")');
    
    // Wait for results - with longer timeout for API call
    await page.waitForTimeout(2000);
  });

  test('navigate through welfare wheel', async ({ page }) => {
    // Click on optimal wheel link
    await page.click('text=Optimal');
    
    // Verify we're on the welfare wheel page
    await expect(page.locator('h1, h2, h3')).toContainText(/hjul/i);
  });
});

test.describe('Navigation', () => {
  test('navigate between main sections', async ({ page }) => {
    await page.goto('/');
    
    // Should have navigation links
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Should see the main content
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify focus is on an interactive element
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });

  test('page has proper structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have main content area
    const main = await page.locator('main, [role="main"], #root').count();
    expect(main).toBeGreaterThan(0);
  });
});
