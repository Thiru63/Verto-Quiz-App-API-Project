import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId,  required: true , auto: true},
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId,  required: true , unique:true , auto: true},
  text: { type: String, required: true, maxlength: 300 },
  type: { 
    type: String, 
    enum: ["single", "multiple", "text"], 
    required: true 
  },
  options: [optionSchema],
  correctAnswer: { type: String }, // for text-based
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true }
}, { timestamps: true });

// 🔎 Custom validation
questionSchema.pre("save", function (next) {
  if (this.type === "single") {
    const correctCount = this.options.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1) {
      return next(new Error("Single choice question must have exactly one correct option."));
    }
  }

  if (this.type === "multiple") {
    const correctCount = this.options.filter(opt => opt.isCorrect).length;
    if (correctCount < 1) {
      return next(new Error("Multiple choice question must have at least one correct option."));
    }
  }

  if (this.type === "text") {
    if (!this.correctAnswer) {
      return next(new Error("Text-based question must have a correctAnswer field."));
    }
    if (this.correctAnswer.length > 300) {
      return next(new Error("Text-based correct answer cannot exceed 300 characters."));
    }
    if (this.options && this.options.length > 0) {
      return next(new Error("Text-based questions should not have options."));
    }
  }

  next();
});

export default mongoose.model("Question", questionSchema);
