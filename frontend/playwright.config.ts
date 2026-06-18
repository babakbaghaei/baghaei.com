import { defineConfig } from '@playwright/test';

const shouldStartBackend = process.env.E2E_BACKEND === 'true';

export default defineConfig({
  testDir: 'tests',
  webServer: [
    ...(shouldStartBackend
      ? [
          {
            command: 'npm run start --prefix ../backend',
            port: 8000,
            timeout: 120 * 1000,
            reuseExistingServer: !process.env.CI,
          },
        ]
      : []),
    {
      command: process.env.CI
        ? 'npx next build --webpack && npx next start'
        : 'npm run dev',
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
