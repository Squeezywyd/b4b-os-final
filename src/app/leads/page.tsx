import { Suspense } from 'react';
import LeadsClient from './LeadsClient';

export default function LeadsPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Lädt…</div>}>
      <LeadsClient />
    </Suspense>
  );
}
