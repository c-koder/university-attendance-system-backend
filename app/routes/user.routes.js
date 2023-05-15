const router = require("express").Router();
const Controller = require("../controllers/user.controller");

const { authJwt } = require("../middleware");

router.get("/all", Controller.allAccess);
router.get("/student", [authJwt.verifyToken], Controller.studentBoard);
router.get(
  "/lecturer",
  [authJwt.verifyToken, authJwt.isLecturer],
  Controller.lecturerBoard
);
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  Controller.adminBoard
);

module.exports = router;
