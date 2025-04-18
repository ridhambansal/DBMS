import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Function to generate dynamic stats based on the day of the week
function generateDynamicStats() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const hour = now.getHours()

  // Base stats
  const stats = {
    workstations: { available: 42, total: 50 },
    meetingRooms: { available: 5, total: 8 },
    upcomingEvents: 3,
  }

  // Modify stats based on day of week
  if ([0, 6].includes(dayOfWeek)) {
    // Weekend - more availability
    stats.workstations.available = 48
    stats.meetingRooms.available = 7
    stats.upcomingEvents = 1
  } else if (dayOfWeek === 1) {
    // Monday - busy day
    stats.workstations.available = 35
    stats.meetingRooms.available = 3
    stats.upcomingEvents = 5
  } else if (dayOfWeek === 5) {
    // Friday - less busy
    stats.workstations.available = 45
    stats.meetingRooms.available = 6
    stats.upcomingEvents = 2
  }

  // Modify stats based on time of day
  if (hour < 9) {
    // Early morning - more availability
    stats.workstations.available = Math.min(stats.workstations.available + 10, stats.workstations.total)
    stats.meetingRooms.available = Math.min(stats.meetingRooms.available + 2, stats.meetingRooms.total)
  } else if (hour >= 12 && hour < 14) {
    // Lunch time - more meeting room availability
    stats.meetingRooms.available = Math.min(stats.meetingRooms.available + 1, stats.meetingRooms.total)
  } else if (hour >= 17) {
    // Evening - more availability
    stats.workstations.available = Math.min(stats.workstations.available + 8, stats.workstations.total)
    stats.meetingRooms.available = Math.min(stats.meetingRooms.available + 2, stats.meetingRooms.total)
  }

  return stats
}

export async function GET(request: NextRequest) {
  // Generate dynamic stats based on current time
  const stats = generateDynamicStats()

  // In a real app, you would fetch real-time stats from a database
  return NextResponse.json(stats)
}
