const router = require("express").Router({ mergeParams: true });
const { verify, isAdmin } = require("../middlewares/auth");
const { listByCourse, create } = require("../controllers/quizController");

router.get("/:courseId", verify, listByCourse);
router.post("/:courseId", verify, isAdmin, create);

module.exports = router;
