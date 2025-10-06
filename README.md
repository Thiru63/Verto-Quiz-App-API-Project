# Quiz Application API

A robust backend API for a simple quiz application built with Node.js, Express, and MongoDB. This application allows creating quizzes, adding questions, taking quizzes, and scoring submissions.

## Features

### Core Features
- ✅ **Quiz Management**: Create quizzes and add questions with multiple choice options
- ✅ **Quiz Taking**: Fetch quiz questions (without answers) and submit answers for scoring
- ✅ **Multiple Question Types**: Support for single choice, multiple choice, and text-based questions
- ✅ **RESTful API**: Clean, logical API design following REST principles

### Bonus Features
- ✅ **Question Validation**: Ensures correct answers based on question type
- ✅ **Quiz Listing**: Endpoint to retrieve all available quizzes with pagination
- ✅ **Comprehensive Testing**: Unit tests for all core functionality
- ✅ **Rate Limiting**: Protection against abuse with request rate limiting
- ✅ **Input Validation**: Robust validation for all endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Validation**: Built-in Mongoose validation with custom pre-save hooks
- **Security**: CORS, rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repository-url>
cd quiz-app-api
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/quizapp
PORT=5000
NODE_ENV=development
```

### 3. Database Setup
The application automatically connects to MongoDB using the connection string in your `.env` file.

### 4. Run the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Documentation

### Quiz Endpoints

#### Create a Quiz
```http
POST /api/quizzes
Content-Type: application/json

{
  "title": "JavaScript Fundamentals"
}
```

#### Get All Quizzes
```http
GET /api/quizzes?page=1&limit=10
```

### Question Endpoints

#### Add Question to Quiz
```http
POST /api/questions/:quizId
Content-Type: application/json

{
  "text": "What is 2+2?",
  "type": "single",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false }
  ]
}
```

#### Get Quiz Questions (Without Answers)
```http
GET /api/questions/:quizId?page=1&limit=10
```

#### Submit Quiz Answers
```http
POST /api/questions/:quizId/submit
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "question_id_here",
      "type": "single",
      "selectedOptions": ["option_id_here"]
    },
    {
      "questionId": "another_question_id",
      "type": "text",
      "answer": "Paris"
    }
  ]
}
```

## Question Types

### 1. Single Choice (`type: "single"`)
- Exactly one correct option required
- Example: Multiple choice with one right answer

### 2. Multiple Choice (`type: "multiple"`)  
- At least one correct option required
- Example: "Select all that apply" questions

### 3. Text-based (`type: "text"`)
- Free text answer with 300 character limit
- Case-insensitive comparison for scoring

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage
The test suite includes:
- Unit tests for quiz creation and management
- Integration tests for question operations
- Scoring logic tests for all question types
- Error handling and validation tests
- API endpoint tests

## Design Decisions & Assumptions

### Data Models
- **Quiz**: Simple model with title and timestamps
- **Question**: Embedded options with type validation
- **Options**: Subdocument with correct answer flags

### Validation
- Custom Mongoose pre-save hooks for question validation
- Input sanitization and type checking in controllers
- Rate limiting applied globally (5 req/sec, 100 req/min)

### Scoring Logic
- **Single Choice**: Exact match of correct option ID
- **Multiple Choice**: All correct options must be selected (no partial credit)
- **Text Answers**: Case-insensitive comparison with trimming
- **Missing Answers**: Treated as incorrect (no penalty)

### Security
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- No sensitive data exposure in responses
- Rate limiting to prevent abuse

### Testing Strategy
- In-memory MongoDB for isolated testing
- Test utilities for creating test data
- Comprehensive error case testing
- Coverage thresholds enforced

## Project Structure
```
src/
├── config/          # Database configuration
├── models/          # Mongoose models (Quiz, Question)
├── routes/          # Express routers
├── controllers/     # Route handlers
├── services/        # Business logic
└── tests/           # Test suites
```

## Error Handling
The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Resource created
- `400`: Validation error
- `404`: Resource not found
- `500`: Server error

## Rate Limiting
- **Per-second**: 5 requests per second per IP
- **Per-minute**: 100 requests per minute per IP

## Future Enhancements
- User authentication and authorization
- Quiz categories and tags
- Time-limited quizzes
- Advanced scoring options
- Analytics and reporting
- Question shuffling
- Image support for questions

## Contributing
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License
ISC License - feel free to use this project for learning and development purposes.