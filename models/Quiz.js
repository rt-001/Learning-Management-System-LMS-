const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        text: { type: String, required: true },
        options: [{ text: String, correct: Boolean }],
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Quiz", quizSchema);
