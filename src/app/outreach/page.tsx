'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const TEMPLATES = {
  email_no_website: [
    {
      name: 'Direkt & Professionell',
      subject: 'Moderne Website für [Firmenname] – kostenlose Beispielseite',
      body: `Hallo [Name],

wir sind ein kleines Team, das lokalen Unternehmen dabei hilft, modern und professionell online aufzutreten.

Uns ist aufgefallen, dass [Firmenname] aktuell noch keine eigene Website hat. Das bedeutet leider, dass viele potenzielle Kunden, die online nach [Branche] in [Stadt] suchen, Sie schlicht nicht finden können – und stattdessen zur Konkurrenz gehen.

Wir würden Ihnen gerne zeigen, wie eine moderne Website für Ihr Unternehmen aussehen könnte – schnell, unkompliziert und ohne Risiko.

Hätten Sie diese Woche kurz Zeit für ein 10–15-minütiges Gespräch?

Freundliche Grüsse
[Name 1] & [Name 2]
brick4brick.ch | hallo@brick4brick.ch`
    },
    {
      name: 'Persönlich & Neugierig machend',
      subject: 'Wir haben etwas für [Firmenname] vorbereitet',
      body: `Hallo [Name],

wir sind auf [Firmenname] aufmerksam geworden – [kurze persönliche Bemerkung].

Dabei ist uns aufgefallen, dass Sie noch keine eigene Website haben. Das ist schade, denn gerade heute suchen Kunden zuerst online – und wer dort nicht sichtbar ist, verliert Aufträge.

Wir haben bereits eine erste Idee skizziert, wie Ihre Website aussehen könnte, und würden sie Ihnen gerne unverbindlich zeigen.

Wann passt ein kurzes Gespräch von 10–15 Minuten?

Freundliche Grüsse
[Name 1] & [Name 2]
brick4brick.ch`
    },
    {
      name: 'Kurz & Direkt (Massenversand)',
      subject: 'Kurze Frage zu [Firmenname]',
      body: `Hallo [Name],

planen Sie aktuell, eine Website für [Firmenname] zu erstellen?

Wir helfen lokalen Unternehmen dabei, schnell und unkompliziert online sichtbar zu werden – und haben schon eine erste Beispielseite für Sie skizziert.

Darf ich sie kurz zeigen?

Freundliche Grüsse
[Name 1] & [Name 2]
brick4brick.ch`
    },
  ],
  email_bad_website: [
    {
      name: 'Direkt & Professionell',
      subject: 'Ihre Website – wir haben eine Idee für [Firmenname]',
      body: `Hallo [Name],

wir sind ein Team, das lokale Unternehmen dabei unterstützt, ihren Online-Auftritt modern und wirkungsvoll zu gestalten.

Wir haben uns die aktuelle Website von [Firmenname] angesehen und sind überzeugt, dass Sie damit Potenzial verschenken. Eine veraltete Website hinterlässt bei Besuchern oft einen falschen Eindruck – und kostet Sie täglich mögliche Kunden.

Wir würden Ihnen gerne zeigen, wie ein moderner Webauftritt für Ihr Unternehmen aussehen könnte – mit klarer Struktur, besserem Google-Ranking und einem professionellen ersten Eindruck.

Hätten Sie diese Woche kurz Zeit für ein 10–15-minütiges Gespräch?

Freundliche Grüsse
[Name 1] & [Name 2]
brick4brick.ch`
    },
    {
      name: 'Persönlich & Wertschätzend',
      subject: 'Eine Idee für den Webauftritt von [Firmenname]',
      body: `Hallo [Name],

wir sind auf [Firmenname] aufmerksam geworden – [kurze persönliche Bemerkung, z.B. «grossartige Bewertungen auf Google»].

Beim Besuch Ihrer Website haben wir gesehen, dass diese noch nicht ganz dem Standard entspricht, den Ihr Unternehmen verdient. In einer Zeit, in der der erste Eindruck online entscheidet, lohnt sich eine moderne Präsenz enorm.

Wir haben bereits eine erste Idee entwickelt, wie ein frischer Auftritt für [Firmenname] aussehen könnte – und würden ihn Ihnen gerne unverbindlich vorstellen.

Wann hätten Sie kurz Zeit?

Freundliche Grüsse
[Name 1] & [Name 2]
brick4brick.ch`
    },
  ],
  instagram: [
    {
      name: 'Keine Website',
      body: `Hallo [Name], uns ist aufgefallen, dass [Firmenname] noch keine eigene Website hat. Wir helfen lokalen Unternehmen, modern online sichtbar zu werden. Dürfen wir kurz zeigen, wie das für euch aussehen könnte? 🚀`
    },
    {
      name: 'Veraltete Website',
      body: `Hallo [Name], wir haben uns die Website von [Firmenname] angesehen und haben eine Idee, wie man den Auftritt deutlich moderner und wirkungsvoller gestalten könnte. Dürfen wir kurz zeigen, was wir uns vorstellen? 💡`
    },
  ],
  cold_call: [
    {
      name: 'Version A – Keine Website',
      body: `Guten Tag, mein Name ist [Name], wir sind ein kleines Team, das lokalen Unternehmen dabei hilft, online besser gefunden zu werden.

Uns ist aufgefallen, dass [Firmenname] aktuell noch keine eigene Website hat.

Darf ich kurz fragen, ob Sie das aktuell planen?

──────────
FOLLOW-UPS:
• Wenn JA: Super – darf ich 2–3 kurze Fragen stellen, damit wir einschätzen können, was sinnvoll wäre?
• Wenn NEIN: Verstehe – darf ich kurz erklären, warum viele lokale Unternehmen gerade jetzt davon profitieren?
• ABSCHLUSS: Wäre ein kurzer 10–15-Minuten-Call diese Woche möglich?`
    },
    {
      name: 'Version B – Veraltete Website',
      body: `Guten Tag, mein Name ist [Name], wir sind ein kleines Team, das lokalen Unternehmen hilft, ihren Online-Auftritt zu modernisieren.

Wir haben uns die Website von [Firmenname] kurz angesehen und glauben, dass da noch deutlich mehr Potenzial drin steckt.

Hätten Sie kurz 2 Minuten?

──────────
FOLLOW-UPS:
• Wenn JA: Wir haben bereits eine erste Idee, wie ein moderner Auftritt für Ihr Unternehmen aussehen könnte – dürfen wir das kurz zeigen?
• ABSCHLUSS: Wäre ein kurzer Call diese Woche möglich?`
    },
  ],
};

