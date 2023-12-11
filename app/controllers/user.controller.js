const moment = require("moment");

const db = require("../models");

const Op = db.Sequelize.Op;

const User = db.user;
const Course = db.course;
const Attendance = db.attendance;

exports.viewProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "avatar",
        "full_name",
        "email",
        "department",
        "reg_no",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const currentDate = moment();

    const startOfWeek = currentDate.clone().startOf("week");
    const endOfWeek = currentDate.clone().endOf("week");
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");

    const studentAttendancePerWeek = await fetchAttendanceByDay(
      startOfWeek,
      endOfWeek
    );
    const studentAttendancePerMonth = await fetchAttendanceByDay(
      startOfMonth,
      endOfMonth
    );

    const attendanceCount = studentAttendancePerMonth.reduce(
      (acc, count) => acc + count,
      0
    );
    const courseCount = await Course.count();
    const studentCount = await User.count();

    return res.status(200).json({
      attendanceCount,
      courseCount,
      studentCount,
      studentAttendancePerWeek,
      studentAttendancePerMonth,
      message: "Analytics info fetched and sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchAttendanceByDay = async (startDate, endDate) => {
  const attendanceByDay = [];

  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = currentDate.clone().endOf("day");

    const attendanceCount = await Attendance.count({
      where: {
        verification_one_timestamp: {
          [Op.between]: [currentDate, nextDate],
        },
      },
    });

    attendanceByDay.push(attendanceCount);
    currentDate = currentDate.add(1, "day");
  }

  return attendanceByDay;
};

exports.getEnrolledCourses = async (req, res) => {
  const userId = req.userId;

  try {
    const student = await User.findByPk(userId, {
      include: [{ model: Course, attributes: ["id", "name"] }],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrolledCourses = student.courses;

    res.status(200).json({ enrolled_courses: enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { avatar, full_name, email, department, reg_no } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    user.avatar = avatar;
    user.full_name = full_name;
    user.email = email;
    user.department = department;
    user.reg_no = reg_no;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
