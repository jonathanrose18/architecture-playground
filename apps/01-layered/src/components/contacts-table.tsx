import type { ReactNode } from 'react';

import { Badge } from '@workspace/ui/components/ui/badge';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/ui/card';
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@workspace/ui/components/ui/table';

export type ContactTagOption = { id: string; name: string };

export type ContactsTableContact = {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   company: string;
   address: string;
   tags: ContactTagOption[];
};

type ContactsTableProps = {
   contacts: ContactsTableContact[];
   toolbar?: ReactNode;
   renderActions: (contact: ContactsTableContact) => ReactNode;
};

export function ContactsTable({ contacts, toolbar, renderActions }: ContactsTableProps) {
   return (
      <main className='mx-auto w-full max-w-7xl p-6'>
         <Card>
            <CardHeader>
               <CardTitle>Contacts</CardTitle>
               <CardDescription>Manage contacts and tag assignments in one place.</CardDescription>
               <CardAction>{toolbar}</CardAction>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableCaption>{contacts.length} contact(s)</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {contacts.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={6} className='text-muted-foreground py-8 text-center'>
                              No contacts yet.
                           </TableCell>
                        </TableRow>
                     ) : (
                        contacts.map(contact => (
                           <TableRow key={contact.id}>
                              <TableCell>{contact.firstName + ' ' + contact.lastName}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.phone || '-'}</TableCell>
                              <TableCell>{contact.company || '-'}</TableCell>
                              <TableCell>
                                 <div className='flex flex-wrap gap-1'>
                                    {contact.tags.length === 0 ? (
                                       <span className='text-muted-foreground text-xs'>No tags</span>
                                    ) : (
                                       contact.tags.map(tag => (
                                          <Badge key={tag.id} variant='secondary'>
                                             {tag.name}
                                          </Badge>
                                       ))
                                    )}
                                 </div>
                              </TableCell>
                              <TableCell className='text-right'>{renderActions(contact)}</TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </main>
   );
}
