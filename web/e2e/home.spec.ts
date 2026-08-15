import { test, expect } from '@playwright/test';

test.describe('Blog Website Frontend UI', () => {
  test('homepage has correct blog design elements and brand guidelines', async ({ page }) => {
    await page.goto('/');

    // Verify Logo existence in header and footer
    const headerLogo = page.locator('header .logo img');
    await expect(headerLogo).toBeVisible();

    // Verify Navigation matches blog structure (News, Guides, FAQ)
    const navLinks = page.locator('header nav a');
    await expect(navLinks).toContainText(['Home', 'News', 'Guides', 'FAQ']);

    // Verify Blog Hero is present
    await expect(page.locator('text=Featured Story')).toBeVisible();
    await expect(page.locator('text=Top Guides & Tutorials')).toBeVisible();
    
    // Verify News grid is present
    await expect(page.locator('text=Latest News & Analysis')).toBeVisible();

    // Verify Newsletter is present
    await expect(page.locator('text=Subscribe to our newsletter')).toBeVisible();
  });

  test('navigation routing works for core blog pages', async ({ page }) => {
    await page.goto('/');
    
    // Click News
    await page.click('header nav a:text("News")');
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('h2')).toContainText('Blog');

    // Click FAQ
    await page.click('header nav a:text("FAQ")');
    await expect(page).toHaveURL(/\/faq/);
    await expect(page.locator('h1')).toContainText('FAQ');
  });
});
