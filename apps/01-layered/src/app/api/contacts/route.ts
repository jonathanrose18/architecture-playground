import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { contactService } from '@/services/contact.service';

const contactCreateSchema = z.object({
   address: z.string().nullable().default(null),
   company: z.string().nullable().default(null),
   email: z.email(),
   firstName: z.string().min(1),
   lastName: z.string().min(1),
   phone: z.string().nullable().default(null),
});

export async function GET() {
   try {
      const contacts = await contactService.getAll();
      return NextResponse.json(contacts);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();
      const result = contactCreateSchema.safeParse(body);

      if (!result.success) {
         return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
      }

      const contact = await contactService.create(result.data);
      return NextResponse.json(contact, { status: 201 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}
