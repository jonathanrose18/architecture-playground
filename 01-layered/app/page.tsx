import { ContactsEmpty } from '@/components/contacts-empty';
import { ContactsTable } from '@/components/contacts-table';
import { contactService } from '@/services/contact.service';

export default async function Page() {
  const contacts = await contactService.getAll();

  if (!contacts || contacts.length < 1) {
    return <ContactsEmpty />;
  }

  return <ContactsTable contacts={contacts} />;
}
