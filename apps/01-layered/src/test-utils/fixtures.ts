import type { ContactWithTags } from '@/types/contact';
import type { Tag } from '@/types/tag';

export function makeTag(overrides?: Partial<Tag>): Tag {
	return {
		id: 'tag-1',
		name: 'VIP',
		...overrides,
	};
}

export function makeContact(overrides?: Partial<ContactWithTags>): ContactWithTags {
	return {
		id: 'contact-1',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		phone: null,
		company: null,
		address: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		tags: [],
		...overrides,
	};
}
