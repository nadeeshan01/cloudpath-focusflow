const request = require('supertest');
const app = require('../src/app');

describe('Authentication endpoints', () => {
  test('register validation rejects invalid email', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Nadeeshan',
      email: 'not-an-email',
      password: 'FocusFlowSecure123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('login validation rejects a missing password', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'nadeeshan@example.com',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('protected endpoint rejects missing token', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
