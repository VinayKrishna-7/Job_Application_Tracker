import { z } from 'zod';

export const updateProfileSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
    title: z.string().trim().max(100).optional().nullable(),
    bio: z.string().trim().max(500).optional().nullable(),
    avatar: z.string().trim().optional().nullable(),
    phone: z.string().trim().max(30).optional().nullable(),
    location: z.string().trim().max(100).optional().nullable(),
    linkedIn: z.string().trim().max(200).optional().nullable(),
    gitHub: z.string().trim().max(200).optional().nullable(),
    portfolio: z.string().trim().max(200).optional().nullable(),
  }),
};
