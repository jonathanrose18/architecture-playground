import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { tagService } from '@/services/tag.service';

const tagCreateSchema = z.object({ name: z.string().min(1) });

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
      const body = await req.json();
      const result = tagCreateSchema.safeParse(body);

      if (!result.success) {
         return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
      }

      const tag = await tagService.create(result.data);
      return NextResponse.json(tag, { status: 201 });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error(error);

      return NextResponse.json({ error: message }, { status: 500 });
   }
}
