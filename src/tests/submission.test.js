import request from 'supertest';
import app from '../src/app.js';
import { createTestQuiz, createTestQuestion } from './testUtils.js';

describe('Quiz Submission API', () => {
  let quizId;
  let question1, question2, question3;

  beforeEach(async () => {
    // Create quiz
    const quiz = await createTestQuiz(app, 'Test Quiz');
    quizId = quiz._id;

    // Add single choice question
    question1 = await createTestQuestion(app, quizId, {
      text: 'What is 2+2?',
      type: 'single',
      options: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false }
      ]
    });

    // Add multiple choice question
    question2 = await createTestQuestion(app, quizId, {
      text: 'Which are even numbers?',
      type: 'multiple',
      options: [
        { text: '2', isCorrect: true },
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false }
      ]
    });

    // Add text question
    question3 = await createTestQuestion(app, quizId, {
      text: 'Capital of France?',
      type: 'text',
      correctAnswer: 'Paris'
    });
  });

  describe('POST /api/questions/:quizId/submit', () => {
    it('should calculate score for all correct answers', async () => {
      const submissionData = {
        answers: [
          {
            questionId: question1._id,
            type: 'single',
            selectedOptions: [question1.options[1]._id] // Correct option for single choice
          },
          {
            questionId: question2._id,
            type: 'multiple',
            selectedOptions: [question2.options[0]._id, question2.options[2]._id] // Correct options for multiple
          },
          {
            questionId: question3._id,
            type: 'text',
            answer: 'Paris' // Correct answer for text
          }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send(submissionData)
        .expect(200);

      expect(response.body).toEqual({
        score: 3,
        total: 3
      });
    });

    it('should calculate score for partial correct answers', async () => {
      const submissionData = {
        answers: [
          {
            questionId: question1._id,
            type: 'single',
            selectedOptions: [question1.options[0]._id] // Wrong answer
          },
          {
            questionId: question2._id,
            type: 'multiple',
            selectedOptions: [question2.options[0]._id] // Partially correct (missing one correct option)
          },
          {
            questionId: question3._id,
            type: 'text',
            answer: 'paris' // Correct (case insensitive)
          }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send(submissionData)
        .expect(200);

      expect(response.body.score).toBe(1); // Only text question correct
      expect(response.body.total).toBe(3);
    });

    it('should return 400 for invalid answer structure', async () => {
      const submissionData = {
        answers: [
          {
            // Missing questionId
            type: 'single',
            selectedOptions: ['option1']
          }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send(submissionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty answers array', async () => {
      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send({ answers: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Answers must be a non-empty array');
    });

    it('should return 400 for missing type in answer', async () => {
      const submissionData = {
        answers: [
          {
            questionId: question1._id,
            selectedOptions: [question1.options[0]._id]
          }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send(submissionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle case sensitivity in text answers', async () => {
      const submissionData = {
        answers: [
          {
            questionId: question3._id,
            type: 'text',
            answer: '  PaRiS  ' // Correct with different case and spaces
          }
        ]
      };

      const response = await request(app)
        .post(`/api/questions/${quizId}/submit`)
        .send(submissionData)
        .expect(200);

      expect(response.body.score).toBe(1);
    });
  });
});