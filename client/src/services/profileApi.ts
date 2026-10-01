import api from './api';
import { User, UpdateProfileData } from '../types/auth';

export const profileApi = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/profile');
    return res.data.data.user;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const res = await api.patch('/profile', data);
    return res.data.data.user;
  },

  uploadAvatar: async (file: File): Promise<{ user: User; avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};
