import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    if (search) query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,city.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch { return NextResponse.json([], { status: 200 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('leads').insert({
      company_name: body.companyName, contact_name: body.contactName||null,
      email: body.email||null, phone: body.phone||null, instagram: body.instagram||null,
      website: body.website||null, website_status: body.websiteStatus||'none',
      source: body.source||'google_maps', status: body.status||'nicht_kontaktiert',
      industry: body.industry||null, city: body.city||null, notes: body.notes||null,
    }).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
