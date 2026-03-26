'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', setupKey: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (data.success) router.push('/login');
    else setError(data.error || 'Fehler beim Setup');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', backgroundImage: 'radial-gradient(ellipse at 30% 60%, rgba(108,99,255,0.07) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--accent), #a855f7)', borderRadius: 14, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif' }}>B4</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Ersteinrichtung</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admin-Konto erstellen</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
          {[['name','Name','Max Muster'],['email','E-Mail','max@brick4brick.ch'],['password','Passwort','••••••••'],['setupKey','Setup-Key','b4b-setup-2024']].map(([k, lbl, ph]) => (
            <div key={k} style={{ marginBottom: '1rem' }}>
              <label>{lbl}</label>
              <input type={k === 'password' ? 'password' : 'text'} value={(form as any)[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} placeholder={ph} required />
            </div>
          ))}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.5rem' }}>
            {loading ? 'Wird eingerichtet…' : 'Account erstellen'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Setup-Key: <code style={{ color: 'var(--accent-2)' }}>b4b-setup-2024</code>
        </p>
      </div>
    </div>
  );
}
