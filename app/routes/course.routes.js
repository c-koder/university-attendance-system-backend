const router = require("express").Router();
const CourseController = require("../controllers/course.controller");

const { authJwt } = require("../middleware");

router.get(
  "/",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.getAllCourses
);

router.get(
  "/:course_id/students",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.getEnrolledStudents
);

router.get(
  "/no-students",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.getUnEnrolledStudents
);

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.createCourse
);

router.post(
  "/enroll/:student_id/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.enrollStudent
);

router.delete(
  "/unenroll/:student_id/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.unEnrollStudent
);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.updateCourse
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.deleteCourse
);

module.exports = router;
