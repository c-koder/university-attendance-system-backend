const router = require("express").Router();

const UserRouter = require("./user.routes");
const AuthRouter = require("./auth.routes");
const CourseRouter = require("./course.routes");
const LectureRouter = require("./lecture.routes");
const AttendanceRouter = require("./attendance.routes");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/course", CourseRouter);
router.use("/lecture", LectureRouter);
router.use("/attendance", AttendanceRouter);

module.exports = router;
