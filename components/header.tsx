"use client"

import { useEffect, useState } from "react"

interface User {
  name: string
  initials: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<User>({ name: "", initials: "", role: "" })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const userData = await response.json()

          // Create initials from name if not provided
          let initials = userData.initials
          if (!initials && userData.name) {
            initials = userData.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          }

          setUser({
            name: userData.name || "",
            initials: initials || "",
            role: userData.role || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <header className="bg-indigo-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Office Space Manager</h1>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>{user.role}</span>
            <div className="w-10 h-10 rounded-full bg-white text-indigo-500 flex items-center justify-center font-bold">
              {user.initials}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
