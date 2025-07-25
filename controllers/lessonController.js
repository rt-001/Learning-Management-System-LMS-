const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

const listByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.json(lessons);
  } catch (err) {
    console.error("Error listing lessons:", err);
    res.status(500).json({ msg: "Error fetching lessons" });
  }
};

const create = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl || videoUrl.trim() === "") {
      return res.status(400).json({ msg: "Video URL is required" });
    }
    const trimmedUrl = videoUrl.trim();
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    const existingLesson = await Lesson.findOne({
      course: req.params.courseId,
      videoUrl: trimmedUrl,
    });
    if (existingLesson) {
      return res
        .status(409)
        .json({ msg: "Lesson with this video URL already exists" });
    }
    const lesson = new Lesson({
      course: req.params.courseId,
      ...req.body,
      videoUrl: trimmedUrl,
    });
    await lesson.save();
    course.lessons.push(lesson._id);
    await course.save();
    res.status(201).json(lesson);
    return;
  } catch (err) {
    console.error("Error creating lesson:", err);
    res.status(500).json({ msg: "Error creating lesson" });
    return;
  }
};

module.exports = {
  listByCourse,
  create,
};
