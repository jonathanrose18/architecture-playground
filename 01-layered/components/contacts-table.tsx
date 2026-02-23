import { format } from 'date-fns';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contact } from '@/repositories/contact.repository';

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className='text-right'>Added at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map(contact => (
          <TableRow key={contact.id}>
            <TableCell className='font-medium'>
              {contact.firstName} {contact.lastName}
            </TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.address}</TableCell>
            <TableCell className='text-right'>{format(contact.createdAt, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
