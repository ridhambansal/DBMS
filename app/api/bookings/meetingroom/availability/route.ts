import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real app, you would check availability against existing bookings in a database
    // For this mock, we'll just return a success response

    // Simulate some unavailability based on time
    const startTime = new Date(body.start_time).getHours()
    const available = startTime < 17 // Available before 5 PM

    return NextResponse.json({
      available,
      message: available
        ? "Meeting room is available for the selected time"
        : "Meeting room is not available for the selected time",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred while checking availability" },
      { status: 500 },
    )
  }
}
