import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST() {
  // Setup is disabled once any users exist — new accounts are managed via the Teammitglieder tab.
  const { data: existing } = await supabase.from('users').select('id').limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Setup bereits abgeschlossen' }, { status: 410 });
  }

  // No users at all yet — this should only happen on a completely fresh deployment.
  // Return 410 to enforce using environment-level bootstrapping.
  return NextResponse.json({ error: 'Setup deaktiviert' }, { status: 410 });
}
