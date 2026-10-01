import api from './api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', credentials);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  forgotPassword: async (email: string): Promise<{ message: string; devResetToken?: string }> => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const res = await api.post('/auth/reset-password', { token, password });
    return res.data.data;
  },
};
