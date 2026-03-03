// Controller-level tests: the service layer is mocked so these tests cover
// request parsing, input validation, and HTTP response shaping — not the full
// stack down to the database.
import { type NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTag } from '@/test-utils/fixtures';

vi.mock('@/services/tag.service', () => ({
   tagService: {
      getAll: vi.fn(),
      create: vi.fn(),
   },
}));

const { tagService } = await import('@/services/tag.service');
const { GET, POST } = await import('@/app/api/tags/route');

function makeRequest(body: unknown): NextRequest {
   return new Request('http://localhost/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
   }) as unknown as NextRequest;
}

describe('GET /api/tags', () => {
   beforeEach(() => vi.clearAllMocks());

   it('responds with 200 and the list of tags', async () => {
      const tags = [makeTag({ id: 'tag-1', name: 'VIP' }), makeTag({ id: 'tag-2', name: 'Lead' })];
      vi.mocked(tagService.getAll).mockResolvedValue(tags);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(tagService.getAll).toHaveBeenCalledOnce();
   });

   it('responds with 500 when the service throws', async () => {
      vi.mocked(tagService.getAll).mockRejectedValue(new Error('DB connection failed'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'DB connection failed' });
   });
});

describe('POST /api/tags', () => {
   beforeEach(() => vi.clearAllMocks());

   it('responds with 201 and the created tag for valid input', async () => {
      const tag = makeTag({ id: 'tag-9', name: 'Partner' });
      vi.mocked(tagService.create).mockResolvedValue(tag);

      const response = await POST(makeRequest({ name: 'Partner' }));
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(tag);
      expect(tagService.create).toHaveBeenCalledWith({ name: 'Partner' });
   });

   it('responds with 400 when name is missing', async () => {
      const response = await POST(makeRequest({}));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(tagService.create).not.toHaveBeenCalled();
   });

   it('responds with 500 when the service throws', async () => {
      vi.mocked(tagService.create).mockRejectedValue(new Error('Tag already exists'));

      const response = await POST(makeRequest({ name: 'VIP' }));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Tag already exists' });
   });
});
