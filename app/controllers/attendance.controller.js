const db = require("../models");
const Attendance = db.attendance;
const User = db.user;
const Lecture = db.lecture;
const Course = db.course;

exports.generateAttendanceReport = async (req, res) => {
  const lectureId = req.params.lecture_id;

  try {
    const lectureAttendance = await Attendance.findAll({
      where: {
        lecture_id: lectureId,
      },
      include: [
        { model: User, attributes: ["id", "full_name", "reg_no"] },
        {
          model: Lecture,
          attributes: ["course_id", "date_time"],
          include: [{ model: Course, attributes: ["name"] }],
        },
      ],
    });

    if (!lectureAttendance) {
      return res.status(404).json({ message: "Attendance data not found" });
    }

    const attendanceReport = lectureAttendance.map((attendance) => ({
      id: attendance.id,
      user_id: attendance.user_id,
      full_name: attendance.user.full_name,
      reg_no: attendance.user.reg_no,
      course_name: attendance.lecture.course.name,
      hall: attendance.lecture.hall,
      date_time: attendance.lecture.date_time,
      verification_one: attendance.verification_one,
      verification_one_timestamp: attendance.verification_one_timestamp,
      verification_two: attendance.verification_two,
      verification_two_timestamp: attendance.verification_two_timestamp,
    }));

    res.status(200).json({ report: attendanceReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  const { lecture_id, index } = req.body;

  try {
    const student = await User.findOne({
      where: {
        reg_no: index,
      },
    });

    if (!student) {
      return res.status(400).json({
        message: "Student not found!",
      });
    }

    const user_id = student.id;

    const existingAttendance = await Attendance.findOne({
      where: {
        user_id: user_id,
        lecture_id: lecture_id,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already recorded for this user and lecture",
      });
    }

    const attendance = await Attendance.create({
      user_id,
      lecture_id,
      verification_one: true,
      verification_one_timestamp: new Date(),
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  const { user_id, course_id } = req.params;

  try {
    const lectureAttendance = await Attendance.findAll({
      where: {
        user_id: user_id,
      },
      include: [
        {
          model: Lecture,
          where: {
            course_id: course_id,
          },
          attributes: ["hall", "date_time"],
          include: [{ model: Course, attributes: ["name"] }],
        },
        {
          model: User,
          attributes: ["reg_no", "id"],
        },
      ],
      attributes: [
        "id",
        "verification_one",
        "verification_one_timestamp",
        "verification_two",
        "verification_two_timestamp",
      ],
    });

    if (!lectureAttendance || lectureAttendance.length === 0) {
      return res.status(404).json({ message: "Attendance data not found" });
    }

    const attendanceHistory = lectureAttendance.map((attendance) => ({
      id: attendance.id,
      user_id: user_id,
      full_name: attendance.user.full_name,
      reg_no: attendance.user.reg_no,
      course_name: attendance.lecture.course.name,
      hall: attendance.lecture.hall,
      date_time: attendance.lecture.date_time,
      verification_one: attendance.verification_one,
      verification_one_timestamp: attendance.verification_one_timestamp,
      verification_two: attendance.verification_two,
      verification_two_timestamp: attendance.verification_two_timestamp,
    }));

    res.status(200).json({ attendanceHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const userId = req.userId;
  const lectureId = req.params.lecture_id;
  const { otp } = req.body;

  try {
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.verification_code === parseInt(otp, 10)) {
      const attendance = await Attendance.findOne({
        where: {
          user_id: userId,
          lecture_id: lectureId,
          verification_one: true,
        },
      });

      if (!attendance) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      await attendance.update({
        verification_two: true,
        verification_two_timestamp: new Date(),
      });
      res.status(200).json({ message: "OTP verification successful" });
    } else {
      res.status(400).json({ message: "Incorrect OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
