import { test, expect } from '@playwright/test';

// Requires a live backend: run with E2E_BACKEND=1.
// Note: Contact.tsx uses <input name="message">, not <textarea>.
test('contact form submits successfully', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact input[name="name"]').fill('تست خودکار');
  await page.locator('#contact input[name="phone"]').fill('09123456789');
  await page.locator('#contact input[name="message"]').fill('پیام تست از پلی‌رایت.');
  await page.locator('#contact button[type="submit"]').click();
  // Target the success message paragraph specifically (not the button which also says "ارسال شد")
  await expect(page.locator('#contact [aria-live="polite"] p')).toBeVisible({ timeout: 15000 });
});
