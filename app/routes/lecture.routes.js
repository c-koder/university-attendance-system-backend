const router = require("express").Router();
const LectureController = require("../controllers/lecture.controller");

const { authJwt } = require("../middleware");

router.get(
  "/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.getAllLectures
);

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.createLecture
);

router.post(
  "/generate-otp/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.generateOTP
);

router.put(
  "/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.updateLecture
);

router.put(
  "/update-start-time/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.updateStartTime
);

router.put(
  "/update-end-time/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.updateEndTime
);

router.delete(
  "/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  LectureController.deleteLecture
);

module.exports = router;
