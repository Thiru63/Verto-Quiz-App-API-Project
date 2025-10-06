import { createQuiz, getAllQuizzes } from "../services/quiz.service.js";

// Create a new quiz
export const createQuizController = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Quiz title is required" });
    }

    const quiz = await createQuiz(title);
    res.status(201).json(quiz);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid quiz data", details: err.message });
    }
    res.status(500).json({ error: "Server error while creating quiz" });
  }
};

// Get all quizzes
export const getAllQuizzesController = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page=Number(page)||1
    limit=Number(limit)||10

    const result = await getAllQuizzes(page, limit);
    if (result.quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error while fetching quizzes" });
  }
};

