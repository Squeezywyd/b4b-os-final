import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const { data, error } = await supabase.from('customers').insert({
      company_name: b.companyName, contact_name: b.contactName||null,
      email: b.email||null, phone: b.phone||null, website_url: b.websiteUrl||null,
      website_status: b.websiteStatus||'nicht_gestartet', automation_status: b.automationStatus||'kein',
      monthly_fee: b.monthlyFee||null, setup_fee: b.setupFee||null,
      plan: b.plan||'starter', notes: b.notes||null, lead_id: b.leadId||null,
    }).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