const SECTIONS = [
  { key:'email_no_website', icon:'📧', label:'Email – Keine Website', color:'#3b82f6' },
  { key:'email_bad_website', icon:'📧', label:'Email – Veraltete Website', color:'#f97316' },
  { key:'instagram', icon:'📱', label:'Instagram DM', color:'#a855f7' },
  { key:'cold_call', icon:'📞', label:'Cold Call Script', color:'#22c55e' },
];

export default function OutreachPage() {
  const [activeSection, setActiveSection] = useState('email_no_website');
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState('');
  const [customizations, setCustomizations] = useState<Record<string,string>>({ firmenname:'', name:'', branche:'', stadt:'' });

  const templates = (TEMPLATES as any)[activeSection] || [];
  const tpl = templates[activeIdx] || templates[0];

  function applyCustomizations(text: string) {
    return text
      .replace(/\[Firmenname\]/g, customizations.firmenname || '[Firmenname]')
      .replace(/\[Name\]/g, customizations.name || '[Name]')
      .replace(/\[Branche\]/g, customizations.branche || '[Branche]')
      .replace(/\[Stadt\]/g, customizations.stadt || '[Stadt]');
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ marginBottom:'1.75rem' }}>
          <h1 style={{ fontSize:'1.8rem', marginBottom:'0.2rem' }}><span className="glow-text">Outreach Vorlagen</span></h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Vorlagen für E-Mail, Instagram DM und Cold Calls</p>
        </div>

        {/* Personalization */}
        <div className="card" style={{ padding:'1.25rem', marginBottom:'1.25rem' }}>
          <h3 style={{ fontSize:'0.85rem', marginBottom:'0.75rem', color:'var(--text-secondary)' }}>🎯 Variablen personalisieren</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.75rem' }}>
            {[['firmenname','Firmenname','Barbershop Zürich'],['name','Kontaktname','Herr Müller'],['branche','Branche','Barbershop'],['stadt','Stadt','Zürich']].map(([k,l,ph]) => (
              <div key={k}>
                <label>{l}</label>
                <input value={customizations[k]} onChange={e => setCustomizations(c => ({...c,[k]:e.target.value}))} placeholder={ph} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1rem' }}>
          {/* Sidebar nav */}
          <div className="card" style={{ padding:'0.75rem', height:'fit-content' }}>
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => { setActiveSection(s.key); setActiveIdx(0); }}
                style={{ width:'100%', textAlign:'left', background: activeSection === s.key ? 'var(--bg-3)' : 'none', border: activeSection === s.key ? '1px solid var(--border)' : '1px solid transparent', borderRadius:8, padding:'0.6rem 0.75rem', cursor:'pointer', marginBottom:'0.25rem', transition:'all 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, fontFamily:'Syne, sans-serif', color: activeSection === s.key ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Templates */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {/* Tab selector */}
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {templates.map((t: any, i: number) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className={activeIdx === i ? 'btn-primary' : 'btn-secondary'} style={{ fontSize:'0.8rem' }}>
                  {t.name}
                </button>
              ))}
            </div>

            {tpl && (
              <div className="card" style={{ padding:'1.5rem' }}>
                {tpl.subject && (
                  <div style={{ marginBottom:'1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                      <label style={{ marginBottom:0 }}>Betreff</label>
                      <button onClick={() => copyText(applyCustomizations(tpl.subject), 'subj')} className="btn-secondary" style={{ padding:'0.2rem 0.6rem', fontSize:'0.72rem' }}>
                        {copied === 'subj' ? '✓ Kopiert' : '⎘ Kopieren'}
                      </button>
                    </div>
                    <div style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, padding:'0.75rem', fontSize:'0.875rem', fontWeight:500, color:'var(--text-primary)' }}>
                      {applyCustomizations(tpl.subject)}
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <label style={{ marginBottom:0 }}>{tpl.subject ? 'Nachricht' : 'Script'}</label>
                    <button onClick={() => copyText(applyCustomizations(tpl.body), 'body')} className="btn-secondary" style={{ padding:'0.2rem 0.6rem', fontSize:'0.72rem' }}>
                      {copied === 'body' ? '✓ Kopiert!' : '⎘ Kopieren'}
                    </button>
                  </div>
                  <div style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, padding:'1rem', fontSize:'0.875rem', lineHeight:1.7, color:'var(--text-secondary)', whiteSpace:'pre-wrap', fontFamily:'DM Sans, sans-serif' }}>
                    {applyCustomizations(tpl.body)}
                  </div>
                </div>
              </div>
            )}

            {/* Quick tips */}
            <div className="card" style={{ padding:'1.25rem' }}>
              <h3 style={{ fontSize:'0.85rem', marginBottom:'0.75rem' }}>💡 Quick Tips</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {[
                  'Erst das Vertrauen aufbauen, dann verkaufen',
                  'Personalisierung erhöht die Response-Rate deutlich',
                  'Follow-up nach 3–5 Tagen, wenn keine Antwort',
                  'Ziel: Ein Gespräch – nicht sofort verkaufen',
                ].map((tip, i) => (
                  <div key={i} style={{ display:'flex', gap:'0.5rem', padding:'0.6rem', background:'var(--bg-3)', borderRadius:8, border:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--accent-2)', flexShrink:0 }}>→</span>
                    <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
