const db = require("../models");
const Course = db.course;
const User = db.user;
const Role = db.role;

const { Op } = require("sequelize");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      include: [
        {
          model: db.role,
          where: { name: "Student" },
        },
      ],
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  const courseId = req.params.course_id;

  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "department", "email", "reg_no"],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrolledStudents = course.users;

    res.status(200).json(enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnEnrolledStudents = async (req, res) => {
  try {
    const unEnrolledStudents = await User.findAll({
      where: {
        id: {
          [Op.notIn]: db.sequelize.literal("(SELECT userId FROM user_courses)"),
        },
      },
      include: [
        {
          model: Role,
          where: { name: "student" },
        },
      ],
      attributes: ["id", "full_name", "department", "email", "reg_no"],
    });

    if (!unEnrolledStudents || unEnrolledStudents.length === 0) {
      return res.status(200).json({ message: "No unenrolled students found" });
    }

    res.status(200).json(unEnrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  const { name } = req.body;

  try {
    const course = await Course.findOrCreate({
      where: { name: name },
    });
    res.status(200).json(course);
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

    const isEnrolled = await student.hasCourse(course);
    if (isEnrolled) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in the course" });
    }

    await student.addCourse(course);

    res
      .status(200)
      .json({ message: "Student enrolled in the course successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unEnrollStudent = async (req, res) => {
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

    const isEnrolled = await student.hasCourse(course);
    if (!isEnrolled) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in the course" });
    }

    await student.removeCourse(course);

    res
      .status(200)
      .json({ message: "Student unenrolled from the course successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;

  try {
    let course = await Course.findAll({
      where: {
        name: name,
      },
    });

    if (course.length > 0) {
      return res
        .status(404)
        .json({ message: "Course with same name already exists" });
    }

    course = await Course.findByPk(courseId);

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
