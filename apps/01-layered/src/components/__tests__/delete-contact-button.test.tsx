import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteContactButton } from '@/components/delete-contact-button';
import { makeContact } from '@/test-utils/fixtures';

// vi.mock is hoisted to the top of the file, so variables referenced inside
// the factory must also be hoisted with vi.hoisted().
const { mockRefresh, mockDelete, mockToast } = vi.hoisted(() => ({
	mockRefresh: vi.fn(),
	mockDelete: vi.fn(),
	mockToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('@/lib/api', () => ({
	contactsApi: { delete: mockDelete },
}));

vi.mock('@workspace/ui/components/ui/sonner', () => ({
	toast: mockToast,
}));

// Mock the Radix UI Dialog with a lightweight Context-based implementation to
// avoid React version conflicts across workspace packages. The async factory
// pattern lets us safely import React inside the mock.
vi.mock('@workspace/ui/components/ui/dialog', async () => {
	const React = await import('react');

	type OpenCtxValue = { open: boolean; onOpenChange: (open: boolean) => void };
	const OpenCtx = React.createContext<OpenCtxValue>({ open: false, onOpenChange: () => {} });

	function Dialog({
		children,
		open,
		onOpenChange,
	}: {
		children: React.ReactNode;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}) {
		return React.createElement(OpenCtx.Provider, { value: { open, onOpenChange } }, children);
	}

	function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
		const { onOpenChange } = React.useContext(OpenCtx);
		if (asChild && React.isValidElement(children)) {
			return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
				onClick: () => onOpenChange(true),
			});
		}
		return React.createElement('button', { onClick: () => onOpenChange(true) }, children);
	}

	function DialogContent({ children }: { children: React.ReactNode }) {
		const { open } = React.useContext(OpenCtx);
		return open ? React.createElement('div', { role: 'dialog' }, children) : null;
	}

	const DialogHeader = ({ children }: { children: React.ReactNode }) =>
		React.createElement('div', null, children);
	const DialogFooter = ({ children }: { children: React.ReactNode }) =>
		React.createElement('div', null, children);
	const DialogTitle = ({ children }: { children: React.ReactNode }) =>
		React.createElement('h2', null, children);
	const DialogDescription = ({ children }: { children: React.ReactNode }) =>
		React.createElement('p', null, children);

	return { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
});

vi.mock('@workspace/ui/components/ui/button', async () => {
	const React = await import('react');
	const Button = ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => React.createElement('button', { onClick, disabled }, children);
	return { Button };
});

describe('DeleteContactButton', () => {
	const contact = makeContact({ firstName: 'John', lastName: 'Doe' });

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders a "Delete" trigger button', () => {
		render(<DeleteContactButton contact={contact} />);

		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
	});

	it('opens the confirmation dialog when the button is clicked', async () => {
		render(<DeleteContactButton contact={contact} />);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Delete contact')).toBeInTheDocument();
		expect(screen.getByText(/John Doe/)).toBeInTheDocument();
		expect(screen.getByText(/This cannot be undone/)).toBeInTheDocument();
	});

	it('closes the dialog when "Cancel" is clicked', async () => {
		render(<DeleteContactButton contact={contact} />);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('calls the delete API with the contact id on confirmation', async () => {
		mockDelete.mockResolvedValue(undefined);
		render(<DeleteContactButton contact={contact} />);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
		// The dialog shows a second "Delete" confirm button alongside the trigger.
		const buttons = screen.getAllByRole('button', { name: 'Delete' });
		await userEvent.click(buttons[buttons.length - 1]!);

		await waitFor(() => {
			expect(mockDelete).toHaveBeenCalledWith('contact-1');
		});
	});

	it('shows a success toast and refreshes the router after successful deletion', async () => {
		mockDelete.mockResolvedValue(undefined);
		render(<DeleteContactButton contact={contact} />);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
		const buttons = screen.getAllByRole('button', { name: 'Delete' });
		await userEvent.click(buttons[buttons.length - 1]!);

		await waitFor(() => {
			expect(mockToast.success).toHaveBeenCalledWith('Contact deleted');
			expect(mockRefresh).toHaveBeenCalled();
		});
	});

	it('shows an error toast when the delete API call fails', async () => {
		mockDelete.mockRejectedValue(new Error('Server error'));
		render(<DeleteContactButton contact={contact} />);

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
		const buttons = screen.getAllByRole('button', { name: 'Delete' });
		await userEvent.click(buttons[buttons.length - 1]!);

		await waitFor(() => {
			expect(mockToast.error).toHaveBeenCalledWith('Server error');
		});
	});
});
