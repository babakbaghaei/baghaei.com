import { test, expect } from '@playwright/test';

test('career application submits', async ({ page }) => {
  await page.goto('/careers');
  // JobCard has role="button" with aria-label "ارسال درخواست برای موقعیت شغلی <title>"
  await page.getByRole('button', { name: /ارسال درخواست برای موقعیت شغلی/ }).first().click();
  await page.locator('input[placeholder="نام و نام خانوادگی"]').fill('تست خودکار');
  await page.locator('input[placeholder="آدرس ایمیل"]').fill('test@example.com');
  // Use exact match to target the form submit button, not the JobCard role="button" elements
  await page.getByRole('button', { name: 'ارسال درخواست', exact: true }).click();
  await expect(page.getByText(/درخواست شما ثبت شد/)).toBeVisible({ timeout: 15000 });
});
