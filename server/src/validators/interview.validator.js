import { z } from 'zod';
import { INTERVIEW_TYPES, INTERVIEW_RESULTS } from '../models/Interview.js';

export const createInterviewSchema = {
  body: z.object({
    applicationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application ID format'),
    date: z.coerce.date(),
    type: z.enum(INTERVIEW_TYPES).optional().default('Video Call'),
    round: z.coerce.number().int().min(1).optional().default(1),
    interviewer: z.string().trim().max(100).optional().default(''),
    meetingUrl: z.string().trim().optional().default(''),
    location: z.string().trim().max(120).optional().default(''),
    notes: z.string().optional().default(''),
    result: z.enum(INTERVIEW_RESULTS).optional().default('Scheduled'),
  }),
};

export const updateInterviewSchema = {
  body: z.object({
    date: z.coerce.date().optional(),
    type: z.enum(INTERVIEW_TYPES).optional(),
    round: z.coerce.number().int().min(1).optional(),
    interviewer: z.string().trim().max(100).optional(),
    meetingUrl: z.string().trim().optional(),
    location: z.string().trim().max(120).optional(),
    notes: z.string().optional(),
    result: z.enum(INTERVIEW_RESULTS).optional(),
  }),
};
