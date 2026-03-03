import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeContact, makeTag } from '@/test-utils/fixtures';

// Must be mocked before importing the module under test
vi.mock('@/repositories/contact.repository', () => ({
	contactRepository: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getByEmail: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		assignTag: vi.fn(),
		removeTag: vi.fn(),
	},
}));

vi.mock('@/services/tag.service', () => ({
	tagService: {
		getById: vi.fn(),
	},
}));

const { contactRepository } = await import('@/repositories/contact.repository');
const { tagService } = await import('@/services/tag.service');
const { contactService } = await import('@/services/contact.service');

describe('contactService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns all contacts from the repository', async () => {
			const contacts = [makeContact(), makeContact({ id: 'contact-2', email: 'jane@example.com' })];
			vi.mocked(contactRepository.getAll).mockResolvedValue(contacts);

			const result = await contactService.getAll();

			expect(result).toEqual(contacts);
			expect(contactRepository.getAll).toHaveBeenCalledOnce();
		});
	});

	describe('getById', () => {
		it('returns the contact when found', async () => {
			const contact = makeContact();
			vi.mocked(contactRepository.getById).mockResolvedValue(contact);

			const result = await contactService.getById('contact-1');

			expect(result).toEqual(contact);
		});

		it('throws "Contact not found" when no contact exists for the given id', async () => {
			vi.mocked(contactRepository.getById).mockResolvedValue(null);

			await expect(contactService.getById('unknown')).rejects.toThrow('Contact not found');
		});
	});

	describe('getByEmail', () => {
		it('returns the contact when found by email', async () => {
			const contact = makeContact();
			vi.mocked(contactRepository.getByEmail).mockResolvedValue(contact);

			const result = await contactService.getByEmail('john@example.com');

			expect(result).toEqual(contact);
		});

		it('throws "Contact not found" when no contact has that email', async () => {
			vi.mocked(contactRepository.getByEmail).mockResolvedValue(null);

			await expect(contactService.getByEmail('missing@example.com')).rejects.toThrow('Contact not found');
		});
	});

	describe('create', () => {
		it('creates and returns a new contact when the email is unique', async () => {
			const newContact = makeContact();
			vi.mocked(contactRepository.getByEmail).mockResolvedValue(null);
			vi.mocked(contactRepository.create).mockResolvedValue(newContact);

			const result = await contactService.create({
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				phone: null,
				company: null,
				address: null,
			});

			expect(result).toEqual(newContact);
			expect(contactRepository.create).toHaveBeenCalledOnce();
		});

		it('throws "Email already exists" when the email is already in use', async () => {
			vi.mocked(contactRepository.getByEmail).mockResolvedValue(makeContact());

			await expect(
				contactService.create({
					firstName: 'John',
					lastName: 'Doe',
					email: 'john@example.com',
					phone: null,
					company: null,
					address: null,
				}),
			).rejects.toThrow('Email already exists');

			expect(contactRepository.create).not.toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('updates and returns the contact after verifying existence', async () => {
			const existing = makeContact();
			const updated = makeContact({ firstName: 'Jonathan' });
			vi.mocked(contactRepository.getById).mockResolvedValue(existing);
			vi.mocked(contactRepository.update).mockResolvedValue(updated);

			const result = await contactService.update('contact-1', { firstName: 'Jonathan' });

			expect(result).toEqual(updated);
			expect(contactRepository.getById).toHaveBeenCalledWith('contact-1');
			expect(contactRepository.update).toHaveBeenCalledWith('contact-1', { firstName: 'Jonathan' });
		});

		it('throws "Contact not found" if the contact does not exist', async () => {
			vi.mocked(contactRepository.getById).mockResolvedValue(null);

			await expect(contactService.update('unknown', { firstName: 'x' })).rejects.toThrow('Contact not found');
			expect(contactRepository.update).not.toHaveBeenCalled();
		});
	});

	describe('delete', () => {
		it('deletes and returns the contact after verifying existence', async () => {
			const contact = makeContact();
			vi.mocked(contactRepository.getById).mockResolvedValue(contact);
			vi.mocked(contactRepository.delete).mockResolvedValue(contact);

			const result = await contactService.delete('contact-1');

			expect(result).toEqual(contact);
			expect(contactRepository.getById).toHaveBeenCalledWith('contact-1');
			expect(contactRepository.delete).toHaveBeenCalledWith('contact-1');
		});

		it('throws "Contact not found" if the contact does not exist', async () => {
			vi.mocked(contactRepository.getById).mockResolvedValue(null);

			await expect(contactService.delete('unknown')).rejects.toThrow('Contact not found');
			expect(contactRepository.delete).not.toHaveBeenCalled();
		});
	});

	describe('assignTag', () => {
		it('validates the tag exists and then assigns it to the contact', async () => {
			const tag = makeTag();
			vi.mocked(tagService.getById).mockResolvedValue(tag);
			vi.mocked(contactRepository.assignTag).mockResolvedValue(undefined);

			await contactService.assignTag('contact-1', 'tag-1');

			expect(tagService.getById).toHaveBeenCalledWith('tag-1');
			expect(contactRepository.assignTag).toHaveBeenCalledWith('contact-1', 'tag-1');
		});

		it('throws "Tag not found" without assigning when the tag does not exist', async () => {
			vi.mocked(tagService.getById).mockRejectedValue(new Error('Tag not found'));

			await expect(contactService.assignTag('contact-1', 'unknown-tag')).rejects.toThrow('Tag not found');
			expect(contactRepository.assignTag).not.toHaveBeenCalled();
		});
	});

	describe('removeTag', () => {
		it('validates the tag exists and then removes it from the contact', async () => {
			const tag = makeTag();
			vi.mocked(tagService.getById).mockResolvedValue(tag);
			vi.mocked(contactRepository.removeTag).mockResolvedValue(undefined);

			await contactService.removeTag('contact-1', 'tag-1');

			expect(tagService.getById).toHaveBeenCalledWith('tag-1');
			expect(contactRepository.removeTag).toHaveBeenCalledWith('contact-1', 'tag-1');
		});

		it('throws "Tag not found" without removing when the tag does not exist', async () => {
			vi.mocked(tagService.getById).mockRejectedValue(new Error('Tag not found'));

			await expect(contactService.removeTag('contact-1', 'unknown-tag')).rejects.toThrow('Tag not found');
			expect(contactRepository.removeTag).not.toHaveBeenCalled();
		});
	});
});
