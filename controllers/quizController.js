const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

const listByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
    return;
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ msg: "Error fetching quizzes" });
    return;
  }
};

const create = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { questions } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    for (const question of questions) {
      const { text, options } = question;
      if (!options || options.length === 0) {
        return res
          .status(400)
          .json({ msg: `Options missing for question: ${text}` });
      }
      const hasCorrect = options.some((opt) => opt.correct === true);
      if (!hasCorrect) {
        return res.status(400).json({
          msg: `At least one correct option is required for question: ${text}`,
        });
      }
      const duplicate = await Quiz.findOne({
        course: courseId,
        "questions.text": text,
      });
      if (duplicate) {
        return res.status(409).json({
          msg: `Quiz with question already exists for this course`,
        });
      }
    }
    const quiz = new Quiz({ course: courseId, questions });
    await quiz.save();
    course.quizzes.push(quiz._id);
    await course.save();
    res.status(201).json(quiz);
    return;
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ msg: "Error creating quiz" });
    return;
  }
};
module.exports = { listByCourse, create };
