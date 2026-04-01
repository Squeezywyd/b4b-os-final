'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import B4BLogo from '@/components/B4BLogo';

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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <B4BLogo variant="full" />
          </div>
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
      </div>
    </div>
  );
}
