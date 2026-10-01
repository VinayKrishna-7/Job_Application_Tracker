import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Application } from '../src/models/Application.js';

describe('Dashboard API Endpoints', () => {
  let authToken = '';

  beforeAll(async () => {
    await connectDB();

    const res = await request(app).post('/api/auth/register').send({
      name: 'Dashboard Tester',
      email: `dash_${Date.now()}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    authToken = res.body.data.token;

    // Create a couple applications
    await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        company: 'DashCorp',
        position: 'Engineer',
        status: 'Applied',
        source: 'LinkedIn',
        workMode: 'Remote',
      });

    await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        company: 'CloudCo',
        position: 'Architect',
        status: 'Offer',
        source: 'Referral',
        workMode: 'Hybrid',
      });
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    await Application.deleteMany({});
    await disconnectDB();
  });

  it('should return aggregated dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalApplications).toBe(2);
    expect(res.body.data.offers).toBe(1);
    expect(res.body.data.responseRate).toBeDefined();
  });

  it('should return application trends array', async () => {
    const res = await request(app)
      .get('/api/dashboard/application-trends?period=30d')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return status distribution', async () => {
    const res = await request(app)
      .get('/api/dashboard/status-distribution')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should return source distribution', async () => {
    const res = await request(app)
      .get('/api/dashboard/source-distribution')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return follow-up categorizations', async () => {
    const res = await request(app)
      .get('/api/dashboard/follow-ups')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.overdue).toBeDefined();
    expect(res.body.data.dueToday).toBeDefined();
    expect(res.body.data.upcoming).toBeDefined();
  });
});
