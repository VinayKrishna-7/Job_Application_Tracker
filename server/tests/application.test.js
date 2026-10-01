import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Application } from '../src/models/Application.js';

describe('Application API Endpoints', () => {
  let user1Token = '';
  let user2Token = '';
  let user1AppId = '';

  beforeAll(async () => {
    await connectDB();

    // Register User 1
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: `user1_${Date.now()}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    user1Token = res1.body.data.token;

    // Register User 2
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: `user2_${Date.now()}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    user2Token = res2.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    await Application.deleteMany({});
    await disconnectDB();
  });

  it('should create a new job application for user 1', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        company: 'Acme Corp',
        position: 'Full Stack Engineer',
        location: 'Remote',
        status: 'Applied',
        priority: 'High',
        workMode: 'Remote',
        employmentType: 'Full-time',
        salaryMin: 120000,
        salaryMax: 150000,
        source: 'LinkedIn',
        tags: ['React', 'Node.js'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application.company).toBe('Acme Corp');
    expect(res.body.data.application._id).toBeDefined();

    user1AppId = res.body.data.application._id;
  });

  it('should list applications with pagination and metadata', async () => {
    const res = await request(app)
      .get('/api/applications?page=1&limit=10')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it('should search applications by keyword', async () => {
    const res = await request(app)
      .get('/api/applications?search=Acme')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].company).toBe('Acme Corp');
  });

  it('should retrieve single application details', async () => {
    const res = await request(app)
      .get(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.application._id).toBe(user1AppId);
    expect(res.body.data.application.company).toBe('Acme Corp');
  });

  it('should update application status and fields', async () => {
    const res = await request(app)
      .patch(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        status: 'Interview',
        notes: 'First round scheduled',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.application.status).toBe('Interview');
    expect(res.body.data.application.notes).toBe('First round scheduled');
  });

  it('SECURITY: User 2 should NOT be able to access User 1 application', async () => {
    const res = await request(app)
      .get(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('APPLICATION_NOT_FOUND');
  });

  it('SECURITY: User 2 should NOT be able to modify User 1 application', async () => {
    const res = await request(app)
      .patch(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ company: 'Hacked Corp' });

    expect(res.status).toBe(404);
  });

  it('SECURITY: User 2 should NOT be able to delete User 1 application', async () => {
    const res = await request(app)
      .delete(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);
  });

  it('should delete application by owner', async () => {
    const res = await request(app)
      .delete(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const verifyRes = await request(app)
      .get(`/api/applications/${user1AppId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(verifyRes.status).toBe(404);
  });
});
