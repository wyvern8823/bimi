import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage.from('public').upload(path, buf, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });

  if (error) {
    // ローカルモック（Supabase未設定時）: 一時URLを返す
    const blob = new Blob([buf], { type: file.type || 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    return NextResponse.json({ url });
  }

  const { data: publicUrl } = supabase.storage.from('public').getPublicUrl(data.path);
  return NextResponse.json({ url: publicUrl.publicUrl });
}
