const router = require("express").Router();
const AttendanceController = require("../controllers/attendance.controller");

const { authJwt } = require("../middleware");

router.get(
  "/report/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  AttendanceController.generateAttendanceReport
);

router.post("/", [authJwt.verifyToken], AttendanceController.createAttendance);

router.post(
  "/verify-otp/:lecture_id",
  [authJwt.verifyToken],
  AttendanceController.verifyOTP
);

module.exports = router;
