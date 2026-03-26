'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import B4BLogo from './B4BLogo';

const adminNav = [
  { href: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/leads', icon: '◎', label: 'CRM & Leads' },
  { href: '/customers', icon: '◈', label: 'Kunden' },
  { href: '/projects', icon: '◫', label: 'Projekte' },
  { href: '/outreach', icon: '◷', label: 'Outreach' },
  { href: '/kpis', icon: '◈', label: 'Kennzahlen' },
  { href: '/sops', icon: '◧', label: 'SOPs & Wissen' },
];

const outreachNav = [
  { href: '/leads', icon: '◎', label: 'CRM & Leads' },
  { href: '/outreach', icon: '◷', label: 'Outreach Vorlagen' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (session?.user as any)?.role as string | undefined;
  const isOutreach = role === 'outreach';
  const nav = isOutreach ? outreachNav : adminNav;

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Menü öffnen"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay${mobileOpen ? ' open' : ''}`}
        onClick={close}
      />

      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <B4BLogo variant="sidebar" />
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Brick4Brick</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {isOutreach ? 'Outreach' : 'Business OS'}
              </div>
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
              onClick={close}
            >
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Admin-only sections */}
          {!isOutreach && (
            <>
              <div className="section-title" style={{ marginTop: '1.5rem' }}>Ressourcen</div>
              <a href="https://brick4brick.ch" target="_blank" rel="noopener" className="nav-item" onClick={close}>
                <span style={{ fontSize: '1rem' }}>◌</span>
                <span>Website</span>
              </a>
              <Link href="/blueprint" className={`nav-item ${pathname === '/blueprint' ? 'active' : ''}`} onClick={close}>
                <span style={{ fontSize: '1rem' }}>◉</span>
                <span>Blueprint</span>
              </Link>
              <Link href="/launchplan" className={`nav-item ${pathname === '/launchplan' ? 'active' : ''}`} onClick={close}>
                <span style={{ fontSize: '1rem' }}>◬</span>
                <span>30-Tage Plan</span>
              </Link>

              <div className="section-title" style={{ marginTop: '1.5rem' }}>Team</div>
              <Link href="/admin/users" className={`nav-item ${pathname === '/admin/users' ? 'active' : ''}`} onClick={close}>
                <span style={{ fontSize: '1rem' }}>◫</span>
                <span>Teammitglieder</span>
              </Link>
            </>
          )}
        </nav>

        {/* User */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderRadius: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: isOutreach
                ? 'linear-gradient(135deg, #22c55e, #3b82f6)'
                : 'linear-gradient(135deg, var(--accent), #a855f7)',
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
                {isOutreach ? 'Outreach' : session?.user?.email}
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Abmelden"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0, padding: '0.2rem' }}
            >⇥</button>
          </div>
        </div>
      </aside>
    </>
  );
}
