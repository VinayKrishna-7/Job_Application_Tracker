import api from './api';
import {
  JobApplication,
  ApplicationFilterParams,
  ApplicationListResponse,
} from '../types/application';

export const applicationApi = {
  list: async (params: ApplicationFilterParams = {}): Promise<ApplicationListResponse> => {
    const res = await api.get('/applications', { params });
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  },

  getKanban: async (): Promise<JobApplication[]> => {
    const res = await api.get('/applications/kanban');
    return res.data.data.applications;
  },

  getById: async (id: string): Promise<JobApplication> => {
    const res = await api.get(`/applications/${id}`);
    return res.data.data.application;
  },

  create: async (data: Partial<JobApplication>): Promise<JobApplication> => {
    const res = await api.post('/applications', data);
    return res.data.data.application;
  },

  update: async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    const res = await api.patch(`/applications/${id}`, data);
    return res.data.data.application;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },

  uploadResume: async (file: File): Promise<{ url: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/applications/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};
