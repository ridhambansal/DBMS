// File: app/api/floor-details/floors/capacity/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization')

    // Fetch real floors from NestJS
    const resp = await fetch(`${BACKEND_URL}/floor-details/floors/capacity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    const data = await resp.json()
    // Expect data as array of numbers or objects with floor_number
    let floors: number[] = []
    if (Array.isArray(data)) {
      // If array of numbers
      if (typeof data[0] === 'number') {
        floors = data
      } else {
        // If array of objects
        floors = data.map((f: any) => f.floor_number ?? f.floorNumber).filter(Boolean)
      }
    }

    return NextResponse.json(floors, { status: resp.status })
  } catch (err: any) {
    console.error('Error fetching floors:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch floors' },
      { status: 500 }
    )
  }
}
