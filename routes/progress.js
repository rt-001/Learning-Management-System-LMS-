const router = require("express").Router();
const { verify } = require("../middlewares/auth");
const {
  getProgress,
  completeLesson,
  attemptQuiz,
  seeQuizMarks,
} = require("../controllers/progressController");

router.get("/:courseId", verify, getProgress);
router.post("/lesson", verify, completeLesson);
router.post("/quiz", verify, attemptQuiz);
router.get("/:courseId/quiz", verify, seeQuizMarks);

module.exports = router;
