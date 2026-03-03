'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Badge } from '@workspace/ui/components/ui/badge';
import { Button } from '@workspace/ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/ui/select';
import { toast } from '@workspace/ui/components/ui/sonner';

import { contactsApi } from '@/lib/api';
import type { ContactWithTags } from '@/types/contact';
import type { Tag } from '@/types/tag';

export function ContactTagManager({ contact, allTags }: { contact: ContactWithTags; allTags: Tag[] }) {
   const router = useRouter();

   const [localTags, setLocalTags] = useState<Tag[]>(contact.tags);
   const [isAssigning, setIsAssigning] = useState(false);
   const [removingTagId, setRemovingTagId] = useState<string | null>(null);
   const [selectedTagId, setSelectedTagId] = useState('');

   const assignedTagIds = new Set(localTags.map(t => t.id));
   const availableTags = allTags.filter(t => !assignedTagIds.has(t.id));

   const handleAssign = async () => {
      if (!selectedTagId) return;

      const tag = allTags.find(t => t.id === selectedTagId);

      if (!tag) return;

      setLocalTags(prev => [...prev, tag]);
      setSelectedTagId('');
      setIsAssigning(true);

      try {
         await contactsApi.assignTag(contact.id, tag.id);
         toast.success('Tag assigned');
         router.refresh();
      } catch (error) {
         setLocalTags(contact.tags);
         toast.error(error instanceof Error ? error.message : 'Could not assign tag');
      } finally {
         setIsAssigning(false);
      }
   };

   const handleRemove = async (tagId: string) => {
      setLocalTags(prev => prev.filter(t => t.id !== tagId));
      setRemovingTagId(tagId);

      try {
         await contactsApi.removeTag(contact.id, tagId);

         toast.success('Tag removed');
         router.refresh();
      } catch (error) {
         setLocalTags(contact.tags);
         toast.error(error instanceof Error ? error.message : 'Could not remove tag');
      } finally {
         setRemovingTagId(null);
      }
   };

   return (
      <div className='flex flex-col items-end gap-2'>
         <div className='flex items-center gap-2'>
            {availableTags.length > 0 ? (
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
                  <Button size='sm' variant='secondary' onClick={handleAssign} disabled={!selectedTagId || isAssigning}>
                     {isAssigning ? 'Assigning...' : 'Assign'}
                  </Button>
               </>
            ) : (
               <span className='text-muted-foreground text-xs'>No available tags</span>
            )}
         </div>

         <div className='flex flex-wrap justify-end gap-1'>
            {localTags.map(tag => (
               <Badge key={tag.id} variant='outline' className='gap-1'>
                  {tag.name}
                  <Button
                     size='xs'
                     variant='ghost'
                     disabled={removingTagId === tag.id}
                     onClick={() => handleRemove(tag.id)}
                  >
                     {removingTagId === tag.id ? '...' : 'x'}
                  </Button>
               </Badge>
            ))}
         </div>
      </div>
   );
}
