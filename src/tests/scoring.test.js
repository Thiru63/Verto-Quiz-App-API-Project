import { submitQuiz } from '../src/services/question.service.js';
import Question from '../src/models/question.model.js';
import mongoose from 'mongoose';

// Mock the Question model
jest.mock('../src/models/question.model.js');

describe('Scoring Logic', () => {
  let mockQuestions;
  let quizId;

  beforeEach(() => {
    quizId = new mongoose.Types.ObjectId();
    
    mockQuestions = [
      {
        _id: new mongoose.Types.ObjectId(),
        type: 'single',
        options: [
          { _id: new mongoose.Types.ObjectId(), text: 'Option 1', isCorrect: false },
          { _id: new mongoose.Types.ObjectId(), text: 'Option 2', isCorrect: true }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        type: 'multiple',
        options: [
          { _id: new mongoose.Types.ObjectId(), text: 'Option A', isCorrect: true },
          { _id: new mongoose.Types.ObjectId(), text: 'Option B', isCorrect: false },
          { _id: new mongoose.Types.ObjectId(), text: 'Option C', isCorrect: true }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        type: 'text',
        correctAnswer: 'correct answer'
      }
    ];

    Question.find.mockResolvedValue(mockQuestions);
  });

  it('should give full score for all correct answers', async () => {
    const answers = [
      {
        questionId: mockQuestions[0]._id.toString(),
        selectedOptions: [mockQuestions[0].options[1]._id.toString()]
      },
      {
        questionId: mockQuestions[1]._id.toString(),
        selectedOptions: [
          mockQuestions[1].options[0]._id.toString(),
          mockQuestions[1].options[2]._id.toString()
        ]
      },
      {
        questionId: mockQuestions[2]._id.toString(),
        answer: 'correct answer'
      }
    ];

    const result = await submitQuiz(quizId.toString(), answers);
    
    expect(result.score).toBe(3);
    expect(result.total).toBe(3);
  });

  it('should give zero for all wrong answers', async () => {
    const answers = [
      {
        questionId: mockQuestions[0]._id.toString(),
        selectedOptions: [mockQuestions[0].options[0]._id.toString()] // Wrong
      },
      {
        questionId: mockQuestions[1]._id.toString(),
        selectedOptions: [mockQuestions[1].options[1]._id.toString()] // Wrong
      },
      {
        questionId: mockQuestions[2]._id.toString(),
        answer: 'wrong answer' // Wrong
      }
    ];

    const result = await submitQuiz(quizId.toString(), answers);
    
    expect(result.score).toBe(0);
    expect(result.total).toBe(3);
  });

  it('should handle partial submission', async () => {
    const answers = [
      {
        questionId: mockQuestions[0]._id.toString(),
        selectedOptions: [mockQuestions[0].options[1]._id.toString()] // Correct
      }
      // Other questions not answered
    ];

    const result = await submitQuiz(quizId.toString(), answers);
    
    expect(result.score).toBe(1);
    expect(result.total).toBe(3);
  });

  it('should handle case insensitive text answers', async () => {
    const answers = [
      {
        questionId: mockQuestions[2]._id.toString(),
        answer: 'CORRECT ANSWER' // Correct but different case
      }
    ];

    const result = await submitQuiz(quizId.toString(), answers);
    
    expect(result.score).toBe(1);
  });
});