const db = require("../models");
const User = db.user;
const Course = db.course;

exports.viewProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "full_name", "email", "department", "reg_no"],
    });

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  const { full_name, email, department, reg_no } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

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
