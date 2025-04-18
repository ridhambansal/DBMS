import { redirect } from "next/navigation"
import BookMeetingRoomForm from "@/components/book-meeting-room-form"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

// This is a server component that will check the user's role before rendering
async function getUserRole() {
  // In a real app, you would verify the user's role from a secure source
  // For this example, we'll simulate an API call
  try {
    // This is a server-side API call
    const response = await fetch(`http://localhost:3000/api/user/role`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.role
  } catch (error) {
    console.error("Failed to fetch user role:", error)
    return null
  }
}

export default async function BookMeetingRoomPage() {
  const role = await getUserRole()

  // If the user is not a Manager, redirect to the dashboard
  if (role !== "Manager") {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <BookMeetingRoomForm />
        </main>
      </div>
    </div>
  )
}
