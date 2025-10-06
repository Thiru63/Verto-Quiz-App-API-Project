import Quiz from "../models/quiz.model.js";

export const createQuiz = async (title) => {
  const quiz = new Quiz({ title });
  return await quiz.save();
};


export const getAllQuizzes = async (page, limit) => {
  const skip = (page - 1) * limit;
  const quizzes = await Quiz.find()
    .select("id title createdAt")
    .skip(skip)
    .limit(limit);

  const total = await Quiz.countDocuments();

  return {
    quizzes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
