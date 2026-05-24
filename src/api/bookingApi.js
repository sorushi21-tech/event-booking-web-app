import { bookingApi } from './http';

export const createBooking = (payload) => bookingApi.post('/bookings', payload);

export const getMyBookings = ({ page = 0, size = 10 } = {}) => bookingApi.get('/bookings/my', {
  params: { page, size }
});

export const cancelBooking = (bookingId) => bookingApi.delete(`/bookings/${bookingId}`);

export const getAdminEventBookings = (eventId, { page = 0, size = 10 } = {}) => bookingApi.get(`/admin/events/${eventId}/bookings`, {
  params: { page, size }
});
