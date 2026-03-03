'use client';

import { ContactTagManager } from '@/components/contact-tag-manager';
import { DeleteContactButton } from '@/components/delete-contact-button';
import { EditContactDialog } from '@/components/edit-contact-dialog';
import type { ContactWithTags } from '@/types/contact';
import type { Tag } from '@/types/tag';

export function ContactActions({ contact, allTags }: { contact: ContactWithTags; allTags: Tag[] }) {
   return (
      <div className='flex flex-col items-end gap-2'>
         <div className='flex items-center gap-2'>
            <EditContactDialog contact={contact} />
            <DeleteContactButton contact={contact} />
         </div>
         <ContactTagManager contact={contact} allTags={allTags} />
      </div>
   );
}
