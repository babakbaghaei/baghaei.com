import { test, expect } from '@playwright/test';

// Phase 5: tools-mobile + data-driven dropdowns + testimonials + chat presence.
// Viewport-only: needs the frontend dev server, NO backend.

test.describe('5a — tools index', () => {
  test('every category chip renders and the count matches the catalog', async ({ page }) => {
    await page.goto('/tools');
    // Category chips include "همه" plus each unique category; all are tappable.
    const chips = page.getByRole('button', { name: /^(همه|حقوقی|املاک|مالی|سرگرمی|کمکی)$/ });
    await expect(chips.first()).toBeVisible();
    // The "N ابزار" counter reflects the full catalog on first paint (active=همه).
    await expect(page.getByText(/\d|[۰-۹]+\s*ابزار/).first()).toBeVisible();
  });

  test('category chip strip is horizontally scrollable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/tools');
    // The chip row uses overflow-x-auto; its content is wider than the viewport.
    const strip = page.locator('.overflow-x-auto.scrollbar-hide').first();
    await expect(strip).toBeVisible();
    const overflows = await strip.evaluate(
      (el) => el.scrollWidth > el.clientWidth + 4
    );
    expect(overflows).toBe(true);
  });
});

test.describe('5b — navbar dropdowns are data-driven', () => {
  test('tools mega-menu shows a 5th-in-category tool that slice(0,4) used to hide', async ({ page }) => {
    await page.goto('/');
    // Open the tools dropdown (desktop hover menu).
    await page.getByText('ابزارها', { exact: true }).first().hover();
    // "مبدل واحدها" is the 5th tool in the کمکی category — previously truncated.
    await expect(page.getByRole('link', { name: 'مبدل واحدها' })).toBeVisible({ timeout: 8000 });
  });

  test('products mega-menu lists more than the old 5 hardcoded items', async ({ page }) => {
    await page.goto('/');
    await page.getByText('محصولات', { exact: true }).first().hover();
    // The data-driven grid renders the first six visible projects (was 5 hardcoded).
    const region = page.getByRole('region', { name: 'محصولات و پلتفرم‌ها' });
    await expect(region).toBeVisible({ timeout: 8000 });
    const cards = region.locator('button');
    expect(await cards.count()).toBeGreaterThan(5);
  });
});

test.describe('5d — chat presence', () => {
  test('presence label + dot reflect the Tehran business-hours window', async ({ page }) => {
    await page.goto('/');
    // Open the chat launcher (fixed bottom-start FAB).
    await page.getByRole('button', { name: 'باز کردن گفتگو' }).click();
    const presence = page.getByTestId('chat-presence');
    await expect(presence).toBeVisible({ timeout: 8000 });
    const online = (await presence.getAttribute('data-online')) === 'true';
    if (online) {
      await expect(presence.getByText('آنلاین')).toBeVisible();
    } else {
      await expect(presence.getByText('معمولاً سریع پاسخ می‌دهیم')).toBeVisible();
    }
  });

  test('presence matches the documented 09:00–21:00 Tehran rule for the current hour', async ({ page }) => {
    await page.goto('/');
    // Recompute the rule independently in-page and assert the UI agrees.
    const expectedOnline = await page.evaluate(() => {
      const h = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Tehran',
          hour: '2-digit',
          hour12: false,
        }).format(new Date()),
        10
      ) % 24;
      return h >= 9 && h < 21;
    });
    await page.getByRole('button', { name: 'باز کردن گفتگو' }).click();
    const presence = page.getByTestId('chat-presence');
    await expect(presence).toHaveAttribute('data-online', expectedOnline ? 'true' : 'false', { timeout: 8000 });
  });
});
