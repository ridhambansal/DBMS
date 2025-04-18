import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API = process.env.NEXT_PUBLIC_API_URL!

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  try {
    const resp = await fetch(`${API}/meetingroom-details`, {
      headers: { 'Authorization': auth },
    })
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}))
      return NextResponse.json({ success: false, ...error }, { status: resp.status })
    }

    // Map backend response to frontend Room interface
    const data = await resp.json()
    const rooms = Array.isArray(data)
      ? data.map((r: any) => ({
          room_id: r.roomId,
          room_name: r.room,
          floorId: r.floor.id,
          capacity: r.capacity,
        }))
      : []

    return NextResponse.json(rooms)
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch meeting rooms' }, { status: 500 })
  }
}