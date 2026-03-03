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
import { emptyContactForm, formStateToPayload, type ContactFormState } from '@/lib/form-utils';

import { ContactFormFields } from './contact-form-fields';

export function CreateContactDialog() {
   const router = useRouter();

   const [form, setForm] = useState<ContactFormState>(emptyContactForm);
   const [isSaving, setIsSaving] = useState(false);
   const [open, setOpen] = useState(false);

   const setField = (field: keyof ContactFormState, value: string) => {
      setForm(current => ({ ...current, [field]: value }));
   };

   const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSaving(true);

      try {
         await contactsApi.create(formStateToPayload(form));

         toast.success('Contact created');
         setOpen(false);
         setForm(emptyContactForm);

         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not create contact');
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button>Create contact</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Create contact</DialogTitle>
               <DialogDescription>Add a new contact to your list.</DialogDescription>
            </DialogHeader>
            <form className='space-y-4' onSubmit={handleSubmit}>
               <ContactFormFields idPrefix='create' form={form} onChange={setField} />
               <DialogFooter>
                  <Button type='submit' disabled={isSaving}>
                     {isSaving ? 'Creating...' : 'Create'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
