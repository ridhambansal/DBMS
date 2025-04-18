import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, role, password } = body

    // In a real app, you would validate and store user data in a database
    // For this mock, we'll just return a success response

    return NextResponse.json({
      success: true,
      user: {
        id: "new-user-" + Date.now(),
        email,
        name: `${first_name} ${last_name}`,
        role,
        token: "user-token-" + Date.now(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred during registration" }, { status: 500 })
  }
}
