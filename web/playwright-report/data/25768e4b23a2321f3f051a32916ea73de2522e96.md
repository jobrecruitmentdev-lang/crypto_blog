# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Blog Website Frontend UI >> navigation routing works for core blog pages
- Location: e2e\home.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('header nav a:text("News")')

```

# Page snapshot

```yaml
- generic:
  - generic [active]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - navigation [ref=e6]:
          - button [disabled] [ref=e7]:
            - img "previous" [ref=e8]
          - generic [ref=e10]:
            - generic [ref=e11]: 1/
            - text: "1"
          - button [disabled] [ref=e12]:
            - img "next" [ref=e13]
        - link "Next.js 16.2.10 (stale) Turbopack" [ref=e16] [cursor=pointer]:
          - /url: https://nextjs.org/docs/messages/version-staleness
          - generic "There is a newer version (16.3.1) available, upgrade recommended!" [ref=e19]: Next.js 16.2.10 (stale)
          - generic [ref=e20]: Turbopack
      - generic [ref=e21]:
        - dialog "Runtime Error" [ref=e22]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]:
                - generic [ref=e28]: Runtime Error
                - generic [ref=e30]:
                  - button "Copy Error Info" [ref=e31] [cursor=pointer]
                  - button "No related documentation found" [disabled] [ref=e34]
                  - button "Attach Node.js inspector" [ref=e37] [cursor=pointer]
              - generic [ref=e46]: Could not find the module "[project]/web/node_modules/next/dist/client/components/builtin/global-error.js#default" in the React Client Manifest. This is probably a bug in the React Server Components bundler.
            - generic [ref=e49]:
              - generic [ref=e50]:
                - paragraph [ref=e51]:
                  - text: Call Stack
                  - generic [ref=e52]: "9"
                - button "Show 8 ignore-listed frame(s)" [ref=e53] [cursor=pointer]
              - generic [ref=e56]:
                - generic [ref=e57]: stringify
                - text: <anonymous>
          - generic [ref=e58]: "1"
          - generic [ref=e59]: "2"
        - contentinfo [ref=e60]:
          - region "Error feedback" [ref=e61]:
            - paragraph [ref=e62]:
              - link "Was this helpful?" [ref=e63] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e64] [cursor=pointer]
            - button "Mark as not helpful" [ref=e68] [cursor=pointer]
    - generic [ref=e75] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e76]
      - generic [ref=e80]:
        - button "Open issues overlay" [ref=e81]:
          - generic [ref=e82]:
            - generic [ref=e83]: "0"
            - generic [ref=e84]: "1"
          - generic [ref=e85]: Issue
        - button "Collapse issues badge" [ref=e86]
  - alert [ref=e89]
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
  9  |     await expect(headerLogo).toBeVisible();
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
> 30 |     await page.click('header nav a:text("News")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
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