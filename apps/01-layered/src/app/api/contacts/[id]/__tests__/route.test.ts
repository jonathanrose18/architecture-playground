// Controller-level tests: the service layer is mocked so these tests cover
// request parsing, input validation, and HTTP response shaping — not the full
// stack down to the database.  For DB-level coverage see prisma.integration.test.ts.
import { type NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeContact } from '@/test-utils/fixtures';

vi.mock('@/services/contact.service', () => ({
	contactService: {
		getById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
}));

const { contactService } = await import('@/services/contact.service');
const { GET, PUT, DELETE } = await import('@/app/api/contacts/[id]/route');

function makePutRequest(body: unknown): NextRequest {
	return new Request('http://localhost/api/contacts/contact-1', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}) as unknown as NextRequest;
}

function makeContext(id = 'contact-1') {
	return { params: Promise.resolve({ id }) } as { params: Promise<{ id: string }> };
}

describe('GET /api/contacts/[id]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('responds with 200 and the contact when found', async () => {
		const contact = makeContact();
		vi.mocked(contactService.getById).mockResolvedValue(contact);

		const response = await GET(new Request('http://localhost/api/contacts/contact-1') as NextRequest, makeContext() as never);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toMatchObject({ id: 'contact-1', email: 'john@example.com' });
		expect(contactService.getById).toHaveBeenCalledWith('contact-1');
	});

	it('responds with 500 when the service throws', async () => {
		vi.mocked(contactService.getById).mockRejectedValue(new Error('Contact not found'));

		const response = await GET(new Request('http://localhost/api/contacts/missing') as NextRequest, makeContext('missing') as never);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: 'Contact not found' });
	});
});

describe('PUT /api/contacts/[id]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('responds with 200 and the updated contact for a valid payload', async () => {
		const updated = makeContact({
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
			phone: null,
			company: null,
			address: null,
		});
		vi.mocked(contactService.update).mockResolvedValue(updated);

		const response = await PUT(makePutRequest({ firstName: 'Jane', email: 'jane@example.com' }), makeContext() as never);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toMatchObject({ id: 'contact-1', firstName: 'Jane', email: 'jane@example.com' });
		expect(contactService.update).toHaveBeenCalledWith('contact-1', {
			address: null,
			company: null,
			email: 'jane@example.com',
			firstName: 'Jane',
			phone: null,
		});
	});

	it('responds with 400 when payload validation fails', async () => {
		const response = await PUT(makePutRequest({ email: 'not-an-email' }), makeContext() as never);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toHaveProperty('error');
		expect(contactService.update).not.toHaveBeenCalled();
	});

	it('responds with 500 when the service throws', async () => {
		vi.mocked(contactService.update).mockRejectedValue(new Error('Contact not found'));

		const response = await PUT(makePutRequest({ firstName: 'Jane' }), makeContext('missing') as never);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: 'Contact not found' });
	});
});

describe('DELETE /api/contacts/[id]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('responds with 204 when deletion succeeds', async () => {
		vi.mocked(contactService.delete).mockResolvedValue(makeContact());

		const response = await DELETE(new Request('http://localhost/api/contacts/contact-1') as NextRequest, makeContext() as never);

		expect(response.status).toBe(204);
		expect(contactService.delete).toHaveBeenCalledWith('contact-1');
	});

	it('responds with 500 when the service throws', async () => {
		vi.mocked(contactService.delete).mockRejectedValue(new Error('Contact not found'));

		const response = await DELETE(new Request('http://localhost/api/contacts/missing') as NextRequest, makeContext('missing') as never);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: 'Contact not found' });
	});
});
