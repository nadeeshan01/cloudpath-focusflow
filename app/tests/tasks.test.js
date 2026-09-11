const request = require('supertest');
<<<<<<< HEAD
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { signAccessToken } = require('../src/utils/jwt');

let token;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  await User.deleteMany({ email: 'test-tasks@example.com' });
  const user = await User.create({
    name: 'Task Test User',
    email: 'test-tasks@example.com',
    password: 'password123',
  });
  token = signAccessToken(user._id.toString());
});

afterAll(async () => {
  await User.deleteMany({ email: 'test-tasks@example.com' });
  await mongoose.disconnect();
});

describe('Task Endpoints', () => {
  describe('GET /api/v1/tasks', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/v1/tasks');
      expect(response.status).toBe(401);
    });

    it('should return empty task list for new user', async () => {
=======
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

>>>>>>> develop
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
<<<<<<< HEAD
      expect(response.body.data.tasks).toEqual([]);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
=======
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });
  });

  // 3. Task Creation Tests
  describe('POST /api/v1/tasks', () => {
    it('should create a new task successfully with valid token', async () => {
>>>>>>> develop
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
      };

<<<<<<< HEAD
=======
      const createdTask = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...taskData,
        owner: mockUserId,
        status: 'todo',
      };

      Task.create.mockResolvedValue(createdTask);

>>>>>>> develop
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.task).toHaveProperty('_id');
      expect(response.body.data.task.title).toBe(taskData.title);
    });

<<<<<<< HEAD
    it('should reject task without title', async () => {
=======
    it('should reject task creation without title', async () => {
>>>>>>> develop
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> develop
