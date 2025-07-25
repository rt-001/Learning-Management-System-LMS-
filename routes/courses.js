const router = require("express").Router();
const { verify, isAdmin } = require("../middlewares/auth");
const {
  list,
  get,
  create,
  enroll,
} = require("../controllers/courseController");

router.get("/", verify, list);
router.get("/:id", verify, get);
router.post("/", verify, isAdmin, create);
router.post("/:id/enroll", verify, enroll);

module.exports = router;
