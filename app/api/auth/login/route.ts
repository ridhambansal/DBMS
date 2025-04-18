import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // In a real app, you would validate credentials against a database
    // For this mock, we'll accept specific credentials
    if (email === "test@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          role: "Manager",
          token: "user-token-123",
        },
      })
    }

    // Return error for invalid credentials
    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
