// File: components/EventsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { eventsApi, userApi } from '@/services/api'

interface EventItem {
  id: string
  name: string
  description: string
  date: string
}

export default function EventsList() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('user_token')
        if (!token) throw new Error('No authentication token found')

        const userData = await userApi.getUserByToken(token)
        if (userData?.role) setUserRole(userData.role.name)

        const eventsData = await eventsApi.getAllEvents()
        const transformed = eventsData.map((evt: any) => ({
          id: evt.id,
          name: evt.event_name,
          description: evt.description,
          date: evt.date,
        }))
        setEvents(transformed)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = (evt: EventItem) => {
    setSelectedEvent(evt)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedEvent) return
    setIsLoading(true)
    try {
      await eventsApi.deleteEvent(selectedEvent.id)
      setEvents(events.filter(e => e.id !== selectedEvent.id))
    } catch {
      setError('Failed to delete event')
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">View Events</h1>

      {isLoading && <div className="text-center py-4">Loading events...</div>}
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>}
      {!isLoading && events.length === 0 && <div className="text-center py-10 text-gray-500">No events found.</div>}

      {!isLoading && events.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                {userRole === 'Manager' && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(evt => (
                <TableRow key={evt.id}>
                  <TableCell className="font-medium">{evt.name}</TableCell>
                  <TableCell>{formatDate(evt.date)}</TableCell>
                  <TableCell className="max-w-xs truncate">{evt.description}</TableCell>
                  {userRole === 'Manager' && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => {/* edit logic */}}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(evt)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <b>{selectedEvent?.name}</b>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}