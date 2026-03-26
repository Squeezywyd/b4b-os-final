'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push('/dashboard');
    else setError('Ungültige E-Mail oder Passwort');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%)'
    }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--accent), #a855f7)', borderRadius: 14, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif', boxShadow: '0 0 40px rgba(108,99,255,0.3)' }}>B4</div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Brick4Brick OS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Business Operating System</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label>E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="dein@email.ch" required autoFocus />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label>Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
            {loading ? 'Wird eingeloggt…' : 'Anmelden'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Kein Konto? <a href="/setup" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>Setup durchführen →</a>
        </p>
      </div>
    </div>
  );
}
