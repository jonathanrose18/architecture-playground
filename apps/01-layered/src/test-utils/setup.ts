import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Allow importing server-only modules in tests
vi.mock('server-only', () => ({}));

// Polyfills for Radix UI components running in jsdom.
// Guard against Node.js environments where window does not exist.
if (typeof window !== 'undefined') {
	global.ResizeObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}
