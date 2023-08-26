const QuizSchema = require("../schemas/quizSchema");

const getUserQuiz = async (userId, quizId) => await QuizSchema.findOne({ userId: userId, quizId: quizId });

const createUserQuiz = async (userId, quizId) => {
  const userSchema = new QuizSchema({ userId, quizId });
  return await userSchema.save();
};

const getQuiz = async (userId, quizId) => {
  let user = await getUserQuiz(userId, quizId)
  if (!user) user = createUserQuiz(userId, quizId)
  return user
}

const saveQuiz = async (userId, quizId, answers = []) => {
  const filter = { userId: userId, quizId: quizId };
  const update = { $set: {answers: answers} };

  const updateOne = await QuizSchema.findOneAndUpdate(
    filter, update, { new: true }
  );
  return updateOne
};

module.exports = {
  getUserQuiz,
  createUserQuiz,
  saveQuiz,
  getQuiz,
};
