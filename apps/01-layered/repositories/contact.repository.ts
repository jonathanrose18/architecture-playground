import 'server-only';

import { prisma } from '@workspace/database';

import type { ContactRepository } from '@/types/contact';

export const contactRepository: ContactRepository = {
   getAll: () => prisma.contact.findMany({ orderBy: { lastName: 'asc' } }),
   getById: (id: string) => prisma.contact.findUnique({ where: { id } }),
   getByEmail: email => prisma.contact.findUnique({ where: { email } }),
   create: data => prisma.contact.create({ data }),
   delete: (id: string) => prisma.contact.delete({ where: { id } }),
   update: (id, data) => prisma.contact.update({ data, where: { id } }),
};
