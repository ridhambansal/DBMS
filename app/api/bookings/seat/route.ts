import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real app, you would validate and store the seat booking in a database
    // For this mock, we'll just return a success response with the created booking
    const newBooking = {
      id: "seat-" + Date.now(),
      ...body,
      status: "confirmed",
    }

    return NextResponse.json(newBooking)
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred while booking the seat" }, { status: 500 })
  }
}
