import { test, expect } from '@playwright/test';

// Root font must not inflate on a 16" MacBook fullscreen (~1728px) and must
// stay readable on mobile. These bounds match the clamp(15px, 0.2vw + 14px, 16.5px).
test('root font-size is capped on very wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1080 });
  await page.goto('/');
  const fs = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  expect(fs).toBeLessThanOrEqual(16.5);
});

test('root font-size stays readable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const fs = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  expect(fs).toBeGreaterThanOrEqual(15);
});
