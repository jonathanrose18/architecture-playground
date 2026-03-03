import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	// Disable parallel execution: E2E tests share the same database, so running
	// them in parallel causes data races and flaky failures.
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: 'html',
	use: {
		// Use a dedicated port so Playwright never accidentally reuses a dev
		// server running on the default :3000.
		baseURL: 'http://localhost:3001',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm dev --port 3001',
		url: 'http://localhost:3001',
		// Never reuse an existing server — always start a fresh instance on the
		// dedicated E2E port so we know exactly what application is under test.
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
