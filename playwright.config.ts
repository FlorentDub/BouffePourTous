import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3456',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npx next start -p 3456',
        port: 3456,
        reuseExistingServer: !process.env.CI,
        env: {
          AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ?? '',
          AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ?? '',
          AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME ?? '',
        },
      },
})
