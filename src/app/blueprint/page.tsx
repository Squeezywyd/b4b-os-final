'use client';
import Sidebar from '@/components/Sidebar';

export default function BlueprintPage() {
  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ marginBottom:'1.75rem' }}>
          <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">Business Blueprint</span></h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Das vollständige Geschäftsmodell auf einen Blick</p>
        </div>

        {/* Flow */}
        <div className="card" style={{ padding:'1.5rem', marginBottom:'1rem' }}>
          <h3 style={{ fontSize:'0.9rem', marginBottom:'1rem', color:'var(--text-muted)' }}>BUSINESS FLOW</h3>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            {['Lead finden','→','Kontaktieren','→','Sales Call','→','Angebot','→','Kunde','→','Produktion','→','Upsell (Automation)'].map((s,i) => (
              s === '→' ? <span key={i} style={{ color:'var(--text-muted)', fontSize:'1.2rem' }}>→</span> :
              <div key={i} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, padding:'0.5rem 0.9rem', fontSize:'0.85rem', fontFamily:'Syne, sans-serif', fontWeight:600 }}>{s}</div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem', color:'#22c55e' }}>🏢 Geschäftsmodell</h3>
            <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
              Wir erstellen moderne Websites für lokale Unternehmen, die noch keine oder eine veraltete Website besitzen.
              Zusätzlich bieten wir Automationen (z. B. mit n8n) an, um Geschäftsprozesse zu automatisieren und Zeit zu sparen.
            </p>
          </div>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem', color:'#3b82f6' }}>🎯 Zielkunden</h3>
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {['Friseure','Barbershops','Restaurants','Fitnessstudios','Zahnärzte','Handwerker','Immobilienmakler','Coaches'].map(t => (
                <span key={t} style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:6, padding:'0.2rem 0.6rem', fontSize:'0.78rem', color:'#60a5fa' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem', color:'#eab308' }}>💰 Preisstruktur</h3>
            {[['Website Setup','800 – 2\'000 CHF','einmalig'],['Monatliche Betreuung','50 – 150 CHF','/Monat'],['Subscription','150 – 300 CHF','/Monat (all-in)']].map(([n,p,t]) => (
              <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize:'0.85rem', fontWeight:600, fontFamily:'Syne, sans-serif' }}>{n}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{t}</div>
                </div>
                <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#eab308', fontFamily:'Syne, sans-serif' }}>{p}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem', color:'#f97316' }}>🔍 Lead Generation Quellen</h3>
            {[['Google Maps','Lokale Businesses suchen, Website & Bewertungen prüfen'],['local.ch','Schweiz-spezifisch, viele Einträge ohne Website'],['Yelp','Viele Reviews = aktives Business'],['Instagram','Profile ohne Website-Link oder schlechte Linkstruktur']].map(([s,d]) => (
              <div key={s} style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'flex-start' }}>
                <span style={{ color:'#fb923c', flexShrink:0, marginTop:2 }}>◆</span>
                <div>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, fontFamily:'Syne, sans-serif' }}>{s}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem', marginBottom:'0.75rem', color:'#a855f7' }}>🤖 Upsell: Automation Services</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.75rem' }}>
            {[
              { title:'Lead Automation', items:['Website Formular → Email → CRM','Slack/WhatsApp Benachrichtigung'] },
              { title:'Booking Automation', items:['Website → Google Kalender','Auto-Bestätigung + Reminder'] },
              { title:'Review Automation', items:['Nach Termin → Bewertung anfragen','Filter für zufriedene Kunden'] },
              { title:'Social Media', items:['Content automatisch posten','Blog → IG/LinkedIn'] },
            ].map(a => (
              <div key={a.title} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:10, padding:'0.9rem' }}>
                <div style={{ fontSize:'0.8rem', fontWeight:700, fontFamily:'Syne, sans-serif', marginBottom:'0.5rem', color:'var(--text-primary)' }}>{a.title}</div>
                {a.items.map(i => <div key={i} style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.25rem' }}>→ {i}</div>)}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
