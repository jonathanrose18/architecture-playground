import 'server-only';

import { contactRepository } from '@/repositories/contact.repository';
import { type ContactUpdateInput, type ContactCreateInput } from '@/types/contact';

export const contactService = {
   async getAll() {
      return contactRepository.getAll();
   },

   async getById(id: string) {
      const contact = await contactRepository.getById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
   },

   async getByEmail(email: string) {
      const contact = await contactRepository.getByEmail(email);
      if (!contact) throw new Error('Contact not found');
      return contact;
   },

   async create(data: ContactCreateInput) {
      const existing = await contactRepository.getByEmail(data.email);
      if (existing) throw new Error('Email already exists');
      return contactRepository.create(data);
   },

   async update(id: string, data: ContactUpdateInput) {
      await this.getById(id);
      return contactRepository.update(id, data);
   },

   async delete(id: string) {
      await this.getById(id);
      return contactRepository.delete(id);
   },
};
