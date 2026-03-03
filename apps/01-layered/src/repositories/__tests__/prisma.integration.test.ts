import { afterAll, beforeEach, describe, expect, it } from 'vitest';

// Always point at the test database — never the application DB.
// Set DATABASE_URL_TEST in your environment to override the default.
process.env.DATABASE_URL =
	process.env.DATABASE_URL_TEST ??
	'postgresql://postgres:postgres@localhost:5432/architecture_playground_test?schema=public';

const { prisma } = await import('@workspace/database');
const { contactRepository } = await import('@/repositories/contact.repository');
const { tagRepository } = await import('@/repositories/tag.repository');

async function resetDatabase() {
	await prisma.contact.deleteMany();
	await prisma.tag.deleteMany();
}

describe.sequential('Prisma repository integration tests', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	afterAll(async () => {
		await resetDatabase();
		await prisma.$disconnect();
	});

	it('creates, reads, and updates contacts through the repository', async () => {
		const created = await contactRepository.create({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			phone: null,
			company: null,
			address: null,
		});
		const byEmail = await contactRepository.getByEmail('john@example.com');
		const updated = await contactRepository.update(created.id, {
			phone: '+49 123',
			company: 'Acme',
		});

		expect(byEmail?.id).toBe(created.id);
		expect(updated.phone).toBe('+49 123');
		expect(updated.company).toBe('Acme');
	});

	it('assigns and removes tags for a contact', async () => {
		const contact = await contactRepository.create({
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
			phone: null,
			company: null,
			address: null,
		});
		const tag = await tagRepository.create({ name: 'VIP' });

		await contactRepository.assignTag(contact.id, tag.id);
		const withTag = await contactRepository.getById(contact.id);

		await contactRepository.removeTag(contact.id, tag.id);
		const withoutTag = await contactRepository.getById(contact.id);

		expect(withTag?.tags.map(t => t.id)).toContain(tag.id);
		expect(withoutTag?.tags).toHaveLength(0);
	});

	it('returns contacts ordered by lastName ascending', async () => {
		await contactRepository.create({
			firstName: 'Zoe',
			lastName: 'Zimmer',
			email: 'zoe@example.com',
			phone: null,
			company: null,
			address: null,
		});
		await contactRepository.create({
			firstName: 'Anna',
			lastName: 'Anders',
			email: 'anna@example.com',
			phone: null,
			company: null,
			address: null,
		});

		const contacts = await contactRepository.getAll();

		expect(contacts.map(contact => contact.lastName)).toEqual(['Anders', 'Zimmer']);
	});

	it('returns tags ordered by name and supports lookup/deletion', async () => {
		const vip = await tagRepository.create({ name: 'VIP' });
		await tagRepository.create({ name: 'Alpha' });

		const tags = await tagRepository.getAll();
		const byName = await tagRepository.getByName('VIP');

		await tagRepository.delete(vip.id);
		const deleted = await tagRepository.getById(vip.id);

		expect(tags.map(tag => tag.name)).toEqual(['Alpha', 'VIP']);
		expect(byName?.id).toBe(vip.id);
		expect(deleted).toBeNull();
	});
});
