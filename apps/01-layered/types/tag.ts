export type Tag = {
   id: string;
   name: string;
};

export type TagCreateInput = {
   name: string;
};

export type TagUpdateInput = TagCreateInput;

export type TagRepository = {
   getAll: () => Promise<Tag[]>;
   getById: (id: string) => Promise<Tag | null>;
   getByName: (name: string) => Promise<Tag | null>;
   create: (data: TagCreateInput) => Promise<Tag>;
   update: (id: string, data: TagUpdateInput) => Promise<Tag>;
   delete: (id: string) => Promise<Tag>;
   assignTag: (contactId: string, tagId: string) => Promise<void>;
   removeTag: (contactId: string, tagId: string) => Promise<void>;
};
