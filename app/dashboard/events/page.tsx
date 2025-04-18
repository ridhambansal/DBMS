import EventsList from "@/components/events-list"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function EventsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <EventsList />
        </main>
      </div>
    </div>
  )
}
