'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const API = process.env.NEXT_PUBLIC_API_URL;

interface FormData {
  date: string;
  start_time: string;
  end_time: string;
}

export default function BookCafeForm() {
  const [formData, setFormData] = useState<FormData>({ date: '', start_time: '', end_time: '' });
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const jwt = localStorage.getItem('jwt') || '';
    console.log('Loaded JWT:', jwt);
    setToken(jwt);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Not authenticated. Please log in.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        date: new Date(formData.date),
        start_time: new Date(`${formData.date}T${formData.start_time}`),
        end_time: new Date(`${formData.date}T${formData.end_time}`),
      };
      const res = await fetch(`${API}/cafeteria-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');

      setSuccess('Cafe booked successfully!');
      setFormData({ date: '', start_time: '', end_time: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.start_time || !formData.end_time) {
      setError('Please fill all fields');
      return;
    }
    if (!token) {
      setError('Not authenticated. Please log in.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        date: new Date(formData.date),
        start_time: new Date(`${formData.date}T${formData.start_time}`),
        end_time: new Date(`${formData.date}T${formData.end_time}`),
      };
      const res = await fetch(`${API}/cafeteria-booking/availability/datetime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Check failed');

      setSuccess(`Available seats: ${data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book Cafe</h1>
      <Card>
        <CardHeader><CardTitle>Cafe Booking Details</CardTitle></CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">{success}</div>}

            <div>
              <Label>Date</Label>
              <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input name="start_time" type="time" value={formData.start_time} onChange={handleChange} required />
              </div>
              <div>
                <Label>End Time</Label>
                <Input name="end_time" type="time" value={formData.end_time} onChange={handleChange} required />
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={checkAvailability} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Check Availability'}
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book Cafe'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}