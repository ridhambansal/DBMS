'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface User {
  id: string
  name: string
}

interface Room {
  room_id: number
  room_name: string
  floorId: number
  capacity: number
}

export default function BookMeetingRoomForm() {
  const router = useRouter()
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [formData, setFormData] = useState({
    room_id: 0,
    room_name: '',
    floorId: 0,
    date: '',
    start_time: '',
    end_time: '',
    users: [] as string[],
    status: true,
  })
  const [rooms, setRooms] = useState<Room[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [token, setToken] = useState<string>('')
  const [capacity, setCapacity] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load JWT and fetch rooms/users on mount
  useEffect(() => {
    const jwt = localStorage.getItem('jwt') || ''
    setToken(jwt)
    if (!jwt) {
      setError('Please log in to book a meeting room.')
      return
    }

    async function fetchOptions() {
      try {
        const headers = { Authorization: `Bearer ${jwt}` }
        const [roomsResp, usersResp] = await Promise.all([
          fetch('/api/meetingrooms', { headers }),
          fetch('/api/users', { headers }),
        ])
        if (roomsResp.ok) setRooms(await roomsResp.json())
        if (usersResp.ok) setUsers(await usersResp.json())
      } catch {
        setError('Failed to load rooms or users.')
      }
    }
    fetchOptions()
  }, [])

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId)
    const id = Number(roomId)
    const room = rooms.find(r => r.room_id === id)
    if (room) {
      setFormData(prev => ({
        ...prev,
        room_id: room.room_id,
        room_name: room.room_name,
        floorId: room.floorId,
      }))
      setCapacity(room.capacity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleUser = (userId: string) => {
    setFormData(prev => {
      const isSelected = prev.users.includes(userId)
      let updated = isSelected
        ? prev.users.filter(u => u !== userId)
        : prev.users.length < capacity
        ? [...prev.users, userId]
        : prev.users
      if (!isSelected && updated.length === prev.users.length) {
        setError(`Cannot add more than ${capacity} users.`)
      }
      return { ...prev, users: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return setError('You must be logged in.')
    setError('')
    setSuccess('')
    setIsLoading(true)

    const payload = {
      token,
      room_id: formData.room_id,
      room_name: formData.room_name,
      floorId: formData.floorId,
      date: new Date(formData.date),
      start_time: new Date(`${formData.date}T${formData.start_time}`),
      end_time: new Date(`${formData.date}T${formData.end_time}`),
      users: formData.users,
      status: formData.status,
    }

    try {
      const resp = await fetch('/api/bookings/meetingroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.message || 'Booking failed')
      setSuccess('Meeting room booked successfully!')
      setFormData(prev => ({ ...prev, date: '', start_time: '', end_time: '', users: [] }))
      setSelectedRoomId('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking error')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAvailability = async () => {
    if (!token) return setError('You must be logged in.')
    setError('')
    setSuccess('')
    setIsLoading(true)

    const payload = {
      date: new Date(formData.date),
      start_time: new Date(`${formData.date}T${formData.start_time}`),
      end_time: new Date(`${formData.date}T${formData.end_time}`),
      capacity: formData.users.length,
    }
    try {
      const resp = await fetch('/api/bookings/meetingroom/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const result = await resp.json()
      if (!resp.ok) throw new Error(result.message || 'Availability check failed')
      setSuccess(result.available ? 'Room is available' : 'Room not available')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book Meeting Room</h1>
      <Card>
        <CardHeader><CardTitle>Booking Details</CardTitle></CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">{success}</div>}
            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={selectedRoomId} onValueChange={handleRoomChange} required>
                <SelectTrigger><SelectValue placeholder="Select a room" /></SelectTrigger>
                <SelectContent>
                  {rooms.map(r => (
                    <SelectItem key={r.room_id} value={`${r.room_id}`}>{r.room_name} (Floor {r.floorId}, Cap {r.capacity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Input value={formData.floorId} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
              </div>
            </div>
            <div>
              <Label>Users ({formData.users.length}/{capacity || 0})</Label>
              <div className="border p-3 rounded max-h-40 overflow-y-auto">
                {users.map(u => (
                  <div key={u.id} className="flex items-center">
                    <Checkbox
                      checked={formData.users.includes(u.id)}
                      onCheckedChange={() => toggleUser(u.id)}
                      className="mr-2"
                    />
                    <span>{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={checkAvailability} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Check Availability'}
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book Meeting Room'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
