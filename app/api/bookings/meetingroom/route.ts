// app/api/bookings/meetingroom/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL  // e.g. "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    // Grab the JSON payload from the client
    const payload = await request.json()

    // Forward to NestJS
    const resp = await fetch(`${BACKEND}/meetingroom-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(payload),
    })

    // Proxy back the response
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An error occurred while booking the meeting room',
      },
      { status: 500 },
    )
  }
}
