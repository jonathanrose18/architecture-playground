import { NextResponse, type NextRequest } from 'next/server';
import { tagService } from '@/services/tag.service';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/tags/[contactId]'>) {
   const { contactId } = await ctx.params;
   try {
      const { tagId } = await req.json();
      await tagService.assignTag(contactId, tagId);
      return new NextResponse(null, { status: 204 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/tags/[contactId]'>) {
   const { contactId } = await ctx.params;
   try {
      const { tagId } = await req.json();
      await tagService.removeTag(contactId, tagId);
      return new NextResponse(null, { status: 204 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}
