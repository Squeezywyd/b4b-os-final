'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const SOPS = [
  {
    id: 'lead_intake', icon: '◎', title: 'Lead Intake', color: '#6c63ff',
    purpose: 'Neuen Lead schnell und konsistent in das CRM aufnehmen',
    trigger: 'Ein neues Business wurde identifiziert (Google Maps, local.ch, Instagram, Yelp)',
    inputs: ['Firmenname', 'Kontaktdaten (Telefon/E-Mail/Instagram)', 'Website-Status (keine / veraltet / gut)', 'Stadt & Branche'],
    steps: [
      { n:1, text:'Business aufrufen und Website-Status bewerten' },
      { n:2, text:'Kontaktdaten sammeln (Telefon, E-Mail, Instagram)' },
      { n:3, text:'Neuen Eintrag in CRM erstellen (Firmenname, Branche, Stadt, Source)' },
      { n:4, text:'Status auf "Nicht kontaktiert" lassen' },
      { n:5, text:'Notizen bei Bedarf kurz halten (Besonderheiten)' },
    ],
    quality: ['Firmenname korrekt eingetragen', 'Mindestens eine Kontaktmöglichkeit vorhanden', 'Website-Status gesetzt'],
    owner: 'Beide Gründer',
  },
  {
    id: 'outreach', icon: '◷', title: 'Outreach', color: '#3b82f6',
    purpose: 'Leads systematisch kontaktieren und Gespräche buchen',
    trigger: 'Lead hat Status "Nicht kontaktiert"',
    inputs: ['Lead-Eintrag aus CRM', 'Outreach-Vorlage (passend zur Situation)', 'Personalisierte Details'],
    steps: [
      { n:1, text:'Passende Vorlage auswählen (Email / Instagram / Cold Call)' },
      { n:2, text:'Vorlage personalisieren (Firmenname, Branche, persönliche Bemerkung)' },
      { n:3, text:'Nachricht senden / Anruf tätigen' },
      { n:4, text:'Status auf "Kontaktiert" setzen + Datum notieren' },
      { n:5, text:'Follow-up nach 3–5 Tagen wenn keine Antwort' },
    ],
    quality: ['Personalisierung eingebaut', 'Status aktualisiert', 'Letzter Kontakt-Datum gesetzt'],
    owner: 'Beide Gründer',
  },
  {
    id: 'sales_call', icon: '◈', title: 'Sales Call', color: '#f97316',
    purpose: 'Den Lead vom Kunden überzeugen und Deal abschliessen',
    trigger: 'Lead hat "Call gebucht" Status, Termin steht',
    inputs: ['Lead-Infos', 'Beispiel-Website oder Mockup', 'Preisstruktur'],
    steps: [
      { n:1, text:'Lead-Info nochmals durchlesen (Branche, Website-Status, Notizen)' },
      { n:2, text:'Problem benennen: Was fehlt ohne Website / was kostet schlechte Website?' },
      { n:3, text:'Lösung zeigen: Beispiel oder Mockup präsentieren' },
      { n:4, text:'Angebot machen (passender Plan: Starter / Business / Subscription)' },
      { n:5, text:'Einwände behandeln, Termin für nächsten Schritt setzen' },
      { n:6, text:'Nach Call: Status + Notizen aktualisieren' },
    ],
    quality: ['Klar kommuniziert was der Unterschied ist', 'Preis genannt', 'Nächster Schritt vereinbart'],
    owner: 'Beide Gründer',
  },
  {
    id: 'website_produktion', icon: '◫', title: 'Website Produktion', color: '#22c55e',
    purpose: 'Website effizient und qualitativ hochwertig erstellen',
    trigger: 'Neues Projekt wurde angelegt, Kunde hat bezahlt',
    inputs: ['Kundeninformationen (Logo, Bilder, Texte)', 'Preise und Öffnungszeiten', 'Dienstleistungen'],
    steps: [
      { n:1, text:'Kundeninformationen vollständig sammeln (Logo, Bilder, Services, Preise, Adresse, Öffnungszeiten)' },
      { n:2, text:'Website mit AI-Tools erstellen (Cursor / Claude / Lovable)' },
      { n:3, text:'Design und Texte branchenspezifisch anpassen' },
      { n:4, text:'Reviews, Vorher/Nachher, FAQs, CTAs einbauen' },
      { n:5, text:'Mobile-First prüfen, Ladezeit optimieren' },
      { n:6, text:'Auf Vercel / Netlify deployen' },
      { n:7, text:'Domain verbinden, DNS setzen, SSL prüfen' },
      { n:8, text:'Definition of Done Checkliste abhaken' },
    ],
    quality: ['Mobile-First ✓', 'Ladezeit < 3 Sek ✓', 'Kontakt funktioniert ✓', 'Basis-SEO (Title, Meta, H1) ✓', 'SSL aktiv ✓'],
    owner: 'Beide Gründer',
  },
  {
    id: 'upsell_automation', icon: '◌', title: 'Upsell Automation', color: '#a855f7',
    purpose: 'Bestehenden Kunden Automationen als Upsell anbieten',
    trigger: 'Website ist live, Kunde ist zufrieden',
    inputs: ['Kundenprofil', 'Bestehende Prozesse des Kunden', 'n8n oder ähnliche Tools'],
    steps: [
      { n:1, text:'Bedarf analysieren: Welche Prozesse sind repetitiv?' },
      { n:2, text:'Automations-Typ vorschlagen (Lead / Booking / Review / Social Media)' },
      { n:3, text:'Angebot erstellen und präsentieren' },
      { n:4, text:'Bei Zusage: n8n Automation aufsetzen' },
      { n:5, text:'Testen und live schalten' },
      { n:6, text:'Kunden einweisen, Automation aktivieren' },
    ],
    quality: ['Automation läuft stabil', 'Kunden eingewiesen', 'Monatliche Gebühr aktualisiert'],
    owner: 'Beide Gründer',
  },
];

