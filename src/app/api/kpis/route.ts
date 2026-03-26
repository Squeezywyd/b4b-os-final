import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase.from('kpis').select('*').order('week', { ascending: false }).limit(12);
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const { data, error } = await supabase.from('kpis').upsert({
      week: b.week, leads_count: b.leadsCount||0, calls_count: b.callsCount||0,
      deals_count: b.dealsCount||0, revenue: b.revenue||0, mrr: b.mrr||0,
    }, { onConflict: 'week' }).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
