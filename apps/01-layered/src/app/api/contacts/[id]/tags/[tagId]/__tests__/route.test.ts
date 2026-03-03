// Controller-level tests: the service layer is mocked so these tests cover
// request parsing, input validation, and HTTP response shaping — not the full
// stack down to the database.
import { type NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/contact.service', () => ({
   contactService: {
      removeTag: vi.fn(),
   },
}));

const { contactService } = await import('@/services/contact.service');
const { DELETE } = await import('@/app/api/contacts/[id]/tags/[tagId]/route');

function makeContext(id = 'contact-1', tagId = 'tag-1') {
   return { params: Promise.resolve({ id, tagId }) } as { params: Promise<{ id: string; tagId: string }> };
}

describe('DELETE /api/contacts/[id]/tags/[tagId]', () => {
   beforeEach(() => vi.clearAllMocks());

   it('responds with 204 and removes the tag assignment', async () => {
      vi.mocked(contactService.removeTag).mockResolvedValue(undefined);

      const response = await DELETE(
         new Request('http://localhost/api/contacts/contact-1/tags/tag-1') as NextRequest,
         makeContext() as never
      );

      expect(response.status).toBe(204);
      expect(contactService.removeTag).toHaveBeenCalledWith('contact-1', 'tag-1');
   });

   it('responds with 500 when the service throws', async () => {
      vi.mocked(contactService.removeTag).mockRejectedValue(new Error('Tag not found'));

      const response = await DELETE(
         new Request('http://localhost/api/contacts/contact-1/tags/missing') as NextRequest,
         makeContext('contact-1', 'missing') as never
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Tag not found' });
   });
});
