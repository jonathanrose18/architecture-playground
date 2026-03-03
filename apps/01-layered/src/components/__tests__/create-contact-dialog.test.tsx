import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateContactDialog } from '@/components/create-contact-dialog';

const { mockRefresh, mockCreate, mockToast } = vi.hoisted(() => ({
	mockRefresh: vi.fn(),
	mockCreate: vi.fn(),
	mockToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('@/lib/api', () => ({
	contactsApi: { create: mockCreate },
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

describe('CreateContactDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('opens the dialog when clicking "Create contact"', async () => {
		const user = userEvent.setup();
		render(<CreateContactDialog />);

		await user.click(screen.getByRole('button', { name: 'Create contact' }));

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Create contact' })).toBeInTheDocument();
	});

	it('creates a contact, closes the dialog, resets the form, and refreshes', async () => {
		const user = userEvent.setup();
		mockCreate.mockResolvedValue({
			id: 'contact-1',
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
			phone: null,
			company: null,
			address: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			tags: [],
		});

		render(<CreateContactDialog />);

		await user.click(screen.getByRole('button', { name: 'Create contact' }));
		await user.type(screen.getByLabelText('First name'), '  Jane  ');
		await user.type(screen.getByLabelText('Last name'), '  Doe  ');
		await user.type(screen.getByLabelText('Email'), '  jane@example.com  ');
		await user.type(screen.getByLabelText('Phone'), '  +49 123  ');
		await user.type(screen.getByLabelText('Company'), '  Acme  ');
		await user.type(screen.getByLabelText('Address'), '   ');

		await user.click(screen.getByRole('button', { name: 'Create' }));

		await waitFor(() => {
			expect(mockCreate).toHaveBeenCalledWith({
				address: null,
				company: 'Acme',
				email: 'jane@example.com',
				firstName: 'Jane',
				lastName: 'Doe',
				phone: '+49 123',
			});
		});

		expect(mockToast.success).toHaveBeenCalledWith('Contact created');
		expect(mockRefresh).toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Create contact' }));
		expect(screen.getByLabelText('First name')).toHaveValue('');
		expect(screen.getByLabelText('Email')).toHaveValue('');
	});

	it('shows an error toast and keeps the dialog open when creation fails', async () => {
		const user = userEvent.setup();
		mockCreate.mockRejectedValue(new Error('Could not create contact'));
		render(<CreateContactDialog />);

		await user.click(screen.getByRole('button', { name: 'Create contact' }));
		await user.type(screen.getByLabelText('First name'), 'Jane');
		await user.type(screen.getByLabelText('Last name'), 'Doe');
		await user.type(screen.getByLabelText('Email'), 'jane@example.com');

		await user.click(screen.getByRole('button', { name: 'Create' }));

		await waitFor(() => {
			expect(mockToast.error).toHaveBeenCalledWith('Could not create contact');
		});
		expect(mockRefresh).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
