import { test, expect } from '@playwright/test';

// WCAG 2.5.5: interactive controls should be at least 44x44 CSS px.
// Checked at a phone viewport where the root font (and thus rem sizing) is smallest.
test('projects filter chips meet the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  const chips = page.locator('[data-test="project-filter"]');
  const n = await chips.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const box = await chips.nth(i).boundingBox();
    expect(box, `chip ${i} has a box`).not.toBeNull();
    expect(Math.round(box!.height), `chip ${i} height`).toBeGreaterThanOrEqual(44);
  }
});