export default function SOPsPage() {
  const [active, setActive] = useState(SOPS[0].id);
  const sop = SOPS.find(s => s.id === active)!;

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ marginBottom:'1.75rem' }}>
          <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">SOPs & Wissen</span></h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Standard Operating Procedures – wiederverwendbare Prozesse</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'1rem' }}>
          {/* SOP nav */}
          <div className="card" style={{ padding:'0.75rem', height:'fit-content' }}>
            {SOPS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                style={{ width:'100%', textAlign:'left', background: active === s.id ? 'var(--bg-3)' : 'none', border: active === s.id ? `1px solid ${s.color}33` : '1px solid transparent', borderRadius:8, padding:'0.6rem 0.75rem', cursor:'pointer', marginBottom:'0.25rem', transition:'all 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, fontFamily:'Syne, sans-serif', color: active === s.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* SOP Detail */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card" style={{ padding:'1.5rem', borderTop:`3px solid ${sop.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${sop.color}20`, border:`1px solid ${sop.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:sop.color }}>{sop.icon}</div>
                <div>
                  <h2 style={{ fontSize:'1.2rem' }}>{sop.title} SOP</h2>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Owner: {sop.owner}</p>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
                <div style={{ background:'var(--bg-3)', borderRadius:10, padding:'1rem', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.5rem' }}>🎯 Zweck</div>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{sop.purpose}</p>
                </div>
                <div style={{ background:'var(--bg-3)', borderRadius:10, padding:'1rem', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.5rem' }}>⚡ Trigger</div>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{sop.trigger}</p>
                </div>
              </div>

              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.75rem' }}>📋 Inputs</div>
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  {sop.inputs.map(i => (
                    <span key={i} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:6, padding:'0.2rem 0.6rem', fontSize:'0.78rem', color:'var(--text-secondary)' }}>{i}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.75rem' }}>🔢 Schritte</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {sop.steps.map(step => (
                    <div key={step.n} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', padding:'0.75rem', background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8 }}>
                      <div style={{ width:24, height:24, borderRadius:6, background:`${sop.color}20`, border:`1px solid ${sop.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:800, color:sop.color, fontFamily:'Syne, sans-serif', flexShrink:0 }}>{step.n}</div>
                      <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', fontFamily:'Syne, sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.75rem' }}>✅ Quality Check</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
                  {sop.quality.map(q => (
                    <div key={q} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <div style={{ width:16, height:16, borderRadius:4, background:`${sop.color}20`, border:`1px solid ${sop.color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ color:sop.color, fontSize:'0.6rem' }}>✓</span>
                      </div>
                      <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
