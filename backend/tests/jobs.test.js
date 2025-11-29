const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/User');
const Job = require('../models/Job');

describe('Jobs', () => {
  let requesterToken;
  let requesterId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hire-nearby-test');
    
    // Create test requester
    const requester = new User({
      name: 'Test Requester',
      email: 'requester@test.com',
      passwordHash: 'password123',
      role: 'requester',
      city: 'San Francisco'
    });
    await requester.save();
    requesterId = requester._id;

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'requester@test.com',
        password: 'password123'
      });
    requesterToken = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/jobs', () => {
    it('should create a job', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({
          title: 'Test Job',
          description: 'Test description',
          category: 'cleaning',
          date: new Date().toISOString(),
          startTime: '10:00',
          durationHours: 2,
          city: 'San Francisco',
          lat: 37.7749,
          lng: -122.4194
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Test Job');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({
          title: 'Test Job'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/jobs', () => {
    it('should get list of jobs', async () => {
      const res = await request(app)
        .get('/api/jobs');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

