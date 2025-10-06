import request from 'supertest';
import app from '../src/app.js';
import { createTestQuiz, createTestQuestion } from './testUtils.js';

describe('Question API', () => {
  let quizId;

  beforeEach(async () => {
    const quiz = await createTestQuiz(app);
    quizId = quiz._id;
  });

  describe('POST /api/questions/:quizId', () => {
    it('should add a single choice question to quiz', async () => {
      const questionData = {
        text: 'What is 2+2?',
        type: 'single',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.text).toBe(questionData.text);
      expect(response.body.type).toBe('single');
      expect(response.body.options).toHaveLength(3);
      expect(response.body.quizId).toBe(quizId);
    });

    it('should add a multiple choice question to quiz', async () => {
      const questionData = {
        text: 'Which are programming languages?',
        type: 'multiple',
        options: [
          { text: 'JavaScript', isCorrect: true },
          { text: 'HTML', isCorrect: false },
          { text: 'Python', isCorrect: true },
          { text: 'CSS', isCorrect: false }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(201);

      expect(response.body.type).toBe('multiple');
    });

    it('should add a text-based question to quiz', async () => {
      const questionData = {
        text: 'Explain REST API in brief',
        type: 'text',
        correctAnswer: 'REST API is an architectural style for designing networked applications'
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(201);

      expect(response.body.type).toBe('text');
      expect(response.body.correctAnswer).toBe(questionData.correctAnswer);
      expect(response.body.options).toHaveLength(0);
    });

    it('should return 400 for invalid question type', async () => {
      const questionData = {
        text: 'Test question',
        type: 'invalid',
        options: [{ text: 'Option 1', isCorrect: true }]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if single choice has no correct option', async () => {
      const questionData = {
        text: 'Single choice with no correct',
        type: 'single',
        options: [
          { text: 'Option 1', isCorrect: false },
          { text: 'Option 2', isCorrect: false }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if text question exceeds character limit', async () => {
      const longAnswer = 'a'.repeat(350);
      const questionData = {
        text: 'Text question',
        type: 'text',
        correctAnswer: longAnswer
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send(questionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/questions/:quizId', () => {
    it('should fetch questions without correct answers', async () => {
      // Add a question first
      const questionData = {
        text: 'What is 2+2?',
        type: 'single',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true }
        ]
      };
      
      await createTestQuestion(app, quizId, questionData);

      const response = await request(app)
        .get(`/api/questions/${quizId}`)
        .expect(200);

      expect(response.body).toHaveProperty('questions');
      expect(response.body.questions).toHaveLength(1);
      
      const question = response.body.questions[0];
      expect(question.text).toBe(questionData.text);
      
      // Check that correct answers are hidden
      question.options.forEach(option => {
        expect(option).not.toHaveProperty('isCorrect');
      });
      expect(question).not.toHaveProperty('correctAnswer');
    });

    it('should return 404 for non-existent quiz', async () => {
      const fakeQuizId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/questions/${fakeQuizId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Quiz not found');
    });
  });
});