import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { contactService } from '@/services/contact.service';

const contactUpdateSchema = z.object({
   address: z.string().nullable().default(null),
   company: z.string().nullable().default(null),
   email: z.email().optional(),
   firstName: z.string().min(1).optional(),
   lastName: z.string().min(1).optional(),
   phone: z.string().nullable().default(null),
});

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
   const { id } = await ctx.params;

   try {
      const contact = await contactService.getById(id);
      return NextResponse.json(contact);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
   const { id } = await ctx.params;

   try {
      const body = await req.json();
      const result = contactUpdateSchema.safeParse(body);

      if (!result.success) {
         return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
      }

      const contact = await contactService.update(id, result.data);
      return NextResponse.json(contact);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
   const { id } = await ctx.params;

   try {
      await contactService.delete(id);
      return new NextResponse(null, { status: 204 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}
