import api from './api';
import { Interview, CreateInterviewInput } from '../types/interview';

export const interviewApi = {
  list: async (params: { status?: string; type?: string; limit?: number } = {}): Promise<Interview[]> => {
    const res = await api.get('/interviews', { params });
    return res.data.data.interviews;
  },

  getById: async (id: string): Promise<Interview> => {
    const res = await api.get(`/interviews/${id}`);
    return res.data.data.interview;
  },

  create: async (data: CreateInterviewInput): Promise<Interview> => {
    const res = await api.post('/interviews', data);
    return res.data.data.interview;
  },

  update: async (id: string, data: Partial<CreateInterviewInput>): Promise<Interview> => {
    const res = await api.patch(`/interviews/${id}`, data);
    return res.data.data.interview;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/interviews/${id}`);
  },
};
