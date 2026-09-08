const request = require('supertest');
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
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toEqual([]);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.task).toHaveProperty('_id');
      expect(response.body.data.task.title).toBe(taskData.title);
    });

    it('should reject task without title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
