import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/db';

function isAdmin(session: any) {
  return session?.user?.role === 'admin';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, E-Mail und Passwort sind erforderlich' }, { status: 400 });
  }
  if (!['admin', 'outreach'].includes(role)) {
    return NextResponse.json({ error: 'Ungültige Rolle' }, { status: 400 });
  }

  const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1);
  if (existing?.length) return NextResponse.json({ error: 'E-Mail bereits vergeben' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const { error } = await supabase.from('users').insert({ name, email, password: hashed, role });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();

  // Prevent self-deletion
  if (id === (session as any)?.user?.id) {
    return NextResponse.json({ error: 'Eigenes Konto kann nicht gelöscht werden' }, { status: 400 });
  }

  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
