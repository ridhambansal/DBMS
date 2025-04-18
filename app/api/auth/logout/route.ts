import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, you would implement proper logout logic here
  // This would typically involve:
  // 1. Clearing any server-side session
  // 2. Removing authentication cookies

  // Create a response that will redirect to the login page
  const response = NextResponse.redirect(new URL("/", "http://localhost:3000"))

  // Clear any cookies that might be used for authentication
  response.cookies.delete("auth_token")

  return response
}
