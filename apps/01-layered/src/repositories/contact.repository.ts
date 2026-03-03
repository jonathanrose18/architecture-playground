import 'server-only';

import { prisma } from '@workspace/database';

import type { ContactRepository } from '@/types/contact';

export const contactRepository: ContactRepository = {
   getAll: () => prisma.contact.findMany({ orderBy: { lastName: 'asc' }, include: { tags: true } }),
   getById: id => prisma.contact.findUnique({ where: { id }, include: { tags: true } }),
   getByEmail: email => prisma.contact.findUnique({ where: { email } }),
   create: data => prisma.contact.create({ data }),
   update: (id, data) => prisma.contact.update({ where: { id }, data, include: { tags: true } }),
   delete: id => prisma.contact.delete({ where: { id } }),
};
