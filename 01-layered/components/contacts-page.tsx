import { ContactsEmpty } from '@/components/contacts-empty';
import { ContactsPageHeader } from '@/components/contacts-page-header';
import { ContactsSummaryCards } from '@/components/contacts-summary-cards';
import { ContactsTable } from '@/components/contacts-table';
import type { Contact } from '@/repositories/contact.repository';

type ContactsPageProps = {
  contacts: Contact[];
};

export function ContactsPage({ contacts }: ContactsPageProps) {
  return (
    <section className='w-full space-y-6'>
      <ContactsPageHeader totalContacts={contacts.length} />
      <ContactsSummaryCards contacts={contacts} />

      <section aria-label='Contacts list' className='rounded-xl border bg-card p-4 md:p-6'>
        {contacts.length > 0 ? <ContactsTable contacts={contacts} /> : <ContactsEmpty className='border-none p-0' />}
      </section>
    </section>
  );
}
