import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const COOKIE_NAME = 'easytrack_token';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const setAuthCookie = (res, token) => {
  const isProd = env.isProduction;
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

export const clearAuthCookie = (res) => {
  const isProd = env.isProduction;
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
  res.clearCookie(COOKIE_NAME, opts);
  res.clearCookie('jobtrack_token', opts);
};
