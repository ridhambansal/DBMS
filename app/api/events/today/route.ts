import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Function to generate mock events for a specific date
function generateEventsForDate(dateStr: string) {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay()

  // Return different events based on the day of the week
  if (dayOfWeek === 1) {
    // Monday
    return [
      {
        id: `event-${dateStr}-1`,
        name: "Weekly Team Meeting",
        description: "Regular team sync-up",
        date: dateStr,
        startTime: "09:30",
        endTime: "10:30",
      },
      {
        id: `event-${dateStr}-2`,
        name: "Project Planning",
        description: "Planning session for upcoming projects",
        date: dateStr,
        startTime: "14:00",
        endTime: "15:30",
      },
    ]
  } else if (dayOfWeek === 3) {
    // Wednesday
    return [
      {
        id: `event-${dateStr}-1`,
        name: "Mid-week Review",
        description: "Review progress on current tasks",
        date: dateStr,
        startTime: "11:00",
        endTime: "12:00",
      },
    ]
  } else if (dayOfWeek === 5) {
    // Friday
    return [
      {
        id: `event-${dateStr}-1`,
        name: "Weekly Wrap-up",
        description: "End of week summary and planning",
        date: dateStr,
        startTime: "16:00",
        endTime: "17:00",
      },
      {
        id: `event-${dateStr}-2`,
        name: "Team Social",
        description: "Casual team gathering",
        date: dateStr,
        startTime: "17:30",
        endTime: "19:00",
      },
    ]
  } else if ([0, 6].includes(dayOfWeek)) {
    // Weekend
    return [] // No events on weekends
  } else {
    // Default events for other days
    return [
      {
        id: `event-${dateStr}-1`,
        name: "Daily Standup",
        description: "Team daily standup meeting",
        date: dateStr,
        startTime: "09:30",
        endTime: "10:00",
      },
    ]
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const dateParam = searchParams.get("date")

  // Use provided date or default to today
  const dateStr = dateParam || new Date().toISOString().split("T")[0]

  // Generate events based on the date
  const events = generateEventsForDate(dateStr)

  // In a real app, you would fetch today's events from a database
  return NextResponse.json(events)
}
