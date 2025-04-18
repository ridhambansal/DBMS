import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const { event_name, description, date } = await request.json();

  const resp = await fetch(`${API}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_name, description, date }),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    return NextResponse.json({ success: false, ...error }, { status: resp.status });
  }

  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}