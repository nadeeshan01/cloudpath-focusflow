const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const JournalEntry = require('../src/models/JournalEntry');
const env = require('../src/config/env');

jest.mock('../src/models/User');
jest.mock('../src/models/Task');
jest.mock('../src/models/JournalEntry');

describe('Dashboard Endpoints', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const token = jwt.sign({ sub: mockUserId }, env.jwtSecret || 'test-secret');
  const mockUser = { _id: mockUserId, name: 'Test User', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    User.findById.mockResolvedValue(mockUser);
  });

  describe('Authentication & Protection', () => {
    it('rejects dashboard summary request without token', async () => {
      const response = await request(app).get('/api/v1/dashboard/summary');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects dashboard summary request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/dashboard/summary', () => {
    it('should return complete dashboard summary for authenticated user', async () => {
      const mockAggregateResult = [
        { _id: 'todo', count: 3 },
        { _id: 'in_progress', count: 2 },
        { _id: 'done', count: 5 },
      ];

      const mockRecentTasks = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          title: 'Recent Task 1',
          status: 'todo',
          priority: 'high',
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      const mockRecentJournals = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          title: 'Recent Journal 1',
          mood: 'great',
          tags: ['devops'],
          entryDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      Task.aggregate.mockResolvedValue(mockAggregateResult);
      Task.countDocuments
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);
      JournalEntry.countDocuments.mockResolvedValue(4);

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockRecentTasks),
          }),
        }),
      });

      JournalEntry.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockRecentJournals),
          }),
        }),
      });

      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const { taskCounts, journalCount, recentTasks, recentJournalEntries } = response.body.data;

      expect(taskCounts).toEqual({
        total: 10,
        todo: 3,
        inProgress: 2,
        done: 5,
        highPriority: 2,
        overdue: 1,
      });

      expect(journalCount).toBe(4);
      expect(recentTasks).toHaveLength(1);
      expect(recentTasks[0].title).toBe('Recent Task 1');
      expect(recentJournalEntries).toHaveLength(1);
      expect(recentJournalEntries[0].title).toBe('Recent Journal 1');
    });

    it('should return default counts when user has no tasks or journal entries', async () => {
      Task.aggregate.mockResolvedValue([]);
      Task.countDocuments.mockResolvedValue(0);
      JournalEntry.countDocuments.mockResolvedValue(0);

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      JournalEntry.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.taskCounts).toEqual({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        highPriority: 0,
        overdue: 0,
      });
      expect(response.body.data.journalCount).toBe(0);
      expect(response.body.data.recentTasks).toEqual([]);
      expect(response.body.data.recentJournalEntries).toEqual([]);
    });

    it('handles server errors during dashboard summary aggregation', async () => {
      Task.aggregate.mockRejectedValue(new Error('Database aggregation failed'));

      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });
});
