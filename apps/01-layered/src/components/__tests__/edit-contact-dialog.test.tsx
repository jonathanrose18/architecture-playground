import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditContactDialog } from '@/components/edit-contact-dialog';
import { makeContact } from '@/test-utils/fixtures';

const { mockRefresh, mockUpdate, mockToast } = vi.hoisted(() => ({
	mockRefresh: vi.fn(),
	mockUpdate: vi.fn(),
	mockToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('@/lib/api', () => ({
	contactsApi: { update: mockUpdate },
}));

vi.mock('@workspace/ui/components/ui/sonner', () => ({
	toast: mockToast,
}));

// Button is a thin styled wrapper — no mock needed; the real component renders
// a plain <button> that Testing Library can query without any polyfills.

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

// ContactFormFields is our own component — use the real implementation so the
// test exercises the actual label/input wiring, not a duplicate of it.

describe('EditContactDialog', () => {
	const contact = makeContact({
		id: 'contact-1',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		phone: '+49 123',
		company: 'Acme',
		address: 'Berlin',
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('opens the dialog with the contact prefilled', async () => {
		const user = userEvent.setup();
		render(<EditContactDialog contact={contact} />);

		await user.click(screen.getByRole('button', { name: 'Edit' }));

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByLabelText('First name')).toHaveValue('John');
		expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
	});

	it('submits updates and refreshes on success', async () => {
		const user = userEvent.setup();
		mockUpdate.mockResolvedValue(
			makeContact({
				...contact,
				firstName: 'Jane',
				email: 'jane@example.com',
			}),
		);
		render(<EditContactDialog contact={contact} />);

		await user.click(screen.getByRole('button', { name: 'Edit' }));
		await user.clear(screen.getByLabelText('First name'));
		await user.type(screen.getByLabelText('First name'), '  Jane  ');
		await user.clear(screen.getByLabelText('Email'));
		await user.type(screen.getByLabelText('Email'), '  jane@example.com  ');

		await user.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() => {
			expect(mockUpdate).toHaveBeenCalledWith('contact-1', {
				address: 'Berlin',
				company: 'Acme',
				email: 'jane@example.com',
				firstName: 'Jane',
				lastName: 'Doe',
				phone: '+49 123',
			});
		});

		expect(mockToast.success).toHaveBeenCalledWith('Contact updated');
		expect(mockRefresh).toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('resets unsaved form changes each time the dialog is opened', async () => {
		const user = userEvent.setup();
		mockUpdate.mockResolvedValue(contact);
		render(<EditContactDialog contact={contact} />);

		await user.click(screen.getByRole('button', { name: 'Edit' }));
		await user.clear(screen.getByLabelText('First name'));
		await user.type(screen.getByLabelText('First name'), 'Unsaved');
		await user.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		await user.click(screen.getByRole('button', { name: 'Edit' }));
		expect(screen.getByLabelText('First name')).toHaveValue('John');
	});

	it('shows an error toast when update fails', async () => {
		const user = userEvent.setup();
		mockUpdate.mockRejectedValue(new Error('Could not update contact'));
		render(<EditContactDialog contact={contact} />);

		await user.click(screen.getByRole('button', { name: 'Edit' }));
		await user.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() => {
			expect(mockToast.error).toHaveBeenCalledWith('Could not update contact');
		});
		expect(mockRefresh).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
