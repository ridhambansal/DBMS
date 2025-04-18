// src/services/api.ts
import axios from 'axios';

// Configure your backend base URL if needed:
axios.defaults.baseURL = 'http://localhost:8080';

export const seatBookingApi = {
  // Create a new seat booking
  createSeatBooking: (bookingData: any) =>
    axios.post('/seat-booking', bookingData).then(res => res.data),

  // Fetch all seat bookings (alias for findAll)
  getAllSeatBookings: () =>
    axios.get('/seat-booking').then(res => res.data),
  findAll: () =>
    axios.get('/seat-booking').then(res => res.data),

  // (Optional) other endpoints if you need them:
  // getSeatBookingById: (id: string) =>
  //   axios.get(`/seat-booking/${id}`).then(res => res.data),
  // updateSeatBooking: (id: string, data: any) =>
  //   axios.patch(`/seat-booking/${id}`, data).then(res => res.data),
  // deleteSeatBooking: (id: string) =>
  //   axios.delete(`/seat-booking/${id}`).then(res => res.data),
};
