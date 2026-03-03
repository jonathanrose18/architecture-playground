import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTag } from '@/test-utils/fixtures';

// Must be mocked before importing the module under test
vi.mock('@/repositories/tag.repository', () => ({
	tagRepository: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getByName: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
}));

const { tagRepository } = await import('@/repositories/tag.repository');
const { tagService } = await import('@/services/tag.service');

describe('tagService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAll', () => {
		it('returns all tags from the repository', async () => {
			const tags = [makeTag({ id: '1', name: 'VIP' }), makeTag({ id: '2', name: 'Lead' })];
			vi.mocked(tagRepository.getAll).mockResolvedValue(tags);

			const result = await tagService.getAll();

			expect(result).toEqual(tags);
			expect(tagRepository.getAll).toHaveBeenCalledOnce();
		});
	});

	describe('getById', () => {
		it('returns the tag when found', async () => {
			const tag = makeTag();
			vi.mocked(tagRepository.getById).mockResolvedValue(tag);

			const result = await tagService.getById('tag-1');

			expect(result).toEqual(tag);
		});

		it('throws "Tag not found" when no tag exists for the given id', async () => {
			vi.mocked(tagRepository.getById).mockResolvedValue(null);

			await expect(tagService.getById('unknown-id')).rejects.toThrow('Tag not found');
		});
	});

	describe('getByName', () => {
		it('returns the tag when found by name', async () => {
			const tag = makeTag({ name: 'VIP' });
			vi.mocked(tagRepository.getByName).mockResolvedValue(tag);

			const result = await tagService.getByName('VIP');

			expect(result).toEqual(tag);
		});

		it('throws "Tag not found" when no tag exists with that name', async () => {
			vi.mocked(tagRepository.getByName).mockResolvedValue(null);

			await expect(tagService.getByName('unknown')).rejects.toThrow('Tag not found');
		});
	});

	describe('create', () => {
		it('creates and returns a new tag when the name is unique', async () => {
			const newTag = makeTag({ name: 'Premium' });
			vi.mocked(tagRepository.getByName).mockResolvedValue(null);
			vi.mocked(tagRepository.create).mockResolvedValue(newTag);

			const result = await tagService.create({ name: 'Premium' });

			expect(result).toEqual(newTag);
			expect(tagRepository.create).toHaveBeenCalledWith({ name: 'Premium' });
		});

		it('throws "Tag already exists" when the name is already taken', async () => {
			vi.mocked(tagRepository.getByName).mockResolvedValue(makeTag({ name: 'VIP' }));

			await expect(tagService.create({ name: 'VIP' })).rejects.toThrow('Tag already exists');
			expect(tagRepository.create).not.toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('updates and returns the tag after verifying existence', async () => {
			const existing = makeTag();
			const updated = makeTag({ name: 'Updated' });
			vi.mocked(tagRepository.getById).mockResolvedValue(existing);
			vi.mocked(tagRepository.update).mockResolvedValue(updated);

			const result = await tagService.update('tag-1', { name: 'Updated' });

			expect(result).toEqual(updated);
			expect(tagRepository.getById).toHaveBeenCalledWith('tag-1');
			expect(tagRepository.update).toHaveBeenCalledWith('tag-1', { name: 'Updated' });
		});

		it('throws "Tag not found" if the tag does not exist', async () => {
			vi.mocked(tagRepository.getById).mockResolvedValue(null);

			await expect(tagService.update('unknown', { name: 'x' })).rejects.toThrow('Tag not found');
			expect(tagRepository.update).not.toHaveBeenCalled();
		});
	});

	describe('delete', () => {
		it('deletes and returns the tag after verifying existence', async () => {
			const tag = makeTag();
			vi.mocked(tagRepository.getById).mockResolvedValue(tag);
			vi.mocked(tagRepository.delete).mockResolvedValue(tag);

			const result = await tagService.delete('tag-1');

			expect(result).toEqual(tag);
			expect(tagRepository.getById).toHaveBeenCalledWith('tag-1');
			expect(tagRepository.delete).toHaveBeenCalledWith('tag-1');
		});

		it('throws "Tag not found" if the tag does not exist', async () => {
			vi.mocked(tagRepository.getById).mockResolvedValue(null);

			await expect(tagService.delete('unknown')).rejects.toThrow('Tag not found');
			expect(tagRepository.delete).not.toHaveBeenCalled();
		});
	});
});
