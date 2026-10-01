import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Test Auth User',
    email: `test_auth_${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  let authToken = '';

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    await disconnectDB();
  });

  it('should register a new user and return token and cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();

    authToken = res.body.data.token;
  });

  it('should prevent registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('EMAIL_EXISTS');
  });

  it('should validate password mismatch on registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mismatch',
        email: 'mismatch@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fetch current user profile via /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe(testUser.name);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject unauthenticated request to /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_REQUIRED');
  });

  it('should clear cookie upon logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
