// Controller-level tests: the service layer is mocked so these tests cover
// request parsing, input validation, and HTTP response shaping — not the full
// stack down to the database.
import { type NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/contact.service', () => ({
   contactService: {
      assignTag: vi.fn(),
   },
}));

const { contactService } = await import('@/services/contact.service');
const { POST } = await import('@/app/api/contacts/[id]/tags/route');

function makeRequest(body: unknown): NextRequest {
   return new Request('http://localhost/api/contacts/contact-1/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
   }) as unknown as NextRequest;
}

function makeContext(id = 'contact-1') {
   return { params: Promise.resolve({ id }) } as { params: Promise<{ id: string }> };
}

describe('POST /api/contacts/[id]/tags', () => {
   beforeEach(() => vi.clearAllMocks());

   it('responds with 204 and assigns the tag for valid input', async () => {
      vi.mocked(contactService.assignTag).mockResolvedValue(undefined);

      const response = await POST(makeRequest({ tagId: 'tag-1' }), makeContext() as never);

      expect(response.status).toBe(204);
      expect(contactService.assignTag).toHaveBeenCalledWith('contact-1', 'tag-1');
   });

   it('responds with 400 when tagId is missing', async () => {
      const response = await POST(makeRequest({}), makeContext() as never);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(contactService.assignTag).not.toHaveBeenCalled();
   });

   it('responds with 500 when the service throws', async () => {
      vi.mocked(contactService.assignTag).mockRejectedValue(new Error('Tag not found'));

      const response = await POST(makeRequest({ tagId: 'missing-tag' }), makeContext() as never);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Tag not found' });
   });
});
