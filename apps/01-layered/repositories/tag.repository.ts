import { prisma } from '@workspace/database';

export const tagRepository: TagRepository = {
   getAll: () => prisma.tag.findMany({ orderBy: { name: 'asc' } }),
   getById: (id: string) => prisma.tag.findUnique({ where: { id } }),
   getByName: (name: string) => prisma.tag.findUnique({ where: { name } }),
   create: data => prisma.tag.create({ data }),
   delete: (id: string) => prisma.tag.delete({ where: { id } }),
   update: (id, data) => prisma.tag.update({ data, where: { id } }),
};

export type Tag = { id: string; name: string };

export type TagCreateInput = { name: string };

export type TagUpdateInput = TagCreateInput;

export type TagRepository = {
   getAll: () => Promise<Tag[]>;
   getById: (id: string) => Promise<Tag | null>;
   getByName: (name: string) => Promise<Tag | null>;
   create: (data: TagCreateInput) => Promise<Tag>;
   update: (id: string, data: TagUpdateInput) => Promise<Tag>;
   delete: (id: string) => Promise<Tag>;
};
