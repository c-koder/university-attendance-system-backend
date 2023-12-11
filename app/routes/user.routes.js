const router = require("express").Router();
const UserController = require("../controllers/user.controller");

const { authJwt } = require("../middleware");

router.get(
  "/courses",
  [authJwt.verifyToken],
  UserController.getEnrolledCourses
);

router.get(
  "/analytics",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  UserController.getAnalytics
);

router.get("/profile", [authJwt.verifyToken], UserController.viewProfile);

router.put("/profile", [authJwt.verifyToken], UserController.updateProfile);

module.exports = router;
