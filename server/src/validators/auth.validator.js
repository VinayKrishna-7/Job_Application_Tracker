import { z } from 'zod';

export const registerSchema = {
  body: z
    .object({
      name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
      email: z.string().trim().email('Invalid email address').toLowerCase(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
};
