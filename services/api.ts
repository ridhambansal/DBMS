// Base API configuration
const API_BASE_URL = "http://localhost:8080"

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  // Get token from localStorage if available
  const token = localStorage.getItem("user_token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(url, config)

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem("user_token")
    window.location.href = "/"
    return null
  }

  // For non-204 responses, parse JSON
  if (response.status !== 204) {
    const data = await response.json()

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.message || "An error occurred")
    }

    return data
  }

  return null
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
}

// User API
export const userApi = {
  createUser: (userData: any) =>
    apiRequest("/user", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => apiRequest("/user"),

  getUserByToken: (token: string) => apiRequest(`/user/${token}`),

  updateUser: (email: string, userData: any) =>
    apiRequest(`/user/${email}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  deleteUser: (id: string) =>
    apiRequest(`/user/${id}`, {
      method: "DELETE",
    }),

  checkTokenExpiration: () => apiRequest("/user/token_expiration"),
}

// Events API
export const eventsApi = {
  createEvent: (eventData: any) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  getAllEvents: () => apiRequest("/events"),

  getEventsByDate: (date: string) => apiRequest(`/events/${date}`),

  updateEvent: (id: string, eventData: any) =>
    apiRequest(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id: string) =>
    apiRequest(`/events/${id}`, {
      method: "DELETE",
    }),
}

// Role API
export const roleApi = {
  createRole: (roleData: any) =>
    apiRequest("/role", {
      method: "POST",
      body: JSON.stringify(roleData),
    }),

  getAllRoles: () => apiRequest("/role"),

  getRoleById: (id: string) => apiRequest(`/role/${id}`),

  updateRole: (id: string, roleData: any) =>
    apiRequest(`/role/${id}`, {
      method: "PATCH",
      body: JSON.stringify(roleData),
    }),

  deleteRole: (id: string) =>
    apiRequest(`/role/${id}`, {
      method: "DELETE",
    }),
}

// Floor Details API
export const floorApi = {
  createFloorDetail: (floorData: any) =>
    apiRequest("/floor-details", {
      method: "POST",
      body: JSON.stringify(floorData),
    }),

  getAllFloorDetails: () => apiRequest("/floor-details"),

  getFloorDetailById: (id: string) => apiRequest(`/floor-details/${id}`),

  updateFloorDetail: (id: string, floorData: any) =>
    apiRequest(`/floor-details/${id}`, {
      method: "PATCH",
      body: JSON.stringify(floorData),
    }),

  deleteFloorDetail: (id: string) =>
    apiRequest(`/floor-details/${id}`, {
      method: "DELETE",
    }),

  getFloorsCapacity: () => apiRequest("/floor-details/floors/capacity"),
}

// Seat Booking API
export const seatBookingApi = {
  createSeatBooking: (bookingData: any) =>
    apiRequest("/seat-booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getAllSeatBookings: () => apiRequest("/seat-booking"),

  getSeatBookingById: (id: string) => apiRequest(`/seat-booking/${id}`),

  updateSeatBooking: (id: string, bookingData: any) =>
    apiRequest(`/seat-booking/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookingData),
    }),

  deleteSeatBooking: (id: string) =>
    apiRequest(`/seat-booking/${id}`, {
      method: "DELETE",
    }),

  getUserSeatBookings: (token: string) => apiRequest(`/seat-booking/booking/${token}`),

  getAvailabilityByDate: (date: string) => apiRequest(`/seat-booking/availability/${date}`),

  getAvailabilityByFloorAndDate: (date: string) => apiRequest(`/seat-booking/availabilityFloorWise/${date}`),
}

