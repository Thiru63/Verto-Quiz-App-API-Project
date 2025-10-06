import { addQuestion, getQuizQuestions, submitQuiz } from "../services/question.service.js";
import Quiz from "../models/quiz.model.js";
import mongoose from "mongoose";

// Add a question to a quiz
export const addQuestionController = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, type, options, correctAnswer } = req.body;
    
    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required" });
    }
    const quiz = await Quiz.findOne({id:new mongoose.Types.ObjectId(quizId)});
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Question text is required" });
    }
    if (!type || !["single", "multiple", "text"].includes(type)) {
      return res.status(400).json({ error: "Question type must be single, multiple, or text" });
    }

    if (type !== "text" && (!options || options.length === 0)) {
      return res.status(400).json({ error: "Options are required for single/multiple choice questions" });
    }

    if (type === "text" && (!correctAnswer || correctAnswer.trim() === "")) {
      return res.status(400).json({ error: "Correct answer is required for text-based questions" });
    }

    const question = await addQuestion(quizId, req.body);
    res.status(201).json(question);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.message });
    }
    console.log(err)
    res.status(500).json({ error: "Server error while adding question" });
  }
};

// Fetch questions for a quiz (without correct answers)
export const getQuizQuestionsController = async (req, res) => {
  try {
    const { quizId } = req.params;
    let { page, limit } = req.query;

    page=Number(page)||1
    limit=Number(limit)||10

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required" });
    }

    const quiz = await Quiz.findOne({ id: quizId });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const result = await getQuizQuestions(quizId, page, limit);
    if (result.questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this quiz" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching quiz questions" });
  }
};

// Submit answers and calculate score
export const submitQuizController = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;
  
      // ✅ Validate quizId
      if (!quizId) {
        return res.status(400).json({ error: "Quiz ID is required" });
      }
  
      const quiz = await Quiz.findOne({id:quizId});
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
  
      // ✅ Validate answers array
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Answers must be a non-empty array" });
      }
  
      // ✅ Validate structure of each answer object
      for (const ans of answers) {
        if (!ans.questionId) {
          return res.status(400).json({ error: "Each answer must include questionId" });
        }
  
        if (!ans.type) {
          return res.status(400).json({ error: "Each answer must include type" });
        }
  
        if (ans.type === "single" || ans.type === "multiple") {
          if (!Array.isArray(ans.selectedOptions) || ans.selectedOptions.length === 0) {
            return res.status(400).json({ 
              error: `Question ${ans.questionId}: selectedOptions must be a non-empty array for type ${ans.type}` 
            });
          }
        }
  
        if (ans.type === "text") {
          if (typeof ans.answer !== "string" || ans.answer.trim() === "") {
            return res.status(400).json({ 
              error: `Question ${ans.questionId}: answer must be a non-empty string for type text` 
            });
          }
        }
      }
  
      // ✅ If everything is valid → score it
      const result = await submitQuiz(quizId, answers);
      return res.status(200).json(result);
  
    } catch (err) {
      console.error("Submit quiz error:", err.message);
      return res.status(500).json({ error: "Server error while submitting quiz" });
    }
  };
  
