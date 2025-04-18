"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { overallBookingApi, eventsApi } from "@/services/api"

interface Event {
  id: string
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
}

interface Stats {
  workstations: { available: number; total: number }
  meetingRooms: { available: number; total: number }
  upcomingEvents: number
}

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats>({
    workstations: { available: 0, total: 0 },
    meetingRooms: { available: 0, total: 0 },
    upcomingEvents: 0,
  })

  const [todaysEvents, setTodaysEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [userName, setUserName] = useState("")

  // Fetch dashboard data from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Get token from localStorage
        const token = localStorage.getItem("user_token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch homescreen data
        const homescreenData = await overallBookingApi.getHomescreenData(token)

        // Set user name
        if (homescreenData.user) {
          setUserName(homescreenData.user.first_name || "User")
        }

        // Set stats
        setStats({
          workstations: {
            available: homescreenData.availableWorkstations || 0,
            total: homescreenData.totalWorkstations || 0,
          },
          meetingRooms: {
            available: homescreenData.availableMeetingRooms || 0,
            total: homescreenData.totalMeetingRooms || 0,
          },
          upcomingEvents: homescreenData.upcomingEventsCount || 0,
        })

        // Fetch today's events
        const formattedDate = format(currentDate, "yyyy-MM-dd")
        const eventsData = await eventsApi.getEventsByDate(formattedDate)

        // Transform events data to match our interface
        const transformedEvents = eventsData.map((event: any) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          date: event.date,
          startTime: event.start_time,
          endTime: event.end_time,
        }))

        setTodaysEvents(transformedEvents)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()

    // Update the current date every minute
    const intervalId = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [currentDate])

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Format the current date
  const formattedDate = format(currentDate, "EEEE, MMMM do, yyyy")
  const formattedTime = format(currentDate, "h:mm a")

  // Check if it's a weekend
  const isWeekend = [0, 6].includes(currentDate.getDay())

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg shadow-sm ${isWeekend ? "bg-indigo-50" : "bg-white"}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">
              {getGreeting()}, {userName}
            </h2>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">{formattedTime}</p>
            {isWeekend && <p className="text-indigo-500 font-medium">Weekend</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading dashboard data...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Available Workstations</p>
                  <p className="text-4xl font-bold">
                    {stats.workstations.available} / {stats.workstations.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.workstations.total > 0
                      ? Math.round((stats.workstations.available / stats.workstations.total) * 100)
                      : 0}
                    % available
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Meeting Rooms Free</p>
                  <p className="text-4xl font-bold">
                    {stats.meetingRooms.available} / {stats.meetingRooms.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.meetingRooms.total > 0
                      ? Math.round((stats.meetingRooms.available / stats.meetingRooms.total) * 100)
                      : 0}
                    % available
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Upcoming Events</p>
                  <p className="text-4xl font-bold">{stats.upcomingEvents}</p>
                  <p className="text-sm text-gray-500">
                    {stats.upcomingEvents > 0 ? "Check your calendar" : "No upcoming events"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Today's Events</h3>
            {todaysEvents.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                No events scheduled for today
              </div>
            ) : (
              <div className="space-y-4">
                {todaysEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-bold">{event.name}</h4>
                      <p className="text-gray-500">
                        {event.startTime} - {event.endTime} | {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
