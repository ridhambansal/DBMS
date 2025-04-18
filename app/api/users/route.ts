import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API = process.env.NEXT_PUBLIC_API_URL!

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  try {
    const resp = await fetch(`${API}/user`, {
      headers: { Authorization: auth },
    })
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}))
      return NextResponse.json({ success: false, ...error }, { status: resp.status })
    }
    const data = await resp.json()
    // Map backend users to { id: string, name: string }
    const users = Array.isArray(data)
      ? data.map((u: any) => ({
          id: u.id.toString(),
          name: `${u.first_name} ${u.last_name}`,
        }))
      : []
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 })
  }
}