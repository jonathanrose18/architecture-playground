import { Building2Icon, PhoneIcon, UserRoundPlusIcon, UsersIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { Contact } from '@/repositories/contact.repository';

type ContactsSummaryCardsProps = {
  contacts: Contact[];
};

type ContactsSummary = {
  total: number;
  withCompany: number;
  withPhone: number;
  addedThisMonth: number;
};

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

function createSummaryItems(summary: ContactsSummary): SummaryItem[] {
  return [
    {
      id: 'total',
      label: 'Total Contacts',
      value: summary.total.toString(),
      description: 'All records in your directory',
      icon: UsersIcon,
    },
    {
      id: 'companies',
      label: 'With Company',
      value: summary.withCompany.toString(),
      description: 'Contacts linked to organizations',
      icon: Building2Icon,
    },
    {
      id: 'phone',
      label: 'With Phone',
      value: summary.withPhone.toString(),
      description: 'Contacts ready for direct calling',
      icon: PhoneIcon,
    },
    {
      id: 'recent',
      label: 'Added This Month',
      value: summary.addedThisMonth.toString(),
      description: 'New contacts added recently',
      icon: UserRoundPlusIcon,
    },
  ];
}

function summarizeContacts(contacts: Contact[]): ContactsSummary {
  const today = new Date();

  return contacts.reduce<ContactsSummary>(
    (summary, contact) => {
      const createdAt = new Date(contact.createdAt);

      if (contact.company) {
        summary.withCompany += 1;
      }

      if (contact.phone) {
        summary.withPhone += 1;
      }

      if (createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear()) {
        summary.addedThisMonth += 1;
      }

      summary.total += 1;
      return summary;
    },
    {
      total: 0,
      withCompany: 0,
      withPhone: 0,
      addedThisMonth: 0,
    }
  );
}

export function ContactsSummaryCards({ contacts }: ContactsSummaryCardsProps) {
  const summary = summarizeContacts(contacts);
  const items = createSummaryItems(summary);

  return (
    <section aria-label='Contacts summary' className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      {items.map(({ id, label, value, description, icon: Icon }) => (
        <article key={id} className='rounded-xl border bg-card p-4'>
          <div className='flex items-start justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>{label}</p>
            <Icon className='size-4 text-muted-foreground' />
          </div>
          <p className='mt-3 text-2xl font-semibold tracking-tight'>{value}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
        </article>
      ))}
    </section>
  );
}
