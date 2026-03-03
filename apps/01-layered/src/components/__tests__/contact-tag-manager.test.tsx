import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactTagManager } from '@/components/contact-tag-manager';
import { makeContact, makeTag } from '@/test-utils/fixtures';

const { mockRefresh, mockAssignTag, mockRemoveTag, mockToast } = vi.hoisted(() => ({
	mockRefresh: vi.fn(),
	mockAssignTag: vi.fn(),
	mockRemoveTag: vi.fn(),
	mockToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('@/lib/api', () => ({
	contactsApi: {
		assignTag: mockAssignTag,
		removeTag: mockRemoveTag,
	},
}));

vi.mock('@workspace/ui/components/ui/sonner', () => ({
	toast: mockToast,
}));

vi.mock('@workspace/ui/components/ui/button', async () => {
	const React = await import('react');
	const Button = ({
		children,
		type = 'button',
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		type?: 'button' | 'submit' | 'reset';
		onClick?: () => void;
		disabled?: boolean;
	}) => React.createElement('button', { type, onClick, disabled }, children);
	return { Button };
});

vi.mock('@workspace/ui/components/ui/badge', async () => {
	const React = await import('react');
	const Badge = ({ children }: { children: React.ReactNode }) => React.createElement('span', null, children);
	return { Badge };
});

vi.mock('@workspace/ui/components/ui/select', async () => {
	const React = await import('react');

	const Select = ({
		value,
		onValueChange,
		children,
	}: {
		value: string;
		onValueChange: (value: string) => void;
		children: React.ReactNode;
	}) =>
		React.createElement(
			'select',
			{
				'aria-label': 'Assign tag',
				value,
				onChange: (event: React.ChangeEvent<HTMLSelectElement>) => onValueChange(event.target.value),
			},
			children,
		);

	const SelectTrigger = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
	const SelectValue = ({ placeholder }: { placeholder?: string }) =>
		React.createElement('option', { value: '' }, placeholder ?? '');
	const SelectContent = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
	const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) =>
		React.createElement('option', { value }, children);

	return { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
});

describe('ContactTagManager', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('shows "No available tags" when all tags are already assigned', () => {
		const vip = makeTag({ id: 'tag-1', name: 'VIP' });
		const contact = makeContact({ tags: [vip] });

		render(<ContactTagManager contact={contact} allTags={[vip]} />);

		expect(screen.getByText('No available tags')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Assign' })).not.toBeInTheDocument();
	});

	it('assigns an available tag and refreshes on success', async () => {
		const user = userEvent.setup();
		const vip = makeTag({ id: 'tag-1', name: 'VIP' });
		const lead = makeTag({ id: 'tag-2', name: 'Lead' });
		const contact = makeContact({ id: 'contact-1', tags: [vip] });
		mockAssignTag.mockResolvedValue(undefined);

		render(<ContactTagManager contact={contact} allTags={[vip, lead]} />);

		await user.selectOptions(screen.getByLabelText('Assign tag'), 'tag-2');
		await user.click(screen.getByRole('button', { name: 'Assign' }));

		await waitFor(() => {
			expect(mockAssignTag).toHaveBeenCalledWith('contact-1', 'tag-2');
		});
		expect(mockToast.success).toHaveBeenCalledWith('Tag assigned');
		expect(mockRefresh).toHaveBeenCalled();
		expect(screen.getAllByRole('button', { name: 'x' })).toHaveLength(2);
	});

	it('rolls back optimistic assign when the API call fails', async () => {
		const user = userEvent.setup();
		const vip = makeTag({ id: 'tag-1', name: 'VIP' });
		const lead = makeTag({ id: 'tag-2', name: 'Lead' });
		const contact = makeContact({ id: 'contact-1', tags: [vip] });
		mockAssignTag.mockRejectedValue(new Error('Could not assign tag'));

		render(<ContactTagManager contact={contact} allTags={[vip, lead]} />);

		await user.selectOptions(screen.getByLabelText('Assign tag'), 'tag-2');
		await user.click(screen.getByRole('button', { name: 'Assign' }));

		await waitFor(() => {
			expect(mockToast.error).toHaveBeenCalledWith('Could not assign tag');
		});
		expect(screen.getAllByRole('button', { name: 'x' })).toHaveLength(1);
	});

	it('removes a tag and refreshes on success', async () => {
		const user = userEvent.setup();
		const vip = makeTag({ id: 'tag-1', name: 'VIP' });
		const contact = makeContact({ id: 'contact-1', tags: [vip] });
		mockRemoveTag.mockResolvedValue(undefined);

		render(<ContactTagManager contact={contact} allTags={[vip]} />);

		await user.click(screen.getByRole('button', { name: 'x' }));

		await waitFor(() => {
			expect(mockRemoveTag).toHaveBeenCalledWith('contact-1', 'tag-1');
		});
		expect(mockToast.success).toHaveBeenCalledWith('Tag removed');
		expect(mockRefresh).toHaveBeenCalled();
		expect(screen.queryByRole('button', { name: 'x' })).not.toBeInTheDocument();
	});

	it('rolls back optimistic removal when the API call fails', async () => {
		const user = userEvent.setup();
		const vip = makeTag({ id: 'tag-1', name: 'VIP' });
		const contact = makeContact({ id: 'contact-1', tags: [vip] });
		mockRemoveTag.mockRejectedValue(new Error('Could not remove tag'));

		render(<ContactTagManager contact={contact} allTags={[vip]} />);

		await user.click(screen.getByRole('button', { name: 'x' }));

		await waitFor(() => {
			expect(mockToast.error).toHaveBeenCalledWith('Could not remove tag');
		});
		expect(screen.getByRole('button', { name: 'x' })).toBeInTheDocument();
	});
});
