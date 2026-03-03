import { describe, expect, it } from 'vitest';

import { asNullableString, emptyContactForm, formStateToPayload, toContactFormState } from '@/lib/form-utils';
import { makeContact } from '@/test-utils/fixtures';

describe('asNullableString', () => {
	it('returns null for an empty string', () => {
		expect(asNullableString('')).toBeNull();
	});

	it('returns null for a whitespace-only string', () => {
		expect(asNullableString('   ')).toBeNull();
	});

	it('returns the trimmed string for non-empty input', () => {
		expect(asNullableString('  hello  ')).toBe('hello');
	});

	it('returns the value unchanged if already trimmed', () => {
		expect(asNullableString('hello')).toBe('hello');
	});
});

describe('toContactFormState', () => {
	it('maps contact fields to form state', () => {
		const contact = makeContact({
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
			phone: '+49 123',
			company: 'Acme',
			address: 'Main St 1',
		});

		const state = toContactFormState(contact);

		expect(state).toEqual({
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
			phone: '+49 123',
			company: 'Acme',
			address: 'Main St 1',
		});
	});

	it('converts null fields to empty strings', () => {
		const contact = makeContact({ phone: null, company: null, address: null });

		const state = toContactFormState(contact);

		expect(state.phone).toBe('');
		expect(state.company).toBe('');
		expect(state.address).toBe('');
	});
});

describe('formStateToPayload', () => {
	it('converts empty optional fields to null', () => {
		const payload = formStateToPayload({
			...emptyContactForm,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
		});

		expect(payload.address).toBeNull();
		expect(payload.company).toBeNull();
		expect(payload.phone).toBeNull();
	});

	it('trims whitespace from required fields', () => {
		const payload = formStateToPayload({
			...emptyContactForm,
			firstName: '  John  ',
			lastName: '  Doe  ',
			email: '  john@example.com  ',
		});

		expect(payload.firstName).toBe('John');
		expect(payload.lastName).toBe('Doe');
		expect(payload.email).toBe('john@example.com');
	});

	it('preserves non-empty optional fields', () => {
		const payload = formStateToPayload({
			...emptyContactForm,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			phone: '+49 123',
			company: 'Acme',
			address: 'Main St 1',
		});

		expect(payload.phone).toBe('+49 123');
		expect(payload.company).toBe('Acme');
		expect(payload.address).toBe('Main St 1');
	});
});
