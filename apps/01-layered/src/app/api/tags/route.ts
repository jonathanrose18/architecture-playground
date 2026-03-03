import { NextResponse, type NextRequest } from 'next/server';

import { tagService } from '@/services/tag.service';

export async function GET() {
   try {
      const tags = await tagService.getAll();
      return NextResponse.json(tags);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   try {
      const data = await req.json();
      const tag = await tagService.create(data);
      return NextResponse.json(tag, { status: 201 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);
      return NextResponse.json({ error: message }, { status: 500 });
   }
}
