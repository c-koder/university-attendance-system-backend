const db = require("../models");
const Course = db.course;
const User = db.user;

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  const courseId = req.params.course_id;

  try {
    const course = await Course.findByPk(courseId, {
      include: [{ model: User, attributes: ["id", "full_name", "reg_no"] }],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrolledStudents = course.users;

    res.status(200).json({ enrolled_students: enrolledStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  const { name } = req.body;

  try {
    const course = await Course.create({ name });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enrollStudent = async (req, res) => {
  const studentId = req.params.student_id;
  const courseId = req.params.course_id;

  try {
    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await student.addCourse(course);

    res
      .status(200)
      .json({ message: "Student enrolled in the course successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;

  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update({ name });

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
