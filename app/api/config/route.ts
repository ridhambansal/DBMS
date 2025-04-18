import { NextResponse } from "next/server"

// This endpoint provides API configuration information
export async function GET() {
  return NextResponse.json({
    apiVersion: "1.0.0",
    baseUrl: "http://localhost:3000/api",
    endpoints: {
      auth: {
        login: "/auth/login",
        register: "/auth/register",
        logout: "/auth/logout",
      },
      user: {
        profile: "/user",
        role: "/user/role",
        token: "/user/token",
      },
      bookings: {
        list: "/bookings",
        detail: "/bookings/{id}",
        meetingRoom: "/bookings/meetingroom",
        meetingRoomAvailability: "/bookings/meetingroom/availability",
        cafeteria: "/bookings/cafeteria",
        cafeteriaAvailability: "/bookings/cafeteria/availability",
        seat: "/bookings/seat",
      },
      events: {
        list: "/events",
        detail: "/events/{id}",
        today: "/events/today",
      },
      resources: {
        meetingRooms: "/meetingrooms",
        users: "/users",
        floors: "/floors",
        seats: "/seats/available",
      },
      dashboard: {
        stats: "/dashboard/stats",
      },
      notifications: {
        list: "/notifications",
      },
    },
    authType: "Bearer",
    contentType: "application/json",
  })
}
