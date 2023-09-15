const router = require("express").Router();
const AttendanceController = require("../controllers/attendance.controller");

const { authJwt } = require("../middleware");

router.get(
  "/report/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  AttendanceController.generateAttendanceReport
);

router.get(
  "/history/:user_id/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  AttendanceController.getAttendanceHistory
);

router.post("/", [authJwt.verifyToken], AttendanceController.createAttendance);

router.post(
  "/verify-otp/:lecture_id",
  [authJwt.verifyToken],
  AttendanceController.verifyOTP
);

module.exports = router;
