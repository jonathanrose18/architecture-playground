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
import { Input } from '@workspace/ui/components/ui/input';
import { Label } from '@workspace/ui/components/ui/label';
import { toast } from '@workspace/ui/components/ui/sonner';

type ContactFormState = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   company: string;
   address: string;
};

const emptyForm: ContactFormState = {
   firstName: '',
   lastName: '',
   email: '',
   phone: '',
   company: '',
   address: '',
};

function asNullableString(value: string) {
   const trimmed = value.trim();
   return trimmed.length > 0 ? trimmed : null;
}

async function getApiError(response: Response) {
   try {
      const data = (await response.json()) as { error?: string };
      return data.error ?? 'Request failed';
   } catch {
      return 'Request failed';
   }
}

export function CreateContactDialog() {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [form, setForm] = useState<ContactFormState>(emptyForm);

   const setField = (field: keyof ContactFormState, value: string) => {
      setForm(current => ({ ...current, [field]: value }));
   };

   const submit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSaving(true);
      try {
         const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               firstName: form.firstName.trim(),
               lastName: form.lastName.trim(),
               email: form.email.trim(),
               phone: asNullableString(form.phone),
               company: asNullableString(form.company),
               address: asNullableString(form.address),
            }),
         });

         if (!response.ok) {
            throw new Error(await getApiError(response));
         }

         toast.success('Contact created');
         setOpen(false);
         setForm(emptyForm);
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
            <form className='space-y-4' onSubmit={submit}>
               <div className='grid gap-2'>
                  <Label htmlFor='create-first-name'>First name</Label>
                  <Input
                     id='create-first-name'
                     required
                     value={form.firstName}
                     onChange={event => setField('firstName', event.target.value)}
                  />
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='create-last-name'>Last name</Label>
                  <Input
                     id='create-last-name'
                     required
                     value={form.lastName}
                     onChange={event => setField('lastName', event.target.value)}
                  />
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='create-email'>Email</Label>
                  <Input
                     id='create-email'
                     type='email'
                     required
                     value={form.email}
                     onChange={event => setField('email', event.target.value)}
                  />
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='create-phone'>Phone</Label>
                  <Input
                     id='create-phone'
                     value={form.phone}
                     onChange={event => setField('phone', event.target.value)}
                  />
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='create-company'>Company</Label>
                  <Input
                     id='create-company'
                     value={form.company}
                     onChange={event => setField('company', event.target.value)}
                  />
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='create-address'>Address</Label>
                  <Input
                     id='create-address'
                     value={form.address}
                     onChange={event => setField('address', event.target.value)}
                  />
               </div>
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
