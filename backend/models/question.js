import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  questionText: { type: String, required: true },
  image: { type: String }, 
  options: [{ type: String, required: true }], 
  correctAnswer: { type: String, required: true }, 
  subject: { type: String } 
});

export default mongoose.model("Question", questionSchema);