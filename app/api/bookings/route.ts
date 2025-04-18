import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  try {
    // Proxy to your Nest overall‐booking endpoint
    const resp = await fetch(`${API}/overall-booking`, {
      headers: { Authorization: auth },
    })
    const data = await resp.json()
    if (!resp.ok) {
      return NextResponse.json({ success: false, ...data }, { status: resp.status })
    }
    // Return the booking array straight through
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}