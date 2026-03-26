import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  const { name, email, password, setupKey } = await req.json();
  if (setupKey !== 'b4b-setup-2024') return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 });
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1);
  if (existing?.length) return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  const { error } = await supabase.from('users').insert({ name, email, password: hashed, role: 'admin' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
