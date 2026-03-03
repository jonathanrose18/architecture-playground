import 'server-only';

import { contactRepository } from '@/repositories/contact.repository';
import { tagService } from '@/services/tag.service';
import type { ContactRepository, ContactUpdateInput, ContactCreateInput } from '@/types/contact';

const repo: ContactRepository = contactRepository;

export const contactService = {
   async getAll() {
      return repo.getAll();
   },

   async getById(id: string) {
      const contact = await repo.getById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
   },

   async getByEmail(email: string) {
      const contact = await repo.getByEmail(email);
      if (!contact) throw new Error('Contact not found');
      return contact;
   },

   async create(data: ContactCreateInput) {
      const existing = await repo.getByEmail(data.email);
      if (existing) throw new Error('Email already exists');
      return repo.create(data);
   },

   async update(id: string, data: ContactUpdateInput) {
      await contactService.getById(id);
      return repo.update(id, data);
   },

   async delete(id: string) {
      await contactService.getById(id);
      return repo.delete(id);
   },

   // Fix 4: tagService statt tagRepository (kein Cross-Layer-Import mehr)
   // Fix 5: Redundanter Contact-Pre-Check entfernt — Prisma wirft bei ungültiger contactId
   async assignTag(contactId: string, tagId: string) {
      await tagService.getById(tagId);
      return repo.assignTag(contactId, tagId);
   },

   async removeTag(contactId: string, tagId: string) {
      await tagService.getById(tagId);
      return repo.removeTag(contactId, tagId);
   },
};
