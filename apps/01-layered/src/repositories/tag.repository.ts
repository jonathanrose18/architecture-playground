import 'server-only';

import { prisma } from '@workspace/database';

import type { TagRepository } from '@/types/tag';

export const tagRepository: TagRepository = {
   getAll: () => prisma.tag.findMany({ orderBy: { name: 'asc' } }),
   getById: id => prisma.tag.findUnique({ where: { id } }),
   getByName: name => prisma.tag.findUnique({ where: { name } }),
   create: data => prisma.tag.create({ data }),
   delete: id => prisma.tag.delete({ where: { id } }),
   update: (id, data) => prisma.tag.update({ data, where: { id } }),
};
