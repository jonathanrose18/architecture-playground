'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Badge } from '@workspace/ui/components/ui/badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/ui/select';
import { toast } from '@workspace/ui/components/ui/sonner';

import type { ContactTagOption, ContactsTableContact } from '@/components/contacts-table';

type ContactActionsProps = {
   contact: ContactsTableContact;
   tags: ContactTagOption[];
};

type ContactFormState = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   company: string;
   address: string;
};

function toFormState(contact: ContactsTableContact): ContactFormState {
   return {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      address: contact.address,
   };
}

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

export function ContactActions({ contact, tags }: ContactActionsProps) {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [isAssigning, setIsAssigning] = useState(false);
   const [removingTagId, setRemovingTagId] = useState<string | null>(null);
   const [selectedTagId, setSelectedTagId] = useState('');
   const [form, setForm] = useState<ContactFormState>(() => toFormState(contact));

   const assignedTagIds = new Set(contact.tags.map(tag => tag.id));
   const availableTags = tags.filter(tag => !assignedTagIds.has(tag.id));
   const hasAvailableTags = availableTags.length > 0;

   const setField = (field: keyof ContactFormState, value: string) => {
      setForm(current => ({ ...current, [field]: value }));
   };

   const updateContact = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSaving(true);
      try {
         const response = await fetch(`/api/contacts/${contact.id}`, {
            method: 'PUT',
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

         toast.success('Contact updated');
         setOpen(false);
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not update contact');
      } finally {
         setIsSaving(false);
      }
   };

   const deleteContact = async () => {
      if (!window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
         return;
      }

      setIsDeleting(true);
      try {
         const response = await fetch(`/api/contacts/${contact.id}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error(await getApiError(response));
         }

         toast.success('Contact deleted');
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not delete contact');
      } finally {
         setIsDeleting(false);
      }
   };

   const assignTag = async () => {
      if (!selectedTagId) {
         return;
      }

      setIsAssigning(true);
      try {
         const response = await fetch(`/api/tags/${contact.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tagId: selectedTagId }),
         });

         if (!response.ok) {
            throw new Error(await getApiError(response));
         }

         toast.success('Tag assigned');
         setSelectedTagId('');
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not assign tag');
      } finally {
         setIsAssigning(false);
      }
   };

   const removeTag = async (tagId: string) => {
      setRemovingTagId(tagId);
      try {
         const response = await fetch(`/api/tags/${contact.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tagId }),
         });

         if (!response.ok) {
            throw new Error(await getApiError(response));
         }

         toast.success('Tag removed');
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not remove tag');
      } finally {
         setRemovingTagId(null);
      }
   };

   return (
      <div className='flex flex-col items-end gap-2'>
         <div className='flex items-center gap-2'>
            <Dialog
               open={open}
               onOpenChange={nextOpen => {
                  setOpen(nextOpen);
                  if (nextOpen) {
                     setForm(toFormState(contact));
                  }
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
                  <form className='space-y-4' onSubmit={updateContact}>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-first-name-${contact.id}`}>First name</Label>
                        <Input
                           id={`edit-first-name-${contact.id}`}
                           required
                           value={form.firstName}
                           onChange={event => setField('firstName', event.target.value)}
                        />
                     </div>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-last-name-${contact.id}`}>Last name</Label>
                        <Input
                           id={`edit-last-name-${contact.id}`}
                           required
                           value={form.lastName}
                           onChange={event => setField('lastName', event.target.value)}
                        />
                     </div>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-email-${contact.id}`}>Email</Label>
                        <Input
                           id={`edit-email-${contact.id}`}
                           type='email'
                           required
                           value={form.email}
                           onChange={event => setField('email', event.target.value)}
                        />
                     </div>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-phone-${contact.id}`}>Phone</Label>
                        <Input
                           id={`edit-phone-${contact.id}`}
                           value={form.phone}
                           onChange={event => setField('phone', event.target.value)}
                        />
                     </div>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-company-${contact.id}`}>Company</Label>
                        <Input
                           id={`edit-company-${contact.id}`}
                           value={form.company}
                           onChange={event => setField('company', event.target.value)}
                        />
                     </div>
                     <div className='grid gap-2'>
                        <Label htmlFor={`edit-address-${contact.id}`}>Address</Label>
                        <Input
                           id={`edit-address-${contact.id}`}
                           value={form.address}
                           onChange={event => setField('address', event.target.value)}
                        />
                     </div>
                     <DialogFooter>
                        <Button type='submit' disabled={isSaving}>
                           {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                     </DialogFooter>
                  </form>
               </DialogContent>
            </Dialog>
            <Button size='sm' variant='destructive' onClick={deleteContact} disabled={isDeleting}>
               {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
         </div>

         <div className='flex items-center gap-2'>
            {hasAvailableTags ? (
               <>
                  <Select value={selectedTagId} onValueChange={setSelectedTagId}>
                     <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Assign tag' />
                     </SelectTrigger>
                     <SelectContent position='popper' align='end' sideOffset={4}>
                        {availableTags.map(tag => (
                           <SelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <Button size='sm' variant='secondary' onClick={assignTag} disabled={!selectedTagId || isAssigning}>
                     {isAssigning ? 'Assigning...' : 'Assign'}
                  </Button>
               </>
            ) : (
               <span className='text-muted-foreground text-xs'>No available tags</span>
            )}
         </div>

         <div className='flex flex-wrap justify-end gap-1'>
            {contact.tags.map(tag => (
               <Badge key={tag.id} variant='outline' className='gap-1'>
                  {tag.name}
                  <Button
                     size='xs'
                     variant='ghost'
                     disabled={removingTagId === tag.id}
                     onClick={() => removeTag(tag.id)}
                  >
                     {removingTagId === tag.id ? '...' : 'x'}
                  </Button>
               </Badge>
            ))}
         </div>
      </div>
   );
}
