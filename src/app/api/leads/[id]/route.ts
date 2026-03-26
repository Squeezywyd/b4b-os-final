import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

const toDb = (d: any) => ({
  ...(d.companyName !== undefined && { company_name: d.companyName }),
  ...(d.contactName !== undefined && { contact_name: d.contactName }),
  ...(d.email !== undefined && { email: d.email }),
  ...(d.phone !== undefined && { phone: d.phone }),
  ...(d.instagram !== undefined && { instagram: d.instagram }),
  ...(d.website !== undefined && { website: d.website }),
  ...(d.websiteStatus !== undefined && { website_status: d.websiteStatus }),
  ...(d.source !== undefined && { source: d.source }),
  ...(d.status !== undefined && { status: d.status }),
  ...(d.industry !== undefined && { industry: d.industry }),
  ...(d.city !== undefined && { city: d.city }),
  ...(d.notes !== undefined && { notes: d.notes }),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data, error } = await supabase.from('leads').update(toDb(body)).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
