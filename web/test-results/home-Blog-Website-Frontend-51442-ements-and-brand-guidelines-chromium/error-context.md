# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Blog Website Frontend UI >> homepage has correct blog design elements and brand guidelines
- Location: e2e\home.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header .logo img')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('header .logo img')

```

```yaml
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 16.2.10 (stale) Turbopack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 16.2.10 (stale) Turbopack
- img
- dialog "Runtime Error":
  - text: Runtime Error
  - button "Copy Error Info":
    - img
  - button "No related documentation found" [disabled]:
    - img
  - button "Attach Node.js inspector":
    - img
  - text: Could not find the module "[project]/web/node_modules/next/dist/client/components/builtin/global-error.js#default" in the React Client Manifest. This is probably a bug in the React Server Components bundler.
  - paragraph: Call Stack 9
  - button "Show 8 ignore-listed frame(s)":
    - text: Show 8 ignore-listed frame(s)
    - img
  - text: stringify <anonymous>
- contentinfo:
  - region "Error feedback":
    - paragraph:
      - link "Was this helpful?":
        - /url: https://nextjs.org/telemetry#error-feedback
    - button "Mark as helpful"
    - button "Mark as not helpful"
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Blog Website Frontend UI', () => {
  4  |   test('homepage has correct blog design elements and brand guidelines', async ({ page }) => {
  5  |     await page.goto('/');
  6  | 
  7  |     // Verify Logo existence in header and footer
  8  |     const headerLogo = page.locator('header .logo img');
> 9  |     await expect(headerLogo).toBeVisible();
     |                              ^ Error: expect(locator).toBeVisible() failed
  10 | 
  11 |     // Verify Navigation matches blog structure (News, Guides, FAQ)
  12 |     const navLinks = page.locator('header nav a');
  13 |     await expect(navLinks).toContainText(['Home', 'News', 'Guides', 'FAQ']);
  14 | 
  15 |     // Verify Blog Hero is present
  16 |     await expect(page.locator('text=Featured Story')).toBeVisible();
  17 |     await expect(page.locator('text=Top Guides & Tutorials')).toBeVisible();
  18 |     
  19 |     // Verify News grid is present
  20 |     await expect(page.locator('text=Latest News & Analysis')).toBeVisible();
  21 | 
  22 |     // Verify Newsletter is present
  23 |     await expect(page.locator('text=Subscribe to our newsletter')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('navigation routing works for core blog pages', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     
  29 |     // Click News
  30 |     await page.click('header nav a:text("News")');
  31 |     await expect(page).toHaveURL(/\/blog/);
  32 |     await expect(page.locator('h2')).toContainText('Blog');
  33 | 
  34 |     // Click FAQ
  35 |     await page.click('header nav a:text("FAQ")');
  36 |     await expect(page).toHaveURL(/\/faq/);
  37 |     await expect(page.locator('h1')).toContainText('FAQ');
  38 |   });
  39 | });
  40 | 
```