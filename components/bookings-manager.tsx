// File: components/BookingsManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'   // install react-hot-toast
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Booking {
  id: string
  amenity: string
  bookingDate: string
  startTime: string
  endTime: string
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [toDelete, setToDelete] = useState<Booking | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const jwt = localStorage.getItem('jwt') || ''
        const roleResp = await fetch('/api/user/role', {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        const { role } = roleResp.ok ? await roleResp.json() : { role: null }
        setUserRole(role)

        const resp = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        if (!resp.ok) throw new Error('Failed to fetch bookings')
        const data = (await resp.json()) as any[]
        setBookings(
          data.map((item) => ({
            id: String(item.id),
            amenity: item.amenity || item.roomName,
            bookingDate: item.bookingDate ?? item.date,
            startTime:
              item.startTime ??
              item.start_time ??
              item.details?.[0] ??
              '',
            endTime:
              item.endTime ??
              item.end_time ??
              item.details?.[1] ??
              '',
          })),
        )
      } catch (e: any) {
        console.error(e)
        setError('Failed to load bookings')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const isManager = userRole === 'Manager'
  const formatDate = (d: string) => {
    try {
      return format(new Date(d), 'MMM dd, yyyy')
    } catch {
      return d
    }
  }

  // Fire the proxy DELETE
  const doDelete = async () => {
    if (!toDelete) return
    setIsLoading(true)
    try {
      const jwt = localStorage.getItem('jwt') || ''
      const resp = await fetch(`/api/bookings/${toDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
      })
      if (!resp.ok) throw new Error('Delete failed')
      // remove locally
      setBookings((bs) => bs.filter((b) => b.id !== toDelete.id))
      toast.success('Booking deleted!')
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to delete')
    } finally {
      setIsLoading(false)
      setToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && bookings.length === 0 && (
        <p className="text-gray-500">No bookings found.</p>
      )}

      {!isLoading && bookings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amenity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              {isManager && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} className="hover:bg-gray-50">
                <TableCell>{b.amenity}</TableCell>
                <TableCell>{formatDate(b.bookingDate)}</TableCell>
                <TableCell>
                  {b.startTime} – {b.endTime}
                </TableCell>
                {isManager && (
                  <TableCell className="text-right">
                    <div className="inline-flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => {/* edit logic… */}}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 rounded hover:bg-red-100"
                            onClick={() => setToDelete(b)}
                          >
                            <Trash2 className="h-5 w-5 text-red-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                          </DialogHeader>
                          <p>
                            Delete booking for{' '}
                            <strong>{b.amenity}</strong> on{' '}
                            <strong>{formatDate(b.bookingDate)}</strong>?
                          </p>
                          <DialogFooter className="space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setToDelete(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={doDelete}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Deleting…' : 'Delete'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
