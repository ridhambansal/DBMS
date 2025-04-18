import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Generate mock seats for a floor
function generateMockSeats(floor: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `seat-${floor}-${i + 1}`,
    seat_no: `${floor}${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
    floor_number: floor,
    isAvailable: Math.random() > 0.3, // 70% chance of being available
  }))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const floor = Number.parseInt(searchParams.get("floor") || "1", 10)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  // In a real app, you would fetch available seats from a database based on floor and date
  // For this mock, we'll generate random seats
  const seats = generateMockSeats(floor, 20).filter((seat) => seat.isAvailable)

  return NextResponse.json(seats)
}
