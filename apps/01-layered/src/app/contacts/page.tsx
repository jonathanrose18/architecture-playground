import { ContactActions } from '@/components/contact-actions';
import { ContactsTable, type ContactTagOption, type ContactsTableContact } from '@/components/contacts-table';
import { CreateContactDialog } from '@/components/create-contact-dialog';
import { CreateTagDialog } from '@/components/create-tag-dialog';

import { contactService } from '@/services/contact.service';
import { tagService } from '@/services/tag.service';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
   const [contacts, tags] = await Promise.all([contactService.getAll(), tagService.getAll()]);

   const tableTags: ContactTagOption[] = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
   }));

   const tableContacts: ContactsTableContact[] = contacts.map(contact => ({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone ?? '',
      company: contact.company ?? '',
      address: contact.address ?? '',
      tags: contact.tags.map(tag => ({
         id: tag.id,
         name: tag.name,
      })),
   }));

   return (
      <ContactsTable
         contacts={tableContacts}
         toolbar={
            <div className='flex items-center gap-2'>
               <CreateTagDialog />
               <CreateContactDialog />
            </div>
         }
         renderActions={contact => <ContactActions contact={contact} tags={tableTags} />}
      />
   );
}
