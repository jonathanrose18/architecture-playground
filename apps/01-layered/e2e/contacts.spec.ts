import { expect, test } from '@playwright/test';

test.describe('Contacts page', () => {
	test('redirects from the root to /contacts', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveURL('/contacts');
	});

	test('shows the contacts heading', async ({ page }) => {
		await page.goto('/contacts');

		await expect(page.getByText('Contacts', { exact: true })).toBeVisible();
	});

	test('opens the create contact dialog when the button is clicked', async ({ page }) => {
		await page.goto('/contacts');

		await page.getByRole('button', { name: 'Create contact' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Create contact' })).toBeVisible();
	});

	test('creates a new contact and shows it in the table', async ({ page }) => {
		const uniqueEmail = `e2e-${Date.now()}@example.com`;

		await page.goto('/contacts');
		await page.getByRole('button', { name: 'Create contact' }).click();

		await page.getByLabel('First name').fill('E2E');
		await page.getByLabel('Last name').fill('Tester');
		await page.getByLabel('Email').fill(uniqueEmail);

		await page.getByRole('button', { name: 'Create' }).click();

		await expect(page.getByRole('row', { name: new RegExp(uniqueEmail) })).toBeVisible();
	});

	test('deletes a contact after confirming the dialog', async ({ page }) => {
		const uniqueEmail = `delete-${Date.now()}@example.com`;

		// First create a contact to delete
		await page.goto('/contacts');
		await page.getByRole('button', { name: 'Create contact' }).click();
		await page.getByLabel('First name').fill('Delete');
		await page.getByLabel('Last name').fill('Me');
		await page.getByLabel('Email').fill(uniqueEmail);
		await page.getByRole('button', { name: 'Create' }).click();
		await expect(page.getByText('Delete Me')).toBeVisible();

		// Now delete it — use the unique email so the selector is unambiguous
		// even if stale rows with the same name exist from previous runs.
		const row = page.getByRole('row', { name: new RegExp(uniqueEmail) });
		await row.getByRole('button', { name: 'Delete' }).click();

		// Confirm in the dialog
		await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

		await expect(page.getByText(uniqueEmail)).not.toBeVisible();
	});

	test('edits an existing contact', async ({ page }) => {
		const uniqueEmail = `edit-${Date.now()}@example.com`;
		const updatedEmail = `edited-${Date.now()}@example.com`;

		// Create a contact that will be edited
		await page.goto('/contacts');
		await page.getByRole('button', { name: 'Create contact' }).click();
		await page.getByLabel('First name').fill('Original');
		await page.getByLabel('Last name').fill('Person');
		await page.getByLabel('Email').fill(uniqueEmail);
		await page.getByRole('button', { name: 'Create' }).click();
		await expect(page.getByRole('row', { name: new RegExp(uniqueEmail) })).toBeVisible();

		// Edit the created contact
		const row = page.getByRole('row', { name: new RegExp(uniqueEmail) });
		await row.getByRole('button', { name: 'Edit' }).click();
		await page.getByLabel('First name').fill('Edited');
		await page.getByLabel('Last name').fill('Contact');
		await page.getByLabel('Email').fill(updatedEmail);
		await page.getByRole('button', { name: 'Save' }).click();

		await expect(page.getByRole('row', { name: new RegExp(updatedEmail) })).toContainText('Edited Contact');
		await expect(page.getByText(uniqueEmail)).not.toBeVisible();
	});
});
