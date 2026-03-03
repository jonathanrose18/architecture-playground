import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { contactService } from '@/services/contact.service';

const assignTagSchema = z.object({ tagId: z.string().min(1) });

export async function POST(req: NextRequest, ctx: RouteContext<'/api/contacts/[id]/tags'>) {
   const { id } = await ctx.params;

   try {
      const body = await req.json();
      const result = assignTagSchema.safeParse(body);

      if (!result.success) {
         return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
      }

      await contactService.assignTag(id, result.data.tagId);
      return new NextResponse(null, { status: 204 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}
