const Progress = require("../models/Progress");
const Course = require("../models/Course");

const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const course = await Course.findById(courseId)
      .populate("lessons")
      .populate("quizzes");

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ msg: "User not enrolled in this course" });
    }
    if (!course) return res.status(404).json({ msg: "Course not found" });
    const totalLessons = course.lessons.length;
    const totalQuizzes = course.quizzes.length;
    const totalItems = totalLessons + totalQuizzes;
    const progress = await Progress.findOne({ user: userId, course: courseId });
    const completedLessons = progress?.completedLessons || [];
    const quizAttempts = progress?.quizAttempts || [];
    const attemptedQuizIds = quizAttempts.map((a) => a.quiz?.toString());
    const uniqueQuizAttempts = [...new Set(attemptedQuizIds)];
    const completedCount = completedLessons.length + uniqueQuizAttempts.length;
    const percentCompleted =
      totalItems > 0 ? Math.floor((completedCount / totalItems) * 100) : 0;
    res.json({
      completedLessons,
      percentCompleted,
    });
    return;
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ msg: "Get progress error" });
    return;
  }
};

const completeLesson = async (req, res) => {
  const { lessonId, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ msg: "User not enrolled in this course" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      { $addToSet: { completedLessons: lessonId } },
      { new: true, upsert: true }
    );

    res.json(progress);
    return;
  } catch (err) {
    console.error("Complete lesson error:", err);
    res.status(500).json({ msg: "Complete lesson error" });
    return;
  }
};

const attemptQuiz = async (req, res) => {
  const { quizId, score, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ msg: "User not enrolled in this course" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        $push: {
          quizAttempts: {
            quiz: quizId,
            score,
            date: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    res.json(progress);
    return;
  } catch (err) {
    console.error("Attempt quiz error:", err);
    res.status(500).json({ msg: "Attempt quiz error" });
    return;
  }
};

const seeQuizMarks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ msg: "User not enrolled in this course" });
    }
    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    }).populate("quizAttempts.quiz");

    if (!progress) return res.json({ quizAttempts: [] });

    const attempts = progress.quizAttempts.map((attempt) => ({
      quiz: attempt.quiz._id,
      score: attempt.score,
      date: attempt.date,
    }));

    res.json({ quizAttempts: attempts });
    return;
  } catch (err) {
    console.error("See quiz marks error:", err);
    res.status(500).json({ msg: "See quiz marks error" });
    return;
  }
};

module.exports = {
  getProgress,
  completeLesson,
  attemptQuiz,
  seeQuizMarks,
};
