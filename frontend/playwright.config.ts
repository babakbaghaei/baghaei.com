import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  webServer: [
    {
      command: 'npm run start --prefix ../backend',
      port: 8000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev',
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
