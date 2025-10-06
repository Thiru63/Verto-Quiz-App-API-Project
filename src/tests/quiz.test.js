import request from 'supertest';
import app from '../src/app.js';
import { createTestQuiz } from './testUtils.js';

describe('Quiz API', () => {
  describe('POST /api/quizzes', () => {
    it('should create a new quiz', async () => {
      const quizData = { title: 'JavaScript Basics' };
      
      const response = await request(app)
        .post('/api/quizzes')
        .send(quizData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(quizData.title);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Quiz title is required');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Quiz title is required');
    });
  });

  describe('GET /api/quizzes', () => {
    it('should return all quizzes with pagination', async () => {
      // Create test quizzes
      await createTestQuiz(app, 'Quiz 1');
      await createTestQuiz(app, 'Quiz 2');

      const response = await request(app)
        .get('/api/quizzes?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('quizzes');
      expect(response.body.quizzes).toHaveLength(2);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toMatchObject({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });

    it('should return empty array when no quizzes exist', async () => {
      const response = await request(app)
        .get('/api/quizzes')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'No quizzes found');
    });

    it('should handle pagination correctly', async () => {
      // Create 15 quizzes
      for (let i = 1; i <= 15; i++) {
        await createTestQuiz(app, `Quiz ${i}`);
      }

      const response = await request(app)
        .get('/api/quizzes?page=2&limit=5')
        .expect(200);

      expect(response.body.quizzes).toHaveLength(5);
      expect(response.body.pagination).toMatchObject({
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3
      });
    });
  });
});