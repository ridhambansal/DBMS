// pages/api/bookings/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = req.headers.authorization || '';

  if (req.method === 'GET') {
    try {
      const backendRes = await fetch(`${BACKEND}/overall-booking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: auth } : {}),
        },
      });
      const data = await backendRes.json();
      const bookings = Array.isArray(data)
        ? data.map((item: any) => ({
            id:          String(item.id),
            amenity:     item.amenity,           // <-- pass through the amenity
            bookingDate: item.date,
            startTime:   item.details?.[0] || '',
            endTime:     item.details?.[1] || '',
          }))
        : [];

      return res.status(backendRes.status).json(bookings);
    } catch (err: any) {
      console.error('Booking proxy error:', err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
