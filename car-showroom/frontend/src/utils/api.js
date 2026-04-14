import axios from 'axios';

// Base URL - uses Vite proxy in development
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Request interceptor: attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Redirect to login if not already there
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
