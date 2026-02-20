import { prisma } from '@/lib/db';

export const contactRepository: ContactRepository = {
  getAll: () => prisma.contact.findMany({ orderBy: { lastName: 'asc' } }),
  getById: (id: string) => prisma.contact.findUnique({ where: { id } }),
  getByEmail: email => prisma.contact.findUnique({ where: { email } }),
  create: data => prisma.contact.create({ data }),
  delete: (id: string) => prisma.contact.delete({ where: { id } }),
  update: (id, data) => prisma.contact.update({ data, where: { id } }),
};

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactCreateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
};

export type ContactUpdateInput = Partial<ContactCreateInput>;

export type ContactRepository = {
  getAll: () => Promise<Contact[]>;
  getById: (id: string) => Promise<Contact | null>;
  getByEmail: (email: string) => Promise<Contact | null>;
  create: (data: ContactCreateInput) => Promise<Contact>;
  update: (id: string, data: ContactUpdateInput) => Promise<Contact>;
  delete: (id: string) => Promise<Contact>;
};
