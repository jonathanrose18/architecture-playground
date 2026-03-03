'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@workspace/ui/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@workspace/ui/components/ui/dialog';
import { toast } from '@workspace/ui/components/ui/sonner';

import { contactsApi } from '@/lib/api';
import type { ContactWithTags } from '@/types/contact';

export function DeleteContactButton({ contact }: { contact: ContactWithTags }) {
   const router = useRouter();

   const [isDeleting, setIsDeleting] = useState(false);
   const [open, setOpen] = useState(false);

   const handleDelete = async () => {
      setIsDeleting(true);

      try {
         await contactsApi.delete(contact.id);
         toast.success('Contact deleted');
         setOpen(false);
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not delete contact');
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button size='sm' variant='destructive'>
               Delete
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Delete contact</DialogTitle>
               <DialogDescription>
                  Delete {contact.firstName} {contact.lastName}? This cannot be undone.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button variant='outline' onClick={() => setOpen(false)}>
                  Cancel
               </Button>
               <Button variant='destructive' disabled={isDeleting} onClick={handleDelete}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
