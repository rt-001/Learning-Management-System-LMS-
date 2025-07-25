const Course = require("../models/Course");

const list = async (req, res) => {
  try {
    const page = Math.max(1, +req.query.page || 1);
    const limit = Math.max(1, +req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [total, courses] = await Promise.all([
      Course.countDocuments(),
      Course.find().skip(skip).limit(limit),
    ]);

    res.json({ page, limit, total, courses });
    return;
  } catch (err) {
    console.error("Error listing courses:", err);
    res.status(500).json({ msg: "Error listing courses" });
    return;
  }
};

const get = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("lessons quizzes")
      .exec();

    if (!course) return res.status(404).json({ msg: "Course not found" });

    res.json(course);
    return;
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ msg: "Error fetching course" });
    return;
  }
};

const create = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
    return;
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ msg: "Error creating course" });
    return;
  }
};

const enroll = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ msg: "Course not found" });

    if (!course.enrolledStudents.includes(req.user.id)) {
      course.enrolledStudents.push(req.user.id);
      await course.save();
    } else {
      res.status(200).json({ msg: "User already enrolled", course });
      return;
    }
    res.status(200).json(course);
    return;
  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).json({ msg: "Error enrolling in course" });
    return;
  }
};

module.exports = { list, get, create, enroll };
