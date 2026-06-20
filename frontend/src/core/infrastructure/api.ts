import axios from 'axios';
import { useAuthStore } from '../application/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject active auth JWT token into Axios requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    // Check if it's an auth request (public route)
    const isAuthRequest = config.url?.includes('/api/auth/login') || config.url?.includes('/api/auth/register');

    if (!isAuthRequest) {
      if (!token) {
        // No token available for protected route, clear state and redirect
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(new Error('No token found'));
      }
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor to handle global response errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired, invalid or deleted on backend: clear state and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
