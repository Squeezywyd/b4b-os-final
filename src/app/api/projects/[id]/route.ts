import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

const toDb = (d: any) => ({
  ...(d.name !== undefined && { name: d.name }),
  ...(d.status !== undefined && { status: d.status }),
  ...(d.deadline !== undefined && { deadline: d.deadline||null }),
  ...(d.notes !== undefined && { notes: d.notes }),
  ...(d.customerId !== undefined && { customer_id: d.customerId }),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from('projects').update(toDb(await req.json())).eq('id', id).select('*, customers(company_name)').single();
    if (error) throw error;
    return NextResponse.json({ ...data, customerName: (data as any).customers?.company_name });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await supabase.from('projects').delete().eq('id', id);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
