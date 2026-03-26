'use client';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

const STATUSES = ['nicht_gestartet','design','entwicklung','review','live'];
const STATUS_LABELS: Record<string,string> = { nicht_gestartet:'Nicht gestartet', design:'Design', entwicklung:'Entwicklung', review:'Review', live:'Live' };
const COLORS: Record<string,string> = { nicht_gestartet:'#555570', design:'#3b82f6', entwicklung:'#eab308', review:'#f97316', live:'#22c55e' };

function toCamel(p: any) {
  return { ...p, customerId: p.customer_id, customerName: p.customerName || p.customers?.company_name };
}

function ProjectModal({ project, customers, onClose, onSave }: any) {
  const [form, setForm] = useState(project ? toCamel(project) : { name:'', status:'nicht_gestartet', deadline:'', notes:'', customerId:'' });
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); await onSave({...form, id: project?.id}); setSaving(false); }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.1rem' }}>{project?.id ? project.name : '+ Neues Projekt'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div><label>Projektname *</label><input value={form.name} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))} required placeholder="Website Barbershop Zürich" /></div>
            <div><label>Kunde *</label>
              <select value={form.customerId||''} onChange={e=>setForm((f:any)=>({...f,customerId:e.target.value}))} required>
                <option value="">Kunde wählen</option>
                {customers.map((c:any)=><option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div><label>Status</label>
              <select value={form.status} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div><label>Deadline</label><input type="date" value={form.deadline||''} onChange={e=>setForm((f:any)=>({...f,deadline:e.target.value}))} /></div>
            <div><label>Notizen</label><textarea value={form.notes||''} onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))} rows={4} /></div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', justifyContent:'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Speichert…':project?.id?'Speichern':'Projekt erstellen'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, c] = await Promise.all([fetch('/api/projects').then(r=>r.json()), fetch('/api/customers').then(r=>r.json())]);
    setProjects(p); setCustomers(c); setLoading(false);
  }, []);
  useEffect(()=>{ load(); },[load]);

  async function saveProject(data: any) {
    if (data.id) await fetch(`/api/projects/${data.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    else await fetch('/api/projects', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    setModal(null); load();
  }
  async function deleteProject(id: string) {
    if (!confirm('Projekt löschen?')) return;
    await fetch(`/api/projects/${id}`, { method:'DELETE' }); load();
  }

  const grouped: Record<string,any[]> = {};
  STATUSES.forEach(s=>{ grouped[s]=projects.filter(p=>p.status===s); });

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">Projekte</span></h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{projects.filter(p=>p.status!=='live').length} aktiv · {projects.filter(p=>p.status==='live').length} live</p>
          </div>
          <button className="btn-primary" disabled={customers.length===0} onClick={()=>setModal({})}>+ Neues Projekt</button>
        </div>
        {customers.length===0 && !loading && (
          <div style={{ background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.2)', borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1.5rem', color:'#facc15', fontSize:'0.85rem' }}>
            ⚠ Noch keine Kunden vorhanden. Leg zuerst einen Kunden an.
          </div>
        )}
        <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingBottom:'1rem' }}>
          {STATUSES.map(status=>(
            <div key={status} style={{ minWidth:240, flex:'0 0 240px' }}>
              <div style={{ padding:'0.7rem 0.75rem', borderRadius:'8px 8px 0 0', background:'var(--bg-3)', border:'1px solid var(--border)', borderBottom:'none', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:COLORS[status] }} />
                  <span style={{ fontSize:'0.75rem', fontWeight:700, fontFamily:'Syne, sans-serif', color:'var(--text-secondary)' }}>{STATUS_LABELS[status]}</span>
                </div>
                <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', background:'var(--bg-4)', padding:'0.1rem 0.4rem', borderRadius:10 }}>{grouped[status].length}</span>
              </div>
              <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'0 0 8px 8px', minHeight:120, padding:'0.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {loading ? <div style={{ padding:'1rem', color:'var(--text-muted)', fontSize:'0.8rem', textAlign:'center' }}>Lädt…</div>
                : grouped[status].map(proj=>(
                  <div key={proj.id} onClick={()=>setModal(proj)}
                    style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, padding:'0.9rem', cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-2)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                    <div style={{ fontSize:'0.82rem', fontWeight:600, fontFamily:'Syne, sans-serif', marginBottom:'0.2rem' }}>{proj.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{proj.customerName}</div>
                    {proj.deadline && <div style={{ marginTop:'0.4rem', fontSize:'0.7rem', color:new Date(proj.deadline)<new Date()?'#f87171':'var(--text-muted)' }}>📅 {new Date(proj.deadline).toLocaleDateString('de-CH')}</div>}
                    <div style={{ display:'flex', gap:'3px', marginTop:'0.6rem' }}>
                      {STATUSES.map((s,i)=>(<div key={s} style={{ height:3, flex:1, borderRadius:2, background:STATUSES.indexOf(proj.status)>=i?COLORS[status]:'var(--border)' }} />))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>setModal({ status, customerId:'' })}
                  style={{ background:'none', border:'1px dashed var(--border)', borderRadius:8, padding:'0.5rem', color:'var(--text-muted)', fontSize:'0.75rem', cursor:'pointer' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                  + Projekt hinzufügen
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Checklist */}
        <div className="card" style={{ marginTop:'1.5rem', padding:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem', marginBottom:'1rem' }}>Website Produktions-Checklist</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'0.75rem' }}>
            {[{step:'1',title:'Info sammeln',items:['Logo','Bilder','Dienstleistungen','Preise','Kontaktdaten']},{step:'2',title:'AI Build',items:['Cursor/Claude/Lovable','Basis-Layout','Content einpflegen']},{step:'3',title:'Design & Text',items:['Branchenspezifisch','Reviews & FAQs','CTAs optimieren']},{step:'4',title:'Deploy',items:['Vercel / Netlify','Domain verbinden','SSL prüfen']},{step:'5',title:'Definition of Done',items:['Mobile-first','Ladezeit ok','Kontakt funktioniert','Basis-SEO']}].map(s=>(
              <div key={s.step} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:10, padding:'0.9rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.6rem' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), #a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800, color:'white', fontFamily:'Syne, sans-serif', flexShrink:0 }}>{s.step}</div>
                  <span style={{ fontSize:'0.78rem', fontWeight:700, fontFamily:'Syne, sans-serif' }}>{s.title}</span>
                </div>
                {s.items.map(item=>(<div key={item} style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.25rem' }}><div style={{ width:4, height:4, borderRadius:'50%', background:'var(--border-2)', flexShrink:0 }} /><span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{item}</span></div>))}
              </div>
            ))}
          </div>
        </div>
      </main>
      {modal!==null && <ProjectModal project={modal.id?modal:null} customers={customers} onClose={()=>setModal(null)} onSave={saveProject} />}
    </div>
  );
}
