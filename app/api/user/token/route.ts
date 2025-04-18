import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would get the token from the authenticated user's session
  // For this mock, we'll return a sample token
  return NextResponse.json({ token: "user-token-123" })
}
