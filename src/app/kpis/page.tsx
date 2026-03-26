'use client';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

function getWeekStr(d = new Date()) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime()-jan1.getTime())/86400000+jan1.getDay()+1)/7);
  return `${d.getFullYear()}-W${String(week).padStart(2,'0')}`;
}

// Supabase returns snake_case → map to camelCase for UI
function toCamel(k: any) {
  return { ...k, leadsCount: k.leads_count, callsCount: k.calls_count, dealsCount: k.deals_count };
}

export default function KPIsPage() {
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [dashStats, setDashStats] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [k, d] = await Promise.all([fetch('/api/kpis').then(r=>r.json()), fetch('/api/dashboard').then(r=>r.json())]);
    setKpis(k); setDashStats(d?.stats); setLoading(false);
  }, []);
  useEffect(()=>{ load(); },[load]);

  async function saveKPI(data: any) {
    setSaving(true);
    await fetch('/api/kpis', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    setSaving(false); setEditing(null); load();
  }

  const currentWeek = getWeekStr();
  const thisWeekKpi = kpis.find(k=>k.week===currentWeek);
  const totalMRR = dashStats?.mrr||0;

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">Kennzahlen & Umsatz</span></h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Aktuelle Woche: {currentWeek}</p>
          </div>
          <button className="btn-primary" onClick={()=>setEditing({ week:currentWeek, leadsCount:0, callsCount:0, dealsCount:0, revenue:0, mrr:totalMRR, ...( thisWeekKpi ? toCamel(thisWeekKpi) : {}) })}>
            {thisWeekKpi?'✎ Diese Woche bearbeiten':'+ Woche eintragen'}
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[{ label:'Leads gesamt', value:dashStats?.totalLeads||0, color:'var(--accent)', sub:'Alle Zeit' },{ label:'Kunden', value:dashStats?.totalCustomers||0, color:'#22c55e', sub:'Aktiv' },{ label:'MRR', value:`${totalMRR.toFixed(0)} CHF`, color:'#eab308', sub:'Monatlich' },{ label:'Setup-Umsatz', value:`${(dashStats?.totalRevenue||0).toFixed(0)} CHF`, color:'#f97316', sub:'Einmalig' }].map(s=>(
            <div key={s.label} className="stat-card" style={{'--accent':s.color} as any}>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Syne, sans-serif', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.5rem' }}>{s.label}</div>
              <div className="metric-huge" style={{ color:s.color, fontSize:'2rem' }}>{s.value}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow:'hidden', marginBottom:'1.5rem' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)' }}><h3 style={{ fontSize:'0.9rem' }}>Wöchentlicher KPI-Tracker</h3></div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Woche','Leads','Calls','Deals','Umsatz','MRR','Conv. Rate',''].map(h=>(
                  <th key={h} style={{ padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>Lädt…</td></tr>
              : kpis.length===0 ? <tr><td colSpan={8} style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>Noch keine KPIs eingetragen.</td></tr>
              : kpis.map(kpi=>{
                const c = toCamel(kpi);
                const convRate = c.callsCount>0?((c.dealsCount/c.callsCount)*100).toFixed(0):0;
                const isCurrent = kpi.week===currentWeek;
                return (
                  <tr key={kpi.id} className="table-row" style={{ background:isCurrent?'rgba(108,99,255,0.05)':undefined }}>
                    <td style={{ padding:'0.75rem 1rem' }}>
                      <span style={{ fontSize:'0.875rem', fontFamily:'Syne, sans-serif', fontWeight:isCurrent?700:400 }}>{kpi.week}</span>
                      {isCurrent && <span style={{ marginLeft:'0.4rem', fontSize:'0.65rem', color:'var(--accent-2)', background:'var(--accent-glow)', padding:'0.1rem 0.4rem', borderRadius:10, fontFamily:'Syne, sans-serif', fontWeight:600 }}>AKTUELL</span>}
                    </td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', fontWeight:600, color:'var(--accent-2)' }}>{c.leadsCount}</td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#3b82f6' }}>{c.callsCount}</td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#22c55e', fontWeight:600 }}>{c.dealsCount}</td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#eab308', fontWeight:600 }}>{kpi.revenue>0?`${kpi.revenue} CHF`:'—'}</td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#22c55e' }}>{kpi.mrr>0?`${kpi.mrr} CHF`:'—'}</td>
                    <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:Number(convRate)>=30?'#22c55e':'var(--text-secondary)' }}>{convRate}%</td>
                    <td style={{ padding:'0.75rem 1rem' }}><button onClick={()=>setEditing(c)} className="btn-secondary" style={{ padding:'0.2rem 0.5rem', fontSize:'0.72rem' }}>✎</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem' }}>📊 Definitionen</h3>
            {[['Lead','Ein Business, das in Leads eingetragen wurde'],['Call gebucht','Termin steht'],['Deal gewonnen','Kunde angelegt + Projekt gestartet'],['Conv. Rate','Deals ÷ Calls × 100']].map(([t,d])=>(
              <div key={t} style={{ marginBottom:'0.6rem' }}>
                <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'0.8rem', color:'var(--text-primary)' }}>{t}: </span>
                <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem' }}>🎯 Wochenziele</h3>
            {[['50','Neue Leads finden'],['30','Businesses kontaktieren'],['10','Sales Calls führen'],['3','Neue Kunden gewinnen']].map(([n,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                <div style={{ width:36, height:36, borderRadius:8, background:'var(--bg-3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'0.9rem', color:'var(--accent-2)', flexShrink:0 }}>{n}</div>
                <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      {editing && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div className="modal">
            <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontSize:'1.1rem' }}>KPIs – {editing.week}</h2>
              <button onClick={()=>setEditing(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
            </div>
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              {[['leadsCount','Leads diese Woche'],['callsCount','Calls geführt'],['dealsCount','Deals gewonnen'],['revenue','Umsatz (CHF)'],['mrr','MRR (CHF)']].map(([k,l])=>(
                <div key={k}><label>{l}</label><input type="number" value={editing[k]||0} onChange={e=>setEditing((ed:any)=>({...ed,[k]:Number(e.target.value)}))} min={0} /></div>
              ))}
              <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
                <button className="btn-secondary" onClick={()=>setEditing(null)}>Abbrechen</button>
                <button className="btn-primary" onClick={()=>saveKPI(editing)} disabled={saving}>{saving?'Speichert…':'Speichern'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
