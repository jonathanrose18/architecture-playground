import 'server-only';

import { tagRepository } from '@/repositories/tag.repository';
import type { TagCreateInput, TagRepository, TagUpdateInput } from '@/types/tag';

const repo: TagRepository = tagRepository;

export const tagService = {
   async getAll() {
      return repo.getAll();
   },

   async getById(id: string) {
      const tag = await repo.getById(id);
      if (!tag) throw new Error('Tag not found');
      return tag;
   },

   async getByName(name: string) {
      const tag = await repo.getByName(name);
      if (!tag) throw new Error('Tag not found');
      return tag;
   },

   async create(data: TagCreateInput) {
      const existing = await repo.getByName(data.name);
      if (existing) throw new Error('Tag already exists');
      return repo.create(data);
   },

   async update(id: string, data: TagUpdateInput) {
      await tagService.getById(id);
      return repo.update(id, data);
   },

   async delete(id: string) {
      await tagService.getById(id);
      return repo.delete(id);
   },
};
