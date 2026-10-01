import { z } from 'zod';
import {
  APPLICATION_STATUSES,
  APPLICATION_PRIORITIES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
} from '../models/Application.js';

export const createApplicationSchema = {
  body: z.object({
    company: z.string().trim().min(1, 'Company name is required').max(120),
    position: z.string().trim().min(1, 'Position title is required').max(120),
    location: z.string().trim().max(120).optional().default(''),
    jobUrl: z.string().trim().optional().default(''),
    status: z.enum(APPLICATION_STATUSES).optional().default('Applied'),
    priority: z.enum(APPLICATION_PRIORITIES).optional().default('Medium'),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional().default('Full-time'),
    workMode: z.enum(WORK_MODES).optional().default('Remote'),
    salaryMin: z.coerce.number().min(0).nullable().optional(),
    salaryMax: z.coerce.number().min(0).nullable().optional(),
    currency: z.string().trim().default('USD'),
    dateApplied: z.coerce.date().optional(),
    source: z.string().trim().max(60).optional().default('LinkedIn'),
    contactName: z.string().trim().max(100).optional().default(''),
    contactEmail: z.string().trim().max(100).optional().default(''),
    contactPhone: z.string().trim().max(40).optional().default(''),
    notes: z.string().optional().default(''),
    resumeUrl: z.string().optional().default(''),
    coverLetterUrl: z.string().optional().default(''),
    tags: z.array(z.string().trim()).optional().default([]),
    followUpDate: z.coerce.date().nullable().optional(),
  }),
};

export const updateApplicationSchema = {
  body: z.object({
    company: z.string().trim().min(1).max(120).optional(),
    position: z.string().trim().min(1).max(120).optional(),
    location: z.string().trim().max(120).optional(),
    jobUrl: z.string().trim().optional(),
    status: z.enum(APPLICATION_STATUSES).optional(),
    priority: z.enum(APPLICATION_PRIORITIES).optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    workMode: z.enum(WORK_MODES).optional(),
    salaryMin: z.coerce.number().min(0).nullable().optional(),
    salaryMax: z.coerce.number().min(0).nullable().optional(),
    currency: z.string().trim().optional(),
    dateApplied: z.coerce.date().optional(),
    source: z.string().trim().max(60).optional(),
    contactName: z.string().trim().max(100).optional(),
    contactEmail: z.string().trim().max(100).optional(),
    contactPhone: z.string().trim().max(40).optional(),
    notes: z.string().optional(),
    resumeUrl: z.string().optional(),
    coverLetterUrl: z.string().optional(),
    tags: z.array(z.string().trim()).optional(),
    followUpDate: z.coerce.date().nullable().optional(),
  }),
};

export const listApplicationQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    status: z.string().trim().optional(),
    priority: z.string().trim().optional(),
    workMode: z.string().trim().optional(),
    employmentType: z.string().trim().optional(),
    source: z.string().trim().optional(),
    tag: z.string().trim().optional(),
    sortBy: z.string().trim().default('dateApplied'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
};
