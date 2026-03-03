import { NextResponse, type NextRequest } from 'next/server';

import { contactService } from '@/services/contact.service';

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
      const data = await req.json();
      const contact = await contactService.create(data);
      return NextResponse.json(contact, { status: 201 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}
