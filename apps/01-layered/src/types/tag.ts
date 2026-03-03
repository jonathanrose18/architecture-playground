export type Tag = { id: string; name: string };

export type TagCreateInput = Pick<Tag, 'name'>;

export type TagUpdateInput = TagCreateInput;

export type TagRepository = {
   getAll: () => Promise<Tag[]>;
   getById: (id: string) => Promise<Tag | null>;
   getByName: (name: string) => Promise<Tag | null>;
   create: (data: TagCreateInput) => Promise<Tag>;
   update: (id: string, data: TagUpdateInput) => Promise<Tag>;
   delete: (id: string) => Promise<Tag>;
};
