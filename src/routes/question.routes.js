import express from "express";
import { addQuestionController, getQuizQuestionsController, submitQuizController } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/:quizId", addQuestionController);         // Add question to quiz
router.get("/:quizId", getQuizQuestionsController);     // Get quiz questions (no answers)
router.post("/:quizId/submit", submitQuizController);   // Submit answers

export default router;
