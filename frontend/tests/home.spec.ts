import { test, expect } from '@playwright/test';

test('homepage has title and contact section', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/گروه فناوری بقایی/);

  // Check if the "شروع همکاری" button exists
  const ctaButton = page.locator('button', { hasText: 'شروع همکاری' }).first();
  await expect(ctaButton).toBeVisible();

  // Check if the contact form inputs exist
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="phone"]')).toBeVisible();
});
