import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId,  required: true , unique:true , auto: true},
  title: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
