import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Mock events data (same as in the main events route)
const mockEvents = [
  {
    id: "event-1",
    name: "Quarterly Team Meeting",
    description: "Review of Q1 performance and Q2 goals",
    date: "2025-04-25",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "event-2",
    name: "Product Launch",
    description: "Launch of our new product line",
    date: "2025-05-10",
    startTime: "14:00",
    endTime: "16:00",
  },
  {
    id: "event-3",
    name: "Team Building",
    description: "Annual team building activity",
    date: "2025-06-15",
    startTime: "09:00",
    endTime: "17:00",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const event = mockEvents.find((e) => e.id === params.id)

  if (!event) {
    return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // In a real app, you would update the event in a database
    // For this mock, we'll just return the updated event
    const updatedEvent = {
      ...body,
      id: params.id,
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred while updating the event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // In a real app, you would delete the event from a database
  // For this mock, we'll just return a success response

  return NextResponse.json({ success: true, message: "Event deleted successfully" })
}
