import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContactsTable } from '@/components/contacts-table';
import { makeContact, makeTag } from '@/test-utils/fixtures';

describe('ContactsTable', () => {
	describe('when there are no contacts', () => {
		it('shows an empty-state message', () => {
			render(<ContactsTable contacts={[]} renderActions={() => null} />);

			expect(screen.getByText('No contacts yet.')).toBeInTheDocument();
		});

		it('shows "0 contact(s)" in the caption', () => {
			render(<ContactsTable contacts={[]} renderActions={() => null} />);

			expect(screen.getByText('0 contact(s)')).toBeInTheDocument();
		});
	});

	describe('when contacts are present', () => {
		const contact = makeContact({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			phone: '+49 123',
			company: 'Acme',
		});

		it('renders the contact full name', () => {
			render(<ContactsTable contacts={[contact]} renderActions={() => null} />);

			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('renders the contact email', () => {
			render(<ContactsTable contacts={[contact]} renderActions={() => null} />);

			expect(screen.getByText('john@example.com')).toBeInTheDocument();
		});

		it('renders the correct contact count in the caption', () => {
			const contacts = [contact, makeContact({ id: 'contact-2', email: 'jane@example.com' })];
			render(<ContactsTable contacts={contacts} renderActions={() => null} />);

			expect(screen.getByText('2 contact(s)')).toBeInTheDocument();
		});

		it('shows "No tags" when a contact has no tags', () => {
			const contactWithoutTags = makeContact({ tags: [] });
			render(<ContactsTable contacts={[contactWithoutTags]} renderActions={() => null} />);

			expect(screen.getByText('No tags')).toBeInTheDocument();
		});

		it('renders tag badges when a contact has tags', () => {
			const contactWithTags = makeContact({
				tags: [makeTag({ id: 't1', name: 'VIP' }), makeTag({ id: 't2', name: 'Lead' })],
			});
			render(<ContactsTable contacts={[contactWithTags]} renderActions={() => null} />);

			expect(screen.getByText('VIP')).toBeInTheDocument();
			expect(screen.getByText('Lead')).toBeInTheDocument();
		});

		it('calls renderActions for each contact row', () => {
			const contacts = [contact, makeContact({ id: 'contact-2', email: 'jane@example.com' })];
			const actionIds: string[] = [];
			render(
				<ContactsTable
					contacts={contacts}
					renderActions={c => {
						actionIds.push(c.id);
						return <span data-testid={`action-${c.id}`}>action</span>;
					}}
				/>,
			);

			expect(actionIds).toHaveLength(2);
			expect(screen.getAllByTestId(/^action-/)).toHaveLength(2);
		});

		it('renders optional toolbar content', () => {
			render(
				<ContactsTable contacts={[]} renderActions={() => null} toolbar={<button>Create</button>} />,
			);

			expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
		});
	});
});
