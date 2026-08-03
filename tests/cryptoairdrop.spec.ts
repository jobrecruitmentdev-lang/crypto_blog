import { test, expect } from '@playwright/test';

test.describe('CryptoAirdropAI Live Site Tests', () => {
  
  test('should load the homepage and check basic elements', async ({ page }) => {
    // Navigate to the live site
    await page.goto('http://cryptoairdropai.com/');
    
    // Check if the title is present (adjust based on your actual site title)
    await expect(page).toHaveTitle(/Crypto/i);
    
    // Check if the main heading is visible
    // You might need to update the selector 'h1' depending on your design
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check if the navigation exists (assuming a nav element exists)
    const nav = page.locator('nav').first();
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }
  });

  test('should verify database connectivity or dynamic content rendering', async ({ page }) => {
    await page.goto('http://cryptoairdropai.com/blog'); // Assuming this is your dynamic route
    
    // If the database connection fails, you might get a 500 error or "Error loading data"
    // We check that the page does not contain standard error messages
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('Database connection failed');
    expect(bodyText).not.toContain('Internal Server Error');
  });

});
