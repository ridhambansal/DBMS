import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would get the role from the authenticated user's session
  // For this mock, we'll return a sample role
  // You would replace this with actual database lookup logic

  // For testing, you can change this to "Employee" to see the role-based restrictions
  return NextResponse.json({ role: "Manager" })
}
