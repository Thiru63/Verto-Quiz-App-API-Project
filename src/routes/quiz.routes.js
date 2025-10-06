import express from "express";
import { createQuizController, getAllQuizzesController } from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/", createQuizController);      // Create quiz
router.get("/", getAllQuizzesController);    // List all quizzes

export default router;
