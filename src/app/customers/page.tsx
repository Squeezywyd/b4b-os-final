'use client';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

const PLAN_LABELS: Record<string,string> = { starter:'Starter', business:'Business', subscription:'Subscription' };
const WS_LABELS: Record<string,string> = { nicht_gestartet:'Nicht gestartet', in_arbeit:'In Arbeit', live:'Live' };
const AUTO_LABELS: Record<string,string> = { kein:'Kein', geplant:'Geplant', aktiv:'Aktiv' };
const EMPTY = { companyName:'', contactName:'', email:'', phone:'', websiteUrl:'', websiteStatus:'nicht_gestartet', automationStatus:'kein', monthlyFee:'', setupFee:'', plan:'starter', notes:'' };

function toCamel(c: any) {
  return { ...c, companyName: c.company_name, contactName: c.contact_name, websiteUrl: c.website_url, websiteStatus: c.website_status, automationStatus: c.automation_status, monthlyFee: c.monthly_fee, setupFee: c.setup_fee };
}

function CustomerModal({ customer, onClose, onSave }: any) {
  const [form, setForm] = useState(customer ? toCamel(customer) : EMPTY);
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); await onSave({...form, id: customer?.id}); setSaving(false); }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.1rem' }}>{customer?.id ? customer.company_name : '+ Neuer Kunde'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding:'1.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ gridColumn:'1/-1' }}><label>Firmenname *</label><input value={form.companyName} onChange={e=>setForm((f:any)=>({...f,companyName:e.target.value}))} required /></div>
            <div><label>Ansprechpartner</label><input value={form.contactName||''} onChange={e=>setForm((f:any)=>({...f,contactName:e.target.value}))} /></div>
            <div><label>E-Mail</label><input type="email" value={form.email||''} onChange={e=>setForm((f:any)=>({...f,email:e.target.value}))} /></div>
            <div><label>Telefon</label><input value={form.phone||''} onChange={e=>setForm((f:any)=>({...f,phone:e.target.value}))} /></div>
            <div><label>Website URL</label><input value={form.websiteUrl||''} onChange={e=>setForm((f:any)=>({...f,websiteUrl:e.target.value}))} placeholder="https://..." /></div>
            <div><label>Website Status</label>
              <select value={form.websiteStatus} onChange={e=>setForm((f:any)=>({...f,websiteStatus:e.target.value}))}>
                {Object.entries(WS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label>Automation Status</label>
              <select value={form.automationStatus} onChange={e=>setForm((f:any)=>({...f,automationStatus:e.target.value}))}>
                {Object.entries(AUTO_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label>Plan</label>
              <select value={form.plan} onChange={e=>setForm((f:any)=>({...f,plan:e.target.value}))}>
                {Object.entries(PLAN_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label>Setup-Gebühr (CHF)</label><input type="number" value={form.setupFee||''} onChange={e=>setForm((f:any)=>({...f,setupFee:e.target.value}))} placeholder="1200" /></div>
            <div><label>Monatliche Gebühr (CHF)</label><input type="number" value={form.monthlyFee||''} onChange={e=>setForm((f:any)=>({...f,monthlyFee:e.target.value}))} placeholder="150" /></div>
            <div style={{ gridColumn:'1/-1' }}><label>Notizen</label><textarea value={form.notes||''} onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))} rows={3} /></div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', justifyContent:'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Speichert…':customer?.id?'Speichern':'Kunde erstellen'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/customers');
    setCustomers(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { setLoading(true); void load(); }, [load]);

  async function saveCustomer(data: any) {
    if (data.id) await fetch(`/api/customers/${data.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    else await fetch('/api/customers', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    setModal(null); load();
  }
  async function deleteCustomer(id: string) {
    if (!confirm('Kunden löschen?')) return;
    await fetch(`/api/customers/${id}`, { method:'DELETE' }); load();
  }

  const mrr = customers.reduce((a,c)=>a+(c.monthly_fee||0),0);
  const totalSetup = customers.reduce((a,c)=>a+(c.setup_fee||0),0);

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">Kunden</span></h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{customers.length} aktive Kunden</p>
          </div>
          <button className="btn-primary" onClick={()=>setModal({})}>+ Neuer Kunde</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[{ label:'MRR', value:`${mrr.toFixed(0)} CHF`, color:'#22c55e' },{ label:'Setup-Umsatz', value:`${totalSetup.toFixed(0)} CHF`, color:'var(--accent)' },{ label:'Kunden gesamt', value:customers.length, color:'#f97316' }].map(s=>(
            <div key={s.label} className="stat-card" style={{'--accent':s.color} as any}>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Syne, sans-serif', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.5rem' }}>{s.label}</div>
              <div className="metric-huge" style={{ color:s.color, fontSize:'2rem' }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Firma','Kontakt','Plan','Website','Automation','MRR','Setup',''].map(h=>(
                  <th key={h} style={{ padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)' }}>Lädt…</td></tr>
              : customers.length===0 ? <tr><td colSpan={8} style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>Noch keine Kunden. Gewinne deinen ersten Lead! 🎯</td></tr>
              : customers.map(c=>(
                <tr key={c.id} className="table-row" style={{ cursor:'pointer' }} onClick={()=>setModal(c)}>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <div style={{ fontWeight:600, fontSize:'0.875rem', fontFamily:'Syne, sans-serif' }}>{c.company_name}</div>
                    {c.website_url && <a href={c.website_url} target="_blank" onClick={e=>e.stopPropagation()} style={{ fontSize:'0.72rem', color:'var(--accent-2)', textDecoration:'none' }}>↗ Website</a>}
                  </td>
                  <td style={{ padding:'0.75rem 1rem', fontSize:'0.85rem', color:'var(--text-secondary)' }}>{c.contact_name||'—'}</td>
                  <td style={{ padding:'0.75rem 1rem' }}><span className="badge" style={{ background:'rgba(108,99,255,0.15)', color:'var(--accent-2)', border:'1px solid rgba(108,99,255,0.2)' }}>{PLAN_LABELS[c.plan]}</span></td>
                  <td style={{ padding:'0.75rem 1rem' }}><span className={`badge status-${c.website_status}`}>{WS_LABELS[c.website_status]}</span></td>
                  <td style={{ padding:'0.75rem 1rem' }}><span className={`badge status-${c.automation_status}`}>{AUTO_LABELS[c.automation_status]}</span></td>
                  <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#22c55e', fontWeight:600, fontFamily:'Syne, sans-serif' }}>{c.monthly_fee?`${c.monthly_fee} CHF`:'—'}</td>
                  <td style={{ padding:'0.75rem 1rem', fontSize:'0.875rem', color:'var(--text-secondary)' }}>{c.setup_fee?`${c.setup_fee} CHF`:'—'}</td>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <button onClick={e=>{ e.stopPropagation(); deleteCustomer(c.id); }} className="btn-danger" style={{ padding:'0.2rem 0.5rem', fontSize:'0.72rem' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {modal!==null && <CustomerModal customer={modal.id?modal:null} onClose={()=>setModal(null)} onSave={saveCustomer} />}
    </div>
  );
}
