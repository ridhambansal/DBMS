'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { seatBookingApi } from '@/services/api'

export default function BookSeatsForm() {
  const [formData, setFormData] = useState({
    date: '',
    floor_number: 0,
    capacity: 0,
    status: true,
  })
  const [seatNumbers, setSeatNumbers] = useState('')
  const [userTokens, setUserTokens] = useState('')
  const [token, setToken] = useState<string>('')
  const [floors, setFloors] = useState<number[]>([])
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Load JWT and floor list
  useEffect(() => {
    const jwt = localStorage.getItem('user_token') || ''
    if (!jwt) {
      setError('Please log in to book seats.')
      return
    }
    setToken(jwt)
    // Hardcode floor options for now
    setFloors([1, 2, 3, 4, 5])
  }, [])

  const handleInput = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!token) return setError('Login required.')

    const seat_no = seatNumbers
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean)
    const users = userTokens
      .split(/[,\n]/)
      .map(u => u.trim())
      .filter(Boolean)

    const payload = {
      token,
      date: new Date(formData.date).toISOString(),
      floor_number: formData.floor_number,
      status: formData.status,
      seat_no,
      capacity: formData.capacity || Math.max(seat_no.length, users.length),
      users,
    }

    setIsLoading(true)
    try {
      await seatBookingApi.createSeatBooking(payload)
      setSuccess('Booking successful!')
      setFormData({ date: '', floor_number: 0, capacity: 0, status: true })
      setSeatNumbers('')
      setUserTokens('')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Unexpected error.')
    } finally {
      setIsLoading(false)
    }
  }

  // Preview the payload
  const previewPayload = {
    token: token || '...',
    date: formData.date || 'YYYY-MM-DD',
    floor_number: formData.floor_number,
    status: formData.status,
    seat_no: seatNumbers.split(/[,\n]/).map(s => s.trim()).filter(Boolean),
    capacity: formData.capacity || 0,
    users: userTokens.split(/[,\n]/).map(u => u.trim()).filter(Boolean),
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Booking Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => handleInput('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={String(formData.floor_number)}
                onValueChange={v => handleInput('floor_number', Number(v))}
                required
              >
                <SelectTrigger id="floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map(f => (
                    <SelectItem key={f} value={f.toString()}>
                      Floor {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status"
                checked={formData.status}
                onCheckedChange={c => handleInput('status', c === true)}
              />
              <Label htmlFor="status">Active</Label>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity || ''}
                onChange={e => handleInput('capacity', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seats & Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seatNumbers">Seat Numbers</Label>
              <textarea
                id="seatNumbers"
                className="w-full border rounded-md p-2 h-24"
                placeholder="One per line"
                value={seatNumbers}
                onChange={e => setSeatNumbers(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="userTokens">Users</Label>
              <textarea
                id="userTokens"
                className="w-full border rounded-md p-2 h-24"
                placeholder="One per line"
                value={userTokens}
                onChange={e => setUserTokens(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review & Submit</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-2 rounded-md overflow-auto text-sm">
            {JSON.stringify(previewPayload, null, 2)}
          </pre>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
