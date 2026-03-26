import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

const toDb = (d: any) => ({
  ...(d.companyName !== undefined && { company_name: d.companyName }),
  ...(d.contactName !== undefined && { contact_name: d.contactName }),
  ...(d.email !== undefined && { email: d.email }),
  ...(d.phone !== undefined && { phone: d.phone }),
  ...(d.websiteUrl !== undefined && { website_url: d.websiteUrl }),
  ...(d.websiteStatus !== undefined && { website_status: d.websiteStatus }),
  ...(d.automationStatus !== undefined && { automation_status: d.automationStatus }),
  ...(d.monthlyFee !== undefined && { monthly_fee: d.monthlyFee }),
  ...(d.setupFee !== undefined && { setup_fee: d.setupFee }),
  ...(d.plan !== undefined && { plan: d.plan }),
  ...(d.notes !== undefined && { notes: d.notes }),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from('customers').update(toDb(await req.json())).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await supabase.from('customers').delete().eq('id', id);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
