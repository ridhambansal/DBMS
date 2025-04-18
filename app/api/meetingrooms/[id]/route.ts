import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  // grab ?amenity=… from the URL
  const amenity = request.nextUrl.searchParams.get('amenity') || ''

  // map UI amenity → NestJS endpoint
  let endpoint: string
  switch (amenity) {
    case 'Cafeteria':
      endpoint = 'cafeteria-booking'
      break
    case 'meetingRoom':
    case 'meetingRoom':
      endpoint = 'meetingroom-booking'
      break
    case 'Seating':
    case 'Seat':
      endpoint = 'seat-booking'
      break
    default:
      return NextResponse.json(
        { error: `Unknown amenity "${amenity}"` },
        { status: 400 }
      )
  }

  try {
    const auth = request.headers.get('authorization') ?? ''
    const resp = await fetch(`${BACKEND}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
    })

    // forward success or error from Nest
    const body = await resp.json().catch(() => ({}))
    return NextResponse.json(body, { status: resp.status })
  } catch (err: any) {
    console.error('Delete proxy error:', err)
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
