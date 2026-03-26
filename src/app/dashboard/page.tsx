'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

const STATUS_LABELS: Record<string,string> = {
  nicht_kontaktiert:'Nicht kontaktiert', kontaktiert:'Kontaktiert', interessiert:'Interessiert',
  call_gebucht:'Call gebucht', angebot_gesendet:'Angebot gesendet', gewonnen:'Gewonnen', verloren:'Verloren',
  nicht_gestartet:'Nicht gestartet', design:'Design', entwicklung:'Entwicklung', review:'Review', live:'Live',
};
const DAILY = [
  { icon:'◎', label:'Lead Generation', desc:'10–20 Businesses finden', color:'#6c63ff' },
  { icon:'◷', label:'Outreach', desc:'20 Businesses kontaktieren', color:'#3b82f6' },
  { icon:'◈', label:'Sales', desc:'Sales Calls führen', color:'#f97316' },
  { icon:'◫', label:'Production', desc:'Websites bauen', color:'#22c55e' },
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const pipeline = data?.pipeline || [];
  const recentLeads = data?.recentLeads || [];
  const recentProjects = data?.recentProjects || [];

  const pipelineMap: Record<string,number> = {};
  pipeline.forEach((p: any) => { pipelineMap[p.status] = p.count; });
  const pipelineSteps = ['nicht_kontaktiert','kontaktiert','interessiert','call_gebucht','angebot_gesendet','gewonnen'];
  const totalPipeline = pipelineSteps.reduce((a, k) => a + (pipelineMap[k] || 0), 0);

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'0.25rem' }}><span className="glow-text">Dashboard</span></h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>
              {new Date().toLocaleDateString('de-CH', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>
          <Link href="/leads?action=new" className="btn-primary"><span>+</span> Neuer Lead</Link>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Leads gesamt', value:stats.totalLeads||0, sub:`${stats.wonLeads||0} gewonnen`, color:'var(--accent)', icon:'◎' },
            { label:'Kunden', value:stats.totalCustomers||0, sub:'Aktive Kunden', color:'#22c55e', icon:'◈' },
            { label:'Projekte', value:stats.totalProjects||0, sub:`${stats.liveProjects||0} live`, color:'#f97316', icon:'◫' },
            { label:'MRR', value:`${(stats.mrr||0).toFixed(0)} CHF`, sub:`${(stats.totalRevenue||0).toFixed(0)} CHF Setup`, color:'#eab308', icon:'◷' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{'--accent': s.color} as any}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                <span style={{ color:s.color, fontSize:'1.2rem' }}>{s.icon}</span>
                <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Syne, sans-serif', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>{s.label}</span>
              </div>
              <div className="metric-huge" style={{ color:s.color }}>{loading ? '–' : s.value}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Pipeline + Daily */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1rem', marginBottom:'1.5rem' }}>
          <div className="card" style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
              <h3 style={{ fontSize:'0.95rem' }}>Sales Pipeline</h3>
              <Link href="/leads" style={{ fontSize:'0.75rem', color:'var(--accent-2)', textDecoration:'none' }}>Alle ansehen →</Link>
            </div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {pipelineSteps.map((step, i) => {
                const count = pipelineMap[step] || 0;
                const colors = ['#555570','#3b82f6','#eab308','#f97316','#a855f7','#22c55e'];
                const pct = totalPipeline > 0 ? (count / totalPipeline * 100).toFixed(0) : 0;
                return (
                  <div key={step} style={{ flex:'1', minWidth:80, background:'var(--bg-3)', borderRadius:10, padding:'0.75rem', border:'1px solid var(--border)' }}>
                    <div style={{ color:colors[i], fontSize:'1.5rem', fontWeight:800, fontFamily:'Syne, sans-serif', lineHeight:1 }}>{count}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:'0.3rem', fontFamily:'Syne, sans-serif', fontWeight:500 }}>{STATUS_LABELS[step]}</div>
                    <div style={{ marginTop:'0.5rem', height:2, background:'var(--border)', borderRadius:1 }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:colors[i], borderRadius:1, transition:'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.95rem', marginBottom:'1rem' }}>Daily Workflow</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {DAILY.map((d,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.75rem', background:'var(--bg-3)', borderRadius:8, border:'1px solid var(--border)' }}>
                  <span style={{ color:d.color, fontSize:'1rem', flexShrink:0 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize:'0.82rem', fontWeight:600, fontFamily:'Syne, sans-serif', color:'var(--text-primary)' }}>{d.label}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent tables */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div className="card">
            <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:'0.9rem' }}>Neueste Leads</h3>
              <Link href="/leads" style={{ fontSize:'0.75rem', color:'var(--accent-2)', textDecoration:'none' }}>Alle →</Link>
            </div>
            {loading ? <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>Lädt…</div>
            : recentLeads.length === 0 ? <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>Noch keine Leads. <Link href="/leads?action=new" style={{ color:'var(--accent-2)' }}>Ersten Lead →</Link></div>
            : recentLeads.map((lead: any) => (
              <div key={lead.id} className="table-row" style={{ padding:'0.75rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--text-primary)', fontFamily:'Syne, sans-serif' }}>{lead.company_name}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{lead.city||'—'} · {lead.industry||'—'}</div>
                </div>
                <span className={`badge status-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:'0.9rem' }}>Aktive Projekte</h3>
              <Link href="/projects" style={{ fontSize:'0.75rem', color:'var(--accent-2)', textDecoration:'none' }}>Alle →</Link>
            </div>
            {loading ? <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>Lädt…</div>
            : recentProjects.length === 0 ? <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>Noch keine Projekte. <Link href="/projects" style={{ color:'var(--accent-2)' }}>Anlegen →</Link></div>
            : recentProjects.map((proj: any) => (
              <div key={proj.id} className="table-row" style={{ padding:'0.75rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--text-primary)', fontFamily:'Syne, sans-serif' }}>{proj.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{proj.customerName}</div>
                </div>
                <span className={`badge status-${proj.status}`}>{STATUS_LABELS[proj.status]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop:'1rem', padding:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem', marginBottom:'1rem' }}>Weekly Goals</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'0.75rem' }}>
            {['50 neue Leads finden','30 Businesses kontaktieren','10 Sales Calls führen','3 neue Kunden gewinnen','1 Website Template verbessern'].map((g,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', padding:'0.75rem', background:'var(--bg-3)', borderRadius:8, border:'1px solid var(--border)' }}>
                <div style={{ width:16, height:16, borderRadius:4, border:'2px solid var(--border-2)', flexShrink:0, marginTop:1 }} />
                <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)', lineHeight:1.4 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
