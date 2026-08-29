const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Link = require('../models/Link');

let authToken;
let testUserId;

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-link-test';
  await mongoose.connect(mongoUri);
  
  // Create test user and get token
  const testUser = new User({
    email: `test${Date.now()}@example.com`,
    password: 'test123456',
    name: 'Test User',
    plan: 'pro'
  });
  await testUser.save();
  testUserId = testUser._id;
  
  // Generate token manually for testing
  const jwt = require('jsonwebtoken');
  authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET || 'test-secret');
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({ email: /^test/ });
  await Link.deleteMany({ userId: testUserId });
  await mongoose.connection.close();
});

describe('Links Routes', () => {
  let createdLinkId;

  describe('POST /api/links', () => {
    it('should create a new short link', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'https://example.com',
          title: 'Test Link'
        })
        .expect(201);

      expect(res.body).toHaveProperty('link');
      expect(res.body.link).toHaveProperty('shortUrl');
      expect(res.body.link).toHaveProperty('shortCode');
      expect(res.body.link).toHaveProperty('qrCode');
      createdLinkId = res.body.link.id;
    });

    it('should create link with password protection (Pro plan)', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'https://example.com/secure',
          password: 'secure123',
          title: 'Protected Link'
        })
        .expect(201);

      expect(res.body.link).toHaveProperty('hasPassword', true);
    });

    it('should reject invalid URL', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'not-a-valid-url'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({
          originalUrl: 'https://example.com'
        })
        .expect(401);
    });
  });

  describe('GET /api/links', () => {
    it('should get all user links', async () => {
      const res = await request(app)
        .get('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('links');
      expect(Array.isArray(res.body.links)).toBe(true);
    });
  });

  describe('GET /api/links/:shortCode', () => {
    it('should get a specific link', async () => {
      // First create a link
      const createRes = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ originalUrl: 'https://example.com/test' });

      const shortCode = createRes.body.link.shortCode;

      const res = await request(app)
        .get(`/api/links/${shortCode}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.link).toHaveProperty('shortCode', shortCode);
    });
  });

  describe('PUT /api/links/:shortCode', () => {
    it('should update a link', async () => {
      const createRes = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ originalUrl: 'https://example.com/update' });

      const shortCode = createRes.body.link.shortCode;

      const res = await request(app)
        .put(`/api/links/${shortCode}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description'
        })
        .expect(200);

      expect(res.body.link.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/links/:shortCode', () => {
    it('should delete a link', async () => {
      const createRes = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ originalUrl: 'https://example.com/delete' });

      const shortCode = createRes.body.link.shortCode;

      await request(app)
        .delete(`/api/links/${shortCode}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});













