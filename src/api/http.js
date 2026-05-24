import axios from 'axios';

const userApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_BOOKING_USER_SERVICE_URL
    || import.meta.env.VITE_USER_SERVICE_URL
    || 'http://localhost:8081/api'
});

const eventApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_BOOKING_EVENT_SERVICE_URL
    || import.meta.env.VITE_EVENT_SERVICE_URL
    || 'http://localhost:8082/api'
});

const bookingApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_BOOKING_BOOKING_SERVICE_URL
    || import.meta.env.VITE_BOOKING_SERVICE_URL
    || 'http://localhost:8083/api'
});

let unauthorizedHandler = () => {};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === 'function' ? handler : () => {};
};

const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const unwrapApiResponse = (response) => {
  const body = response.data;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return {
      ...response,
      data: body.data,
      apiMessage: body.message
    };
  }
  return response;
};

const normalizeApiError = (error) => {
  const body = error.response?.data;
  if (body && typeof body === 'object' && 'success' in body) {
    error.response.data = {
      message: body.message || 'Request failed',
      errors: Array.isArray(body.errors) ? body.errors : [],
      validationErrors: Array.isArray(body.errors) ? body.errors : []
    };
  }
  return error;
};

[userApi, eventApi, bookingApi].forEach((client) => {
  client.interceptors.request.use(attachToken);
  client.interceptors.response.use(
    unwrapApiResponse,
    (error) => {
      normalizeApiError(error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        unauthorizedHandler();
      }
      return Promise.reject(error);
    }
  );
});

export { userApi, eventApi, bookingApi };
