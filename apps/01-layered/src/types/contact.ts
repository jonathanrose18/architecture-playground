import type { Tag } from '@/types/tag';

export type Contact = {
   id: string;
   address: string | null;
   company: string | null;
   email: string;
   firstName: string;
   lastName: string;
   phone: string | null;
   createdAt: Date;
   updatedAt: Date;
};

export type ContactWithTags = Contact & { tags: Tag[] };

export type ContactCreateInput = Pick<Contact, 'address' | 'company' | 'email' | 'firstName' | 'lastName' | 'phone'>;

export type ContactUpdateInput = Partial<ContactCreateInput>;

export type ContactRepository = {
   getAll: () => Promise<ContactWithTags[]>;
   getById: (id: string) => Promise<Contact | null>;
   getByEmail: (email: string) => Promise<Contact | null>;
   create: (data: ContactCreateInput) => Promise<Contact>;
   update: (id: string, data: ContactUpdateInput) => Promise<Contact>;
   delete: (id: string) => Promise<Contact>;
};
