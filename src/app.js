import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ 
  origin: "*",       // Allow all origins (use specific URL in prod, e.g. "http://localhost:3000")
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Rate Limiters
const perSecondLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5,         // limit each IP to 5 requests per second
  message: { error: "Too many requests per second. Please slow down." }
});

const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // limit each IP to 100 requests per minute
  message: { error: "Too many requests in a minute. Please try again later." }
});

// ✅ Apply rate limit globally
app.use(perSecondLimiter);
app.use(perMinuteLimiter);

// sample route
app.get("/", (req, res) => {
    res.send("Quiz API is running 🚀");
  });
  

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);

export default app;
