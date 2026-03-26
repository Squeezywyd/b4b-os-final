import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

const EMPTY = {
  stats: { totalLeads:0, totalCustomers:0, totalProjects:0, wonLeads:0, activeProjects:0, liveProjects:0, mrr:0, totalRevenue:0 },
  pipeline: [], recentLeads: [], recentProjects: [], weeklyLeads: [],
};

export async function GET() {
  try {
    const [
      { count: totalLeads },
      { count: totalCustomers },
      { count: totalProjects },
      { count: wonLeads },
      { count: activeProjects },
      { count: liveProjects },
      { data: mrrData },
      { data: revenueData },
      { data: pipeline },
      { data: recentLeads },
      { data: recentProjectsRaw },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'gewonnen'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).not('status', 'in', '("live","nicht_gestartet")'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'live'),
      supabase.from('customers').select('monthly_fee'),
      supabase.from('customers').select('setup_fee'),
      supabase.from('leads').select('status'),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('projects').select('*, customers(company_name)').order('created_at', { ascending: false }).limit(5),
    ]);

    const mrr = (mrrData || []).reduce((a: number, c: any) => a + (c.monthly_fee || 0), 0);
    const totalRevenue = (revenueData || []).reduce((a: number, c: any) => a + (c.setup_fee || 0), 0);

    // Build pipeline counts
    const pipelineMap: Record<string, number> = {};
    (pipeline || []).forEach((l: any) => { pipelineMap[l.status] = (pipelineMap[l.status] || 0) + 1; });
    const pipelineArr = Object.entries(pipelineMap).map(([status, count]) => ({ status, count }));

    const recentProjects = (recentProjectsRaw || []).map((p: any) => ({
      ...p, customerName: p.customers?.company_name, customers: undefined,
    }));

    return NextResponse.json({
      stats: {
        totalLeads: totalLeads || 0, totalCustomers: totalCustomers || 0,
        totalProjects: totalProjects || 0, wonLeads: wonLeads || 0,
        activeProjects: activeProjects || 0, liveProjects: liveProjects || 0,
        mrr, totalRevenue,
      },
      pipeline: pipelineArr,
      recentLeads: recentLeads || [],
      recentProjects,
      weeklyLeads: [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(EMPTY);
  }
}
