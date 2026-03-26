'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const STATUSES = ['nicht_kontaktiert','kontaktiert','interessiert','call_gebucht','angebot_gesendet','gewonnen','verloren'];
const STATUS_LABELS: Record<string,string> = { nicht_kontaktiert:'Nicht kontaktiert', kontaktiert:'Kontaktiert', interessiert:'Interessiert', call_gebucht:'Call gebucht', angebot_gesendet:'Angebot gesendet', gewonnen:'Gewonnen', verloren:'Verloren' };
const SOURCES: Record<string,string> = { google_maps:'Google Maps', local_ch:'local.ch', yelp:'Yelp', instagram:'Instagram', referral:'Empfehlung', other:'Sonstige' };
const WS_LABELS: Record<string,string> = { none:'Keine Website', bad:'Veraltet', ok:'Gut' };
const INDUSTRIES = ['Barbershop','Restaurant','Fitnessstudio','Zahnarzt','Immobilien','Handwerker','Coach','Autowerkstatt','Friseur','Sonstiges'];
const EMPTY = { companyName:'', contactName:'', email:'', phone:'', instagram:'', website:'', websiteStatus:'none', source:'google_maps', status:'nicht_kontaktiert', industry:'', city:'', notes:'' };

// Map Supabase snake_case → camelCase for UI
function toCamel(l: any) {
  return { ...l, companyName: l.company_name, contactName: l.contact_name, websiteStatus: l.website_status };
}

