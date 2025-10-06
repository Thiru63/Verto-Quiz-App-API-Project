export const createTestQuiz = async (app, title = 'Test Quiz') => {
    const response = await request(app)
      .post('/api/quizzes')
      .send({ title });
    return response.body;
  };
  
  export const createTestQuestion = async (app, quizId, questionData) => {
    const response = await request(app)
      .post(`/api/questions/${quizId}`)
      .send(questionData);
    return response.body;
  };