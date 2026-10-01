import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Application } from '../src/models/Application.js';
import { Interview } from '../src/models/Interview.js';

describe('Interview API Endpoints', () => {
  let user1Token = '';
  let user2Token = '';
  let user1AppId = '';
  let interviewId = '';

  beforeAll(async () => {
    await connectDB();

    // Register User 1
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'Interview Tester 1',
      email: `int_user1_${Date.now()}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    user1Token = res1.body.data.token;

    // Register User 2
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Interview Tester 2',
      email: `int_user2_${Date.now()}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    user2Token = res2.body.data.token;

    // Create an application for User 1
    const appRes = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        company: 'TechFlow',
        position: 'Backend Developer',
        status: 'Applied',
      });
    user1AppId = appRes.body.data.application._id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await disconnectDB();
  });

  it('should create an interview for user 1 application', async () => {
    const res = await request(app)
      .post('/api/interviews')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        applicationId: user1AppId,
        date: new Date(Date.now() + 86400000).toISOString(),
        type: 'Technical',
        round: 1,
        interviewer: 'Sarah Jenkins',
        meetingUrl: 'https://meet.google.com/xyz',
        notes: 'Coding and algorithm problem solving.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.interview.interviewer).toBe('Sarah Jenkins');
    interviewId = res.body.data.interview._id;
  });

  it('SECURITY: User 2 should NOT be able to schedule an interview on User 1 application', async () => {
    const res = await request(app)
      .post('/api/interviews')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        applicationId: user1AppId,
        date: new Date().toISOString(),
        type: 'HR',
      });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('APPLICATION_NOT_FOUND');
  });

  it('should list interviews for user 1', async () => {
    const res = await request(app)
      .get('/api/interviews')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.interviews.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.interviews[0].applicationId.company).toBe('TechFlow');
  });

  it('should update interview result and notes', async () => {
    const res = await request(app)
      .patch(`/api/interviews/${interviewId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        result: 'Passed',
        notes: 'Feedback was positive.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.interview.result).toBe('Passed');
  });

  it('SECURITY: User 2 should NOT be able to delete User 1 interview', async () => {
    const res = await request(app)
      .delete(`/api/interviews/${interviewId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);
  });

  it('should delete interview by owner', async () => {
    const res = await request(app)
      .delete(`/api/interviews/${interviewId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
