const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      // ⚠️ INTENTIONAL FAILURE FOR WEEK 3 EVIDENCE
  // This test is designed to fail to demonstrate CI catching errors
      expect(response.body).toHaveProperty('status', 'FAILING_ON_PURPOSE');// Wrong value on purpose
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/version', () => {
    it('should return API version', async () => {
      const response = await request(app).get('/api/v1/version');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('apiVersion', 'v1');
    });
  });
});