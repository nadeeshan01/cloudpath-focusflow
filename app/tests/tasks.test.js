const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const env = require('../src/config/env');

// Database calls mock කිරීම (CI/CD වල database නැතුව tests run වීමට)
jest.mock('../src/models/User');
jest.mock('../src/models/Task');

describe('Task Endpoints', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const token = jwt.sign({ sub: mockUserId }, env.jwtSecret || 'test-secret');
  const mockUser = { _id: mockUserId, name: 'Test User', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    User.findById.mockResolvedValue(mockUser);
  });

  // 1. ඔයා හදපු Unauthorized Tests
  describe('Authentication & Protection', () => {
    it('rejects task list request without token', async () => {
      const response = await request(app).get('/api/v1/tasks');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects task creation request without token', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({
          title: 'Unauthorized task',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid token request', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/invalid-task-id')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });

  // 2. Task Fetching Tests
  describe('GET /api/v1/tasks', () => {
    it('should return empty task list initially', async () => {
      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });
  });

  // 3. Task Creation Tests
  describe('POST /api/v1/tasks', () => {
    it('should create a new task successfully with valid token', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
      };

      const createdTask = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...taskData,
        owner: mockUserId,
        status: 'todo',
      };

      Task.create.mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.task).toHaveProperty('_id');
      expect(response.body.data.task.title).toBe(taskData.title);
    });

    it('should reject task creation without title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});