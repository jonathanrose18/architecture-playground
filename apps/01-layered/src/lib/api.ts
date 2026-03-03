import type { ContactCreateInput, ContactUpdateInput, ContactWithTags } from '@/types/contact';
import type { Tag, TagCreateInput } from '@/types/tag';

async function parseError(response: Response): Promise<string> {
   try {
      const data = (await response.json()) as { error?: string };
      return data.error ?? 'Request failed';
   } catch {
      return 'Request failed';
   }
}

async function handleResponse<T>(response: Response): Promise<T> {
   if (!response.ok) {
      throw new Error(await parseError(response));
   }
   return response.json() as Promise<T>;
}

async function handleEmpty(response: Response): Promise<void> {
   if (!response.ok) {
      throw new Error(await parseError(response));
   }
}

export const contactsApi = {
   create: (data: ContactCreateInput): Promise<ContactWithTags> =>
      fetch('/api/contacts', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
      }).then(r => handleResponse<ContactWithTags>(r)),

   update: (id: string, data: ContactUpdateInput): Promise<ContactWithTags> =>
      fetch(`/api/contacts/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
      }).then(r => handleResponse<ContactWithTags>(r)),

   delete: (id: string): Promise<void> =>
      fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then(handleEmpty),

   assignTag: (contactId: string, tagId: string): Promise<void> =>
      fetch(`/api/contacts/${contactId}/tags`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ tagId }),
      }).then(handleEmpty),

   removeTag: (contactId: string, tagId: string): Promise<void> =>
      fetch(`/api/contacts/${contactId}/tags/${tagId}`, { method: 'DELETE' }).then(handleEmpty),
};

export const tagsApi = {
   create: (data: TagCreateInput): Promise<Tag> =>
      fetch('/api/tags', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
      }).then(r => handleResponse<Tag>(r)),
};
