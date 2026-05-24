import { userApi } from './http';

export const register = (payload) => userApi.post('/auth/register', payload);

export const login = (payload) => userApi.post('/auth/login', payload);

export const getProfile = () => userApi.get('/users/profile');

export const updateProfile = (payload) => userApi.put('/users/profile', payload);

export const changePassword = (payload) => userApi.put('/users/change-password', payload);
