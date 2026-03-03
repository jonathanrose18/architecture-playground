import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const alias = { '@': path.resolve(import.meta.dirname, './src') };
const setupFiles = ['./src/test-utils/setup.ts'];
// Ensure only a single copy of React is used across workspace packages
const dedupe = ['react', 'react-dom'];

export default defineConfig({
	plugins: [react()],
	test: {
		projects: [
			{
				// Unit & integration tests run in Node.js
				plugins: [react()],
				resolve: { alias, dedupe },
				test: {
					name: 'node',
					include: ['src/**/*.test.ts'],
					environment: 'node',
					globals: true,
					setupFiles,
				},
			},
			{
				// Component tests run in a browser-like jsdom environment
				plugins: [react()],
				resolve: { alias, dedupe },
				test: {
					name: 'jsdom',
					include: ['src/**/*.test.tsx'],
					environment: 'jsdom',
					globals: true,
					setupFiles,
				},
			},
		],
		coverage: {
			provider: 'v8',
			include: ['src/services/**', 'src/lib/**', 'src/app/api/**'],
			exclude: ['src/app/api/**/__tests__/**'],
		},
	},
});
