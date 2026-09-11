const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const JournalEntry = require('../src/models/JournalEntry');
const env = require('../src/config/env');

jest.mock('../src/models/User');
jest.mock('../src/models/JournalEntry');

describe('Journal Endpoints', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const token = jwt.sign({ sub: mockUserId }, env.jwtSecret || 'test-secret');
  const mockUser = {
    _id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    User.findById.mockResolvedValue(mockUser);
  });

  describe('Authentication & Protection', () => {
    it('rejects journal list request without token', async () => {
      const response = await request(app).get('/api/v1/journal');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects journal creation request without token', async () => {
      const response = await request(app).post('/api/v1/journal').send({
        title: 'Unauthorized journal',
        content: 'Some content',
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('returns 401 for invalid authentication token', async () => {
      const response = await request(app)
        .get('/api/v1/journal')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/journal', () => {
    it('should return list of journal entries for authenticated user', async () => {
      JournalEntry.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app)
        .get('/api/v1/journal')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.entries)).toBe(true);
      expect(response.body.data.total).toBe(0);
    });
  });

  describe('POST /api/v1/journal', () => {
    it('should create a new journal entry with valid data and token', async () => {
      const entryData = {
        title: 'Daily Reflection',
        content: 'Had a productive day working on FocusFlow backend.',
        mood: 'great',
        tags: ['devops', 'backend'],
      };

      const createdEntry = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...entryData,
        owner: mockUserId,
        entryDate: new Date().toISOString(),
      };

      JournalEntry.create.mockResolvedValue(createdEntry);

      const response = await request(app)
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${token}`)
        .send(entryData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.entry).toHaveProperty('_id');
      expect(response.body.data.entry.title).toBe(entryData.title);
    });

    it('should reject journal entry creation without required title', async () => {
      const response = await request(app)
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Missing title',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject journal entry creation without required content', async () => {
      const response = await request(app)
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Missing content',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/journal/:entryId', () => {
    it('should return 400 for invalid journal entry ID format', async () => {
      const response = await request(app)
        .get('/api/v1/journal/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 when journal entry is not found', async () => {
      const validObjectId = new mongoose.Types.ObjectId().toString();
      JournalEntry.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/v1/journal/${validObjectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 200 and journal entry when found', async () => {
      const validObjectId = new mongoose.Types.ObjectId().toString();
      const mockEntry = {
        _id: validObjectId,
        title: 'Morning Journal',
        content: 'Planning the day ahead.',
        owner: mockUserId,
      };

      JournalEntry.findOne.mockResolvedValue(mockEntry);

      const response = await request(app)
        .get(`/api/v1/journal/${validObjectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.entry.title).toBe(mockEntry.title);
    });
  });

  describe('PATCH /api/v1/journal/:entryId', () => {
    it('should update journal entry successfully', async () => {
      const validObjectId = new mongoose.Types.ObjectId().toString();
      const updatedEntry = {
        _id: validObjectId,
        title: 'Updated Journal Title',
        content: 'Updated content.',
        owner: mockUserId,
      };

      JournalEntry.findOneAndUpdate.mockResolvedValue(updatedEntry);

      const response = await request(app)
        .patch(`/api/v1/journal/${validObjectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Journal Title' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.entry.title).toBe('Updated Journal Title');
    });
  });

  describe('DELETE /api/v1/journal/:entryId', () => {
    it('should delete journal entry successfully', async () => {
      const validObjectId = new mongoose.Types.ObjectId().toString();
      JournalEntry.findOneAndDelete.mockResolvedValue({ _id: validObjectId });

      const response = await request(app)
        .delete(`/api/v1/journal/${validObjectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Journal entry deleted successfully');
    });
  });
});
