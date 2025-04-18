"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/user/role")
        if (response.ok) {
          const data = await response.json()
          setUserRole(data.role)
        } else {
          // If we can't get the role, redirect to login
          console.error("Failed to fetch user role")
          router.push("/")
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout")
      if (response.ok || response.redirected) {
        // Redirect to login page
        window.location.href = "/"
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [{ name: "Dashboard", path: "/dashboard" }]

    // Items for all users, but with different permissions
    const sharedItems = [
      { name: "Manage Bookings", path: "/dashboard/bookings" },
      { name: "View Events", path: "/dashboard/events" },
    ]

    // Items only for managers
    const managerItems = [{ name: "Create Events", path: "/dashboard/create-events" }]

    // Items for all users
    const userItems = [
      { name: "Book Cafe", path: "/dashboard/book-cafe" },
      { name: "Book Seats", path: "/dashboard/book-seats" },
    ]

    // Items only for managers - moved above notifications
    const managerOnlyItems = [{ name: "Book Meeting Room", path: "/dashboard/book-meeting-room" }]

    // Notifications item - now after Book Meeting Room
    const notificationsItem = [{ name: "Notifications", path: "/dashboard/notifications" }]

    if (userRole === "Manager") {
      return [...baseItems, ...sharedItems, ...managerItems, ...userItems, ...managerOnlyItems, ...notificationsItem]
    } else {
      return [...baseItems, ...sharedItems, ...userItems, ...notificationsItem]
    }
  }

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(path)
  }

  if (isLoading) {
    return (
      <aside className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-4">Loading...</div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-white border-r overflow-y-auto">
      <nav className="flex flex-col h-full">
        <div className="flex-1">
          {getNavItems().map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-6 py-4 hover:bg-gray-100 ${isActive(item.path) ? "bg-gray-100 font-medium" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} className="block px-6 py-4 text-red-500 hover:bg-gray-100 border-t text-left">
          Logout
        </button>
      </nav>
    </aside>
  )
}
