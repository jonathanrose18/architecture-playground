import { NextResponse, type NextRequest } from 'next/server';

import { contactService } from '@/services/contact.service';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
  const { id } = await ctx.params;
  try {
    const contact = await contactService.getById(id);
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
  const { id } = await ctx.params;
  try {
    const data = await req.json();
    const contact = await contactService.update(id, data);
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/contacts/[id]'>) {
  const { id } = await ctx.params;
  try {
    const contact = await contactService.delete(id);
    return NextResponse.json(contact, { status: 2 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
