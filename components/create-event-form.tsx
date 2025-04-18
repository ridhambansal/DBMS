"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: formData.name,
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create event');
      }

      router.push('/dashboard/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <Card>
        <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" className="min-h-[100px]" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 w-full" disabled={isLoading}>
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}