const { Schema, model } = require("mongoose");

const QuizSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: String
      },
      answerId: {
        type: String
      },
    },
  ],
});

module.exports = model("Quiz", QuizSchema);
