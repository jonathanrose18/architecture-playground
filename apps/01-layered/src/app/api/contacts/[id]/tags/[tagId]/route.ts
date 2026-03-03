import { NextResponse, type NextRequest } from 'next/server';

import { contactService } from '@/services/contact.service';

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/contacts/[id]/tags/[tagId]'>) {
   const { id, tagId } = await ctx.params;

   try {
      await contactService.removeTag(id, tagId);
      return new NextResponse(null, { status: 204 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}
