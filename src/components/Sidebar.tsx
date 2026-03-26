'use client';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const nav = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/leads', icon: '◎', label: 'CRM & Leads' },
  { href: '/customers', icon: '◈', label: 'Kunden' },
  { href: '/projects', icon: '◫', label: 'Projekte' },
  { href: '/outreach', icon: '◷', label: 'Outreach' },
  { href: '/kpis', icon: '◈', label: 'Kennzahlen' },
  { href: '/sops', icon: '◧', label: 'SOPs & Wissen' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '1.5rem 1rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, var(--accent), #a855f7)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif'
          }}>B4</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Brick4Brick</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Business OS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflow: 'auto' }}>
        <div className="section-title">Navigation</div>
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1rem', opacity: 0.8 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="section-title" style={{ marginTop: '1.5rem' }}>Ressourcen</div>
        <a href="https://brick4brick.ch" target="_blank" rel="noopener" className="nav-item">
          <span style={{ fontSize: '1rem' }}>◌</span>
          <span>Website</span>
        </a>
        <Link href="/blueprint" className={`nav-item ${pathname === '/blueprint' ? 'active' : ''}`}>
          <span style={{ fontSize: '1rem' }}>◉</span>
          <span>Blueprint</span>
        </Link>
        <Link href="/launchplan" className={`nav-item ${pathname === '/launchplan' ? 'active' : ''}`}>
          <span style={{ fontSize: '1rem' }}>◬</span>
          <span>30-Tage Plan</span>
        </Link>
      </nav>

      {/* User */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderRadius: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif',
            flexShrink: 0
          }}>
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.email}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Abmelden"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0, padding: '0.2rem' }}
          >⇥</button>
        </div>
      </div>
    </aside>
  );
}
