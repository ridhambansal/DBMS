import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const auth = request.headers.get('authorization') || '';
  const resp = await fetch(`${API}/cafeteria-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    return NextResponse.json({ success: false, ...error }, { status: resp.status });
  }
  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}