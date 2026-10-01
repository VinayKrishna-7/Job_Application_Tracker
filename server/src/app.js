import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import applicationRoutes from './routes/application.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid local port friction
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Stricter limit for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

// Apply rate limiter to /api
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Serve local uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EasyTrack API is healthy and operational',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
