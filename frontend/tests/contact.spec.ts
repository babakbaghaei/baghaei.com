import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should validate inputs and show error for empty fields', async ({ page }) => {
    await page.goto('http://localhost:3000/#contact');

    // Find the submit button
    const submitButton = page.getByRole('button', { name: /ارسال/i });
    
    // Try to submit empty form
    await submitButton.click();

    // Check for browser validation or UI error messages
    // Since we use HTML5 validation, we expect invalid pseudo-class
    const nameInput = page.locator('input[name="name"]');
    // Expect the input to be invalid (browser validation check)
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();
  });

  test('should fill the form successfully', async ({ page }) => {
    // Mock the API request
    await page.route('**/api/v1/contact', async (route) => {
      await route.fulfill({ status: 201, body: JSON.stringify({ success: true }) });
    });

    await page.goto('http://localhost:3000/#contact');

    // Fill inputs
    await page.locator('input[name="name"]').fill('تستر خودکار');
    await page.locator('input[name="message"]').fill('این یک پیام تست است.');
    await page.locator('input[name="phone"]').fill('09120000000');

    // Submit
    await page.getByRole('button', { name: /ارسال/i }).click();

    // Expect success message
    await expect(page.locator('text=پیام شما با موفقیت دریافت شد')).toBeVisible({ timeout: 10000 });
  });
});