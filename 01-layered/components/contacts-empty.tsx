import { Contact2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export function ContactsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Contact2Icon />
        </EmptyMedia>
        <EmptyTitle>No Contacts Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any contacts yet. Get started by creating your first contact.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button>Create Contact</Button>
      </EmptyContent>
    </Empty>
  );
}
