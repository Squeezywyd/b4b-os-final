'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  outreach: 'Outreach',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'rgba(108,99,255,0.15)',
  outreach: 'rgba(34,197,94,0.15)',
};

const ROLE_TEXT: Record<string, string> = {
  admin: '#8b85ff',
  outreach: '#4ade80',
};

const EMPTY = { name: '', email: '', password: '', role: 'outreach' };

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const currentUserId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (role && role !== 'admin') router.replace('/leads');
  }, [role, router]);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setForm(EMPTY);
      setShowForm(false);
      loadUsers();
    } else {
      setFormError(data.error || 'Fehler beim Erstellen');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${name} wirklich entfernen?`)) return;
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              <span className="glow-text">Teammitglieder</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Zugänge verwalten — Outreach-Mitarbeiter haben nur Zugriff auf Leads und Vorlagen
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => { setShowForm(true); setFormError(''); }}
          >
            + Mitglied hinzufügen
          </button>
        </div>

        {/* Create form modal */}
        {showForm && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div className="modal">
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.1rem' }}>Neues Teammitglied</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>
              <form onSubmit={handleCreate} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label>Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Max Muster"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label>E-Mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="max@brick4brick.ch"
                      required
                    />
                  </div>
                  <div>
                    <label>Passwort</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label>Rolle</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="outreach">Outreach — nur Leads &amp; Vorlagen</option>
                      <option value="admin">Admin — voller Zugriff</option>
                    </select>
                    {form.role === 'outreach' && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                        Outreach-Mitarbeiter sehen keine Umsatzdaten, Kunden, Projekte oder KPIs.
                      </p>
                    )}
                  </div>
                </div>
                {formError && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem', marginTop: '1rem', color: '#f87171', fontSize: '0.85rem' }}>
                    {formError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Abbrechen</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Erstellt…' : 'Konto erstellen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Lädt…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'E-Mail', 'Rolle', 'Erstellt', ''].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="table-row">
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: user.role === 'outreach'
                            ? 'linear-gradient(135deg, #22c55e, #3b82f6)'
                            : 'linear-gradient(135deg, var(--accent), #a855f7)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif',
                          flexShrink: 0,
                        }}>
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                          {user.name}
                          {user.id === currentUserId && (
                            <span style={{ marginLeft: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>(du)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{ background: ROLE_COLORS[user.role] || 'var(--bg-3)', color: ROLE_TEXT[user.role] || 'var(--text-secondary)', border: `1px solid ${ROLE_TEXT[user.role] || 'var(--border)'}22` }}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('de-CH') : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {user.id !== currentUserId && (
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          Entfernen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Access summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#8b85ff' }}>◈ Admin</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['Dashboard + KPIs + Umsatzdaten', 'CRM & Leads', 'Kunden & Projekte', 'Outreach Vorlagen', 'SOPs & Wissen', 'Blueprint & 30-Tage Plan', 'Teammitglieder verwalten'].map(item => (
                <li key={item} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#4ade80' }}>◷ Outreach</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: 'CRM & Leads (lesen, bearbeiten)', allowed: true },
                { label: 'Outreach Vorlagen', allowed: true },
                { label: 'Dashboard & KPIs', allowed: false },
                { label: 'Umsatz / MRR', allowed: false },
                { label: 'Kunden & Projekte', allowed: false },
                { label: 'SOPs & Blueprint', allowed: false },
                { label: 'Teammitglieder', allowed: false },
              ].map(item => (
                <li key={item.label} style={{ fontSize: '0.8rem', color: item.allowed ? 'var(--text-secondary)' : 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: item.allowed ? '#4ade80' : '#ef4444' }}>{item.allowed ? '✓' : '✕'}</span> {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
