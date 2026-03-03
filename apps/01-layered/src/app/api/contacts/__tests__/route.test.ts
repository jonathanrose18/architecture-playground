// Controller-level tests: the service layer is mocked so these tests cover
// request parsing, input validation, and HTTP response shaping — not the full
// stack down to the database.  For DB-level coverage see prisma.integration.test.ts.
import { type NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeContact } from '@/test-utils/fixtures';

vi.mock('@/services/contact.service', () => ({
	contactService: {
		getAll: vi.fn(),
		create: vi.fn(),
	},
}));

const { contactService } = await import('@/services/contact.service');
const { GET, POST } = await import('@/app/api/contacts/route');

function makeRequest(body?: unknown): NextRequest {
	return new Request('http://localhost/api/contacts', {
		method: body ? 'POST' : 'GET',
		headers: { 'Content-Type': 'application/json' },
		...(body ? { body: JSON.stringify(body) } : {}),
	}) as unknown as NextRequest;
}

describe('GET /api/contacts', () => {
	beforeEach(() => vi.clearAllMocks());

	it('responds with 200 and the list of contacts', async () => {
		const contacts = [makeContact(), makeContact({ id: 'contact-2', email: 'jane@example.com' })];
		vi.mocked(contactService.getAll).mockResolvedValue(contacts);

		const response = await GET();
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toHaveLength(2);
	});

	it('responds with 500 when the service throws', async () => {
		vi.mocked(contactService.getAll).mockRejectedValue(new Error('DB connection failed'));

		const response = await GET();
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: 'DB connection failed' });
	});
});

describe('POST /api/contacts', () => {
	beforeEach(() => vi.clearAllMocks());

	const validBody = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
	};

	it('responds with 201 and the created contact for a valid request body', async () => {
		const contact = makeContact();
		vi.mocked(contactService.create).mockResolvedValue(contact);

		const response = await POST(makeRequest(validBody));
		const data = await response.json();

		expect(response.status).toBe(201);
		// Dates are serialised to ISO strings when passed through JSON
		expect(data).toMatchObject({ id: contact.id, email: contact.email, tags: [] });
		expect(contactService.create).toHaveBeenCalledOnce();
	});

	it('responds with 400 when the email is missing', async () => {
		const response = await POST(makeRequest({ firstName: 'John', lastName: 'Doe' }));
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toHaveProperty('error');
		expect(contactService.create).not.toHaveBeenCalled();
	});

	it('responds with 400 when the email format is invalid', async () => {
		const response = await POST(makeRequest({ ...validBody, email: 'not-an-email' }));
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toHaveProperty('error');
	});

	it('responds with 400 when firstName is empty', async () => {
		const response = await POST(makeRequest({ ...validBody, firstName: '' }));
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toHaveProperty('error');
	});

	it('responds with 400 when lastName is missing', async () => {
		const response = await POST(makeRequest({ firstName: 'John', email: 'john@example.com' }));
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toHaveProperty('error');
	});

	it('responds with 500 when the service throws (e.g. duplicate email)', async () => {
		vi.mocked(contactService.create).mockRejectedValue(new Error('Email already exists'));

		const response = await POST(makeRequest(validBody));
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: 'Email already exists' });
	});
});
