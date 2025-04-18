"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Bell, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Notification {
  id: number
  time: string
  title: string
  message: string
  token: string
  read?: boolean
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    // 1) Load JWT from localStorage
    const jwt = localStorage.getItem('jwt') || ''
    setToken(jwt)

    if (!jwt) {
      setError('Please log in to view notifications.')
      setIsLoading(false)
      return
    }

    // 2) Fetch notifications from proxy route, forwarding auth header
    async function fetchNotifications() {
      setIsLoading(true)
      setError("")

      try {
        const resp = await fetch(`/api/notifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          }
        })
        if (!resp.ok) {
          throw new Error(`Error ${resp.status}: ${resp.statusText}`)
        }
        const data: Notification[] = await resp.json()
        // initialize read state
        setNotifications(data.map(n => ({ ...n, read: false })))
      } catch (err) {
        console.error(err)
        setError('Failed to load notifications. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatNotificationTime = (timeString: string) => {
    try {
      return format(new Date(timeString), "MMM dd, yyyy 'at' h:mm a")
    } catch {
      return timeString
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      )}

      {!isLoading && !error && notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-gray-500 mt-1">You don’t have any notifications at the moment.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map(n => (
            <Card key={n.id} className={n.read ? "opacity-70" : "border-l-4 border-indigo-500"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{n.title}</CardTitle>
                  <span className="text-sm text-gray-500">{formatNotificationTime(n.time)}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-700">{n.message}</p>
                {!n.read && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(n.id)}
                      className="text-indigo-500 hover:text-indigo-600"
                    >
                      Mark as read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}