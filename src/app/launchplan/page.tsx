'use client';
import Sidebar from '@/components/Sidebar';

const WEEKS = [
  { week:1, title:'Workspace Setup', goal:'Grundlage schaffen', tasks:['Business OS einrichten (dieses System)','Website Template erstellen','Preisstruktur festlegen','Outreach Vorlagen finalisieren','brick4brick.ch fertigstellen'] },
  { week:2, title:'100 Leads sammeln', goal:'Lead-Pipeline füllen', tasks:['50 Leads via Google Maps finden','30 Leads via local.ch finden','20 Leads via Instagram / Yelp finden','Alle in CRM eingetragen','Website-Status bewertet'] },
  { week:3, title:'100 Businesses kontaktieren', goal:'Outreach starten', tasks:['Email / DM / Cold Call an alle Leads','Status im CRM aktuell halten','Follow-ups nach 3–5 Tagen','Mindestens 10 positive Reaktionen','Calls buchen'] },
  { week:4, title:'3–5 Kunden gewinnen', goal:'Ersten Umsatz generieren', tasks:['Sales Calls führen','Angebote senden','Mindestens 3 Deals abschliessen','Erste Websites in Produktion','Referral-System aufsetzen'] },
];

export default function LaunchPlanPage() {
  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ marginBottom:'1.75rem' }}>
          <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">30-Tage Launch Plan</span></h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Von 0 auf erste Kunden in einem Monat</p>
        </div>

        <div className="card" style={{ padding:'1.25rem', marginBottom:'1.5rem', background:'rgba(108,99,255,0.05)', borderColor:'rgba(108,99,255,0.2)' }}>
          <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
            <strong style={{ color:'var(--accent-2)' }}>Fokus:</strong> Jeden Tag konsistent Leads + Outreach.
            Calls schnell terminieren. Website-Produktion standardisieren
            (Template verbessern statt jedes Mal neu anfangen).
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'1rem' }}>
          {WEEKS.map(w => {
            const colors = ['#6c63ff','#3b82f6','#f97316','#22c55e'];
            return (
              <div key={w.week} className="card" style={{ padding:'1.25rem', borderTop:`3px solid ${colors[w.week-1]}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${colors[w.week-1]}20`, border:`1px solid ${colors[w.week-1]}40`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'0.9rem', color:colors[w.week-1], flexShrink:0 }}>W{w.week}</div>
                  <div>
                    <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1rem' }}>{w.title}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Ziel: {w.goal}</div>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                  {w.tasks.map((t,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem' }}>
                      <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${colors[w.week-1]}40`, flexShrink:0, marginTop:2 }} />
                      <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
