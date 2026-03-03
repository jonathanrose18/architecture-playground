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
import { toContactFormState, formStateToPayload, type ContactFormState } from '@/lib/form-utils';
import type { ContactWithTags } from '@/types/contact';

import { ContactFormFields } from './contact-form-fields';

export function EditContactDialog({ contact }: { contact: ContactWithTags }) {
   const router = useRouter();

   const [form, setForm] = useState<ContactFormState>(() => toContactFormState(contact));
   const [isSaving, setIsSaving] = useState(false);
   const [open, setOpen] = useState(false);

   const setField = (field: keyof ContactFormState, value: string) => {
      setForm(current => ({ ...current, [field]: value }));
   };

   const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSaving(true);
      try {
         await contactsApi.update(contact.id, formStateToPayload(form));
         toast.success('Contact updated');
         setOpen(false);
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not update contact');
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <Dialog
         open={open}
         onOpenChange={nextOpen => {
            setOpen(nextOpen);
            if (nextOpen) setForm(toContactFormState(contact));
         }}
      >
         <DialogTrigger asChild>
            <Button size='sm' variant='outline'>
               Edit
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Edit contact</DialogTitle>
               <DialogDescription>Update the contact details.</DialogDescription>
            </DialogHeader>
            <form className='space-y-4' onSubmit={handleSubmit}>
               <ContactFormFields idPrefix={`edit-${contact.id}`} form={form} onChange={setField} />
               <DialogFooter>
                  <Button type='submit' disabled={isSaving}>
                     {isSaving ? 'Saving...' : 'Save'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
