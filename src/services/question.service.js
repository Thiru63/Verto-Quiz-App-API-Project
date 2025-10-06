import Question from "../models/question.model.js";

export const addQuestion = async (quizId, data) => {
  const question = new Question({ ...data, quizId });
  return await question.save();
};



export const getQuizQuestions = async (quizId, page, limit) => {
  const skip = (page - 1) * limit;
  const questions = await Question.find({ quizId })
    .select("-options.isCorrect -correctAnswer")
    .skip(skip)
    .limit(limit);

  const total = await Question.countDocuments({ quizId });

  return {
    questions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const submitQuiz = async (quizId, answers) => {
  const questions = await Question.find({ quizId });
  let score = 0;

  for (let q of questions) {
    const submitted = answers.find(a => a.questionId.toString() === q.id.toString());
    if (!submitted) continue;

    if (q.type === "single") {
      const correct = q.options.find(opt => opt.isCorrect);
      if (correct && submitted.selectedOptions[0] === correct.id.toString()) score++;
    }

    if (q.type === "multiple") {
      const correctIds = q.options.filter(opt => opt.isCorrect).map(o => o.id.toString());
      const selectedIds = submitted.selectedOptions.map(String);
      if (correctIds.length === selectedIds.length && correctIds.every(id => selectedIds.includes(id))) {
        score++;
      }
    }

    if (q.type === "text") {
      if (submitted.answer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    }
  }

  return { score, total: questions.length };
};
