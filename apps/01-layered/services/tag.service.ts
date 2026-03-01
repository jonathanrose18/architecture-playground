import { tagRepository, type TagCreateInput, type TagUpdateInput } from '@/repositories/tag.repository';

export const tagService = {
   async getAll() {
      return tagRepository.getAll();
   },

   async getById(id: string) {
      const tag = await tagRepository.getById(id);
      if (!tag) throw new Error('Tag not found');
      return tag;
   },

   async getByName(name: string) {
      const tag = await tagRepository.getByName(name);
      if (!tag) throw new Error('Tag not found');
      return tag;
   },

   async create(data: TagCreateInput) {
      const existing = await tagRepository.getByName(data.name);
      if (existing) throw new Error('Tag with name already exists');
      return tagRepository.create(data);
   },

   async update(id: string, data: TagUpdateInput) {
      await this.getById(id);
      return tagRepository.update(id, data);
   },

   async delete(id: string) {
      await this.getById(id);
      return tagRepository.delete(id);
   },
};
