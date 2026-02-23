import { ContactsPage } from "@/components/contacts-page";
import { contactService } from "@/services/contact.service";

export default async function Page() {
  const contacts = await contactService.getAll();

  return <ContactsPage contacts={contacts} />;
}
