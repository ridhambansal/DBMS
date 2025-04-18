import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy GET /api/notifications to your NestJS backend
 * Supports optional ?token=XYZ query to fetch only that user's notifications
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Build backend URL, including token path if provided
    const targetURL = token
      ? `${BACKEND_URL}/notifications/${encodeURIComponent(token)}`
      : `${BACKEND_URL}/notifications`

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization')

    const resp = await fetch(targetURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      // If using cookies, add credentials: 'include'
    })

    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (err: any) {
    console.error('Notification proxy error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}