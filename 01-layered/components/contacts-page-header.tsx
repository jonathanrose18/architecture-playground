export function ContactsPageHeader({ totalContacts }: { totalContacts: number }) {
  const subtitle =
    totalContacts > 0
      ? `${totalContacts} contact${totalContacts === 1 ? '' : 's'} available in your directory.`
      : 'No contacts yet. Add your first contact to start building your directory.';

  return (
    <header className='space-y-1'>
      <p className='text-sm font-medium text-muted-foreground'>Architecture Playground</p>
      <h1 className='text-3xl font-semibold tracking-tight'>Contact Directory</h1>
      <p className='text-sm text-muted-foreground'>{subtitle}</p>
    </header>
  );
}
