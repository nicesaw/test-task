import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    [
      'allure-playwright',
      {
        outputFolder: 'allure/results',
        suiteTitle: false,
        detail: false
      }
    ]
  ],

  use: {
    baseURL: 'https://enotes.pointschool.ru',

    trace: 'on-first-retry',
    screenshot: 'on'
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'Test task',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup']
    }
  ],

  timeout: 5 * 60 * 1000
});
