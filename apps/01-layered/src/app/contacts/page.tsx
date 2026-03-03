import { ContactActions } from '@/components/contact-actions';
import { ContactsTable } from '@/components/contacts-table';
import { CreateContactDialog } from '@/components/create-contact-dialog';
import { CreateTagDialog } from '@/components/create-tag-dialog';
import { contactService } from '@/services/contact.service';
import { tagService } from '@/services/tag.service';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
   const [contacts, tags] = await Promise.all([contactService.getAll(), tagService.getAll()]);

   return (
      <ContactsTable
         contacts={contacts}
         toolbar={
            <div className='flex items-center gap-2'>
               <CreateTagDialog />
               <CreateContactDialog />
            </div>
         }
         renderActions={contact => <ContactActions contact={contact} allTags={tags} />}
      />
   );
}
