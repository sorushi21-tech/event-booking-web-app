import { eventApi } from './http';

export const getEvents = ({ page = 0, size = 10 } = {}) => eventApi.get('/events', {
  params: { page, size }
});

export const getEventById = (id) => eventApi.get(`/events/${id}`);

export const createEvent = (payload) => eventApi.post('/events', payload);

export const updateAdminEvent = (id, payload) => eventApi.put(`/admin/events/${id}`, payload);

export const cancelAdminEvent = (id) => eventApi.delete(`/admin/events/${id}`);