// Overall Booking API
export const overallBookingApi = {
  createOverallBooking: (bookingData: any) =>
    apiRequest("/overall-booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getAllOverallBookings: () => apiRequest("/overall-booking"),

  getOverallBookingById: (id: string) => apiRequest(`/overall-booking/${id}`),

  updateOverallBooking: (id: string, bookingData: any) =>
    apiRequest(`/overall-booking/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookingData),
    }),

  deleteOverallBooking: (id: string) =>
    apiRequest(`/overall-booking/${id}`, {
      method: "DELETE",
    }),

  getHomescreenData: (token: string) => apiRequest(`/overall-booking/homescreen_api/${token}`),
}

// Meeting Room Booking API
export const meetingRoomBookingApi = {
  createMeetingRoomBooking: (bookingData: any) =>
    apiRequest("/meetingroom-booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getAllMeetingRoomBookings: () => apiRequest("/meetingroom-booking"),

  getMeetingRoomBookingById: (id: string) => apiRequest(`/meetingroom-booking/${id}`),

  updateMeetingRoomBooking: (id: string, bookingData: any) =>
    apiRequest(`/meetingroom-booking/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookingData),
    }),

  deleteMeetingRoomBooking: (id: string) =>
    apiRequest(`/meetingroom-booking/${id}`, {
      method: "DELETE",
    }),

  getUserMeetingRoomBookings: (token: string) => apiRequest(`/meetingroom-booking/booking/${token}`),

  getAvailableRoomCount: () => apiRequest("/meetingroom-booking/available/availableRoomCount"),

  checkAvailability: (availabilityData: any) =>
    apiRequest("/meetingroom-booking/booking/available", {
      method: "POST",
      body: JSON.stringify(availabilityData),
    }),
}

// Meeting Room Details API
export const meetingRoomDetailsApi = {
  createMeetingRoomDetail: (roomData: any) =>
    apiRequest("/meetingroom-details", {
      method: "POST",
      body: JSON.stringify(roomData),
    }),

  getAllMeetingRoomDetails: () => apiRequest("/meetingroom-details"),

  getMeetingRoomDetailById: (id: string) => apiRequest(`/meetingroom-details/${id}`),

  updateMeetingRoomDetail: (id: string, roomData: any) =>
    apiRequest(`/meetingroom-details/${id}`, {
      method: "PATCH",
      body: JSON.stringify(roomData),
    }),

  deleteMeetingRoomDetail: (id: string) =>
    apiRequest(`/meetingroom-details/${id}`, {
      method: "DELETE",
    }),
}

// Cafeteria Booking API
export const cafeteriaBookingApi = {
  createCafeteriaBooking: (bookingData: any) =>
    apiRequest("/cafeteria-booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getAllCafeteriaBookings: () => apiRequest("/cafeteria-booking"),

  getCafeteriaBookingById: (id: string) => apiRequest(`/cafeteria-booking/${id}`),

  updateCafeteriaBooking: (id: string, bookingData: any) =>
    apiRequest(`/cafeteria-booking/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookingData),
    }),

  deleteCafeteriaBooking: (id: string) =>
    apiRequest(`/cafeteria-booking/${id}`, {
      method: "DELETE",
    }),

  getTotalAvailabilityByDate: (date: string) => apiRequest(`/cafeteria-booking/total_availability/${date}`),

  getUserCafeteriaBookings: (token: string) => apiRequest(`/cafeteria-booking/booking/${token}`),

  checkAvailability: (availabilityData: any) =>
    apiRequest("/cafeteria-booking/availability/datetime", {
      method: "POST",
      body: JSON.stringify(availabilityData),
    }),
}

// Notification API
export const notificationApi = {
  createNotification: (notificationData: any) =>
    apiRequest("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    }),
}

export default {
  auth: authApi,
  user: userApi,
  events: eventsApi,
  role: roleApi,
  floor: floorApi,
  seatBooking: seatBookingApi,
  overallBooking: overallBookingApi,
  meetingRoomBooking: meetingRoomBookingApi,
  meetingRoomDetails: meetingRoomDetailsApi,
  cafeteriaBooking: cafeteriaBookingApi,
  notification: notificationApi,
}
