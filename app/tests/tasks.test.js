const request = require('supertest');
const app = require('../src/app');

describe('Task Endpoints', () => {
  describe('GET /api/v1/tasks', () => {
    it('should return empty task list initially', async () => {
      const response = await request(app).get('/api/v1/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(taskData.title);
    });

    it('should reject task without title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});