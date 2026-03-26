import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, customers(company_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const mapped = (data || []).map((p: any) => ({ ...p, customerName: p.customers?.company_name, customers: undefined }));
    return NextResponse.json(mapped);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const { data, error } = await supabase.from('projects').insert({
      name: b.name, status: b.status||'nicht_gestartet',
      deadline: b.deadline||null, notes: b.notes||null,
      customer_id: b.customerId, lead_id: b.leadId||null,
    }).select('*, customers(company_name)').single();
    if (error) throw error;
    return NextResponse.json({ ...data, customerName: (data as any).customers?.company_name }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
