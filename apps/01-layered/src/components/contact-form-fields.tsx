import { Input } from '@workspace/ui/components/ui/input';
import { Label } from '@workspace/ui/components/ui/label';

import type { ContactFormState } from '@/lib/form-utils';

export function ContactFormFields({
   idPrefix,
   form,
   onChange,
}: {
   idPrefix: string;
   form: ContactFormState;
   onChange: (field: keyof ContactFormState, value: string) => void;
}) {
   return (
      <>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-first-name`}>First name</Label>
            <Input
               id={`${idPrefix}-first-name`}
               required
               value={form.firstName}
               onChange={e => onChange('firstName', e.target.value)}
            />
         </div>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-last-name`}>Last name</Label>
            <Input
               id={`${idPrefix}-last-name`}
               required
               value={form.lastName}
               onChange={e => onChange('lastName', e.target.value)}
            />
         </div>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-email`}>Email</Label>
            <Input
               id={`${idPrefix}-email`}
               type='email'
               required
               value={form.email}
               onChange={e => onChange('email', e.target.value)}
            />
         </div>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-phone`}>Phone</Label>
            <Input id={`${idPrefix}-phone`} value={form.phone} onChange={e => onChange('phone', e.target.value)} />
         </div>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-company`}>Company</Label>
            <Input
               id={`${idPrefix}-company`}
               value={form.company}
               onChange={e => onChange('company', e.target.value)}
            />
         </div>
         <div className='grid gap-2'>
            <Label htmlFor={`${idPrefix}-address`}>Address</Label>
            <Input
               id={`${idPrefix}-address`}
               value={form.address}
               onChange={e => onChange('address', e.target.value)}
            />
         </div>
      </>
   );
}
