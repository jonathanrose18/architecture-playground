import type { ContactWithTags } from '@/types/contact';

export type ContactFormState = {
   address: string;
   company: string;
   email: string;
   firstName: string;
   lastName: string;
   phone: string;
};

export const emptyContactForm: ContactFormState = {
   address: '',
   company: '',
   email: '',
   firstName: '',
   lastName: '',
   phone: '',
};

export function toContactFormState(contact: ContactWithTags): ContactFormState {
   return {
      address: contact.address ?? '',
      company: contact.company ?? '',
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone ?? '',
   };
}

export function asNullableString(value: string): string | null {
   const trimmed = value.trim();
   return trimmed.length > 0 ? trimmed : null;
}

export function formStateToPayload(form: ContactFormState) {
   return {
      address: asNullableString(form.address),
      company: asNullableString(form.company),
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: asNullableString(form.phone),
   };
}
