import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would get the user data from the authenticated session
  // For this mock, we'll return sample user data
  return NextResponse.json({
    id: "user-123",
    name: "John Doe",
    initials: "JD",
    role: "Manager",
    email: "john.doe@example.com",
  })
}
