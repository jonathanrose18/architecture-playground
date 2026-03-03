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

async function getApiError(response: Response) {
   try {
      const data = (await response.json()) as { error?: string };
      return data.error ?? 'Request failed';
   } catch {
      return 'Request failed';
   }
}

export function CreateTagDialog() {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [name, setName] = useState('');

   const submit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSaving(true);
      try {
         const response = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim() }),
         });

         if (!response.ok) {
            throw new Error(await getApiError(response));
         }

         toast.success('Tag created');
         setName('');
         setOpen(false);
         router.refresh();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not create tag');
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant='outline'>Create tag</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Create tag</DialogTitle>
               <DialogDescription>Create a new tag for assigning to contacts.</DialogDescription>
            </DialogHeader>
            <form className='space-y-4' onSubmit={submit}>
               <div className='grid gap-2'>
                  <Label htmlFor='create-tag-name'>Name</Label>
                  <Input
                     id='create-tag-name'
                     required
                     value={name}
                     onChange={event => setName(event.target.value)}
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
