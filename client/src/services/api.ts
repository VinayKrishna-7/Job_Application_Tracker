import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string; errors?: any[] }>) => {
    const errorResponse = error.response?.data;
    const message = errorResponse?.message || error.message || 'An unexpected error occurred';
    const code = errorResponse?.code || 'UNKNOWN_ERROR';
    const errors = errorResponse?.errors;

    return Promise.reject({
      status: error.response?.status || 500,
      message,
      code,
      errors,
      originalError: error,
    });
  }
);

export default api;