function LeadModal({ lead, onClose, onSave }: any) {
  const [form, setForm] = useState(lead ? toCamel(lead) : EMPTY);
  const [saving, setSaving] = useState(false);
  const isNew = !lead?.id;
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); await onSave({...form, id: lead?.id}); setSaving(false); }
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.1rem' }}>{isNew ? '+ Neuer Lead' : form.companyName}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding:'1.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ gridColumn:'1/-1' }}><label>Firmenname *</label><input value={form.companyName} onChange={e=>setForm((f:any)=>({...f,companyName:e.target.value}))} required placeholder="Barbershop Zürich" /></div>
            <div><label>Ansprechpartner</label><input value={form.contactName||''} onChange={e=>setForm((f:any)=>({...f,contactName:e.target.value}))} /></div>
            <div><label>Stadt</label><input value={form.city||''} onChange={e=>setForm((f:any)=>({...f,city:e.target.value}))} placeholder="Zürich" /></div>
            <div><label>E-Mail</label><input type="email" value={form.email||''} onChange={e=>setForm((f:any)=>({...f,email:e.target.value}))} /></div>
            <div><label>Telefon</label><input value={form.phone||''} onChange={e=>setForm((f:any)=>({...f,phone:e.target.value}))} /></div>
            <div><label>Instagram</label><input value={form.instagram||''} onChange={e=>setForm((f:any)=>({...f,instagram:e.target.value}))} placeholder="@firma" /></div>
            <div><label>Website</label><input value={form.website||''} onChange={e=>setForm((f:any)=>({...f,website:e.target.value}))} placeholder="https://..." /></div>
            <div><label>Website Status</label>
              <select value={form.websiteStatus} onChange={e=>setForm((f:any)=>({...f,websiteStatus:e.target.value}))}>
                {Object.entries(WS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label>Branche</label>
              <select value={form.industry||''} onChange={e=>setForm((f:any)=>({...f,industry:e.target.value}))}>
                <option value="">Branche wählen</option>
                {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div><label>Quelle</label>
              <select value={form.source} onChange={e=>setForm((f:any)=>({...f,source:e.target.value}))}>
                {Object.entries(SOURCES).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label>Status</label>
              <select value={form.status} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1' }}><label>Notizen</label><textarea value={form.notes||''} onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))} rows={3} placeholder="Einwände, nächste Schritte…" /></div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', justifyContent:'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Speichert…':isNew?'Lead erstellen':'Speichern'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeadsClient() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState<any>(null);
  const [view, setView] = useState<'table'|'kanban'>('table');
  const searchParams = useSearchParams();

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (search) params.set('search', search);
    const res = await fetch('/api/leads?' + params);
    setLeads(await res.json());
    setLoading(false);
  }, [filterStatus, search]);

  useEffect(()=>{ load(); },[load]);
  useEffect(()=>{ if(searchParams.get('action')==='new') setModal({}); },[searchParams]);

  async function saveLead(data: any) {
    if (data.id) await fetch(`/api/leads/${data.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    else await fetch('/api/leads', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    setModal(null); load();
  }
  async function deleteLead(id: string) {
    if (!confirm('Lead löschen?')) return;
    await fetch(`/api/leads/${id}`, { method:'DELETE' }); load();
  }
  async function updateStatus(id: string, status: string) {
    await fetch(`/api/leads/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status }) }); load();
  }

  const grouped: Record<string,any[]> = {};
  STATUSES.forEach(s => { grouped[s] = leads.filter(l => l.status === s); });

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">CRM & Leads</span></h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{leads.length} Leads insgesamt</p>
          </div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <button className="btn-secondary" onClick={()=>setView(v=>v==='table'?'kanban':'table')}>{view==='table'?'⊞ Kanban':'≡ Tabelle'}</button>
            <button className="btn-primary" onClick={()=>setModal({})}>+ Neuer Lead</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          <input style={{ maxWidth:240 }} placeholder="🔍  Suchen…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select style={{ width:'auto' }} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">Alle Status</option>
            {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>Lädt…</div>
        : view==='kanban' ? (
          <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingBottom:'1rem' }}>
            {STATUSES.map(status => (
              <div key={status} style={{ minWidth:220, flex:'0 0 220px' }}>
                <div style={{ padding:'0.6rem 0.75rem', borderRadius:'8px 8px 0 0', background:'var(--bg-3)', border:'1px solid var(--border)', borderBottom:'none', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'0.73rem', fontWeight:700, fontFamily:'Syne, sans-serif', color:'var(--text-secondary)' }}>{STATUS_LABELS[status]}</span>
                  <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', background:'var(--bg-4)', padding:'0.1rem 0.4rem', borderRadius:10 }}>{grouped[status].length}</span>
                </div>
                <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'0 0 8px 8px', minHeight:100, padding:'0.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {grouped[status].map(lead => (
                    <div key={lead.id} onClick={()=>setModal(lead)}
                      style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, padding:'0.75rem', cursor:'pointer' }}
                      onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--border-2)')}
                      onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                      <div style={{ fontSize:'0.82rem', fontWeight:600, fontFamily:'Syne, sans-serif', marginBottom:'0.3rem' }}>{lead.company_name}</div>
                      {lead.city && <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{lead.city}</div>}
                      {lead.industry && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{lead.industry}</div>}
                      <div style={{ marginTop:'0.5rem' }}><span className={`tag tag-${lead.website_status}`}>{WS_LABELS[lead.website_status]}</span></div>
                    </div>
                  ))}
                  <button onClick={()=>setModal({ status })}
                    style={{ background:'none', border:'1px dashed var(--border)', borderRadius:8, padding:'0.5rem', color:'var(--text-muted)', fontSize:'0.75rem', cursor:'pointer' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                    + Lead hinzufügen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Firma','Stadt','Branche','Website','Quelle','Status',''].map(h=>(
                    <th key={h} style={{ padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length===0 ? (
                  <tr><td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>
                    Keine Leads. <button className="btn-primary" onClick={()=>setModal({})} style={{ marginLeft:'0.5rem' }}>+ Ersten Lead erstellen</button>
                  </td></tr>
                ) : leads.map(lead=>(
                  <tr key={lead.id} className="table-row" style={{ cursor:'pointer' }} onClick={()=>setModal(lead)}>
                    <td style={{ padding:'0.75rem 1rem' }}>
                      <div style={{ fontWeight:600, fontSize:'0.875rem', fontFamily:'Syne, sans-serif' }}>{lead.company_name}</div>
                      {lead.contact_name && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{lead.contact_name}</div>}
                    </td>
                    <td style={{ padding:'0.75rem 1rem', color:'var(--text-secondary)', fontSize:'0.85rem' }}>{lead.city||'—'}</td>
                    <td style={{ padding:'0.75rem 1rem', color:'var(--text-secondary)', fontSize:'0.85rem' }}>{lead.industry||'—'}</td>
                    <td style={{ padding:'0.75rem 1rem' }}><span className={`tag tag-${lead.website_status}`}>{WS_LABELS[lead.website_status]}</span></td>
                    <td style={{ padding:'0.75rem 1rem', color:'var(--text-secondary)', fontSize:'0.82rem' }}>{SOURCES[lead.source]||lead.source}</td>
                    <td style={{ padding:'0.75rem 1rem' }}>
                      <select className={`badge status-${lead.status}`} value={lead.status}
                        onClick={e=>e.stopPropagation()} onChange={e=>{ e.stopPropagation(); updateStatus(lead.id, e.target.value); }}
                        style={{ border:'none', background:'transparent', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:'0.72rem' }}>
                        {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'0.75rem 1rem' }}>
                      <button onClick={e=>{ e.stopPropagation(); deleteLead(lead.id); }} className="btn-danger" style={{ padding:'0.2rem 0.5rem', fontSize:'0.72rem' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {modal !== null && (
        <LeadModal
          lead={modal.id ? modal : (modal.status ? {...EMPTY, status: modal.status} : null)}
          onClose={()=>setModal(null)} onSave={saveLead}
        />
      )}
    </div>
  );
}
