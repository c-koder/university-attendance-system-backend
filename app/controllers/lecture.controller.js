const db = require("../models");
const Lecture = db.lecture;

exports.getAllLectures = async (req, res) => {
  try {
    const courseId = req.params.course_id;

    const lectures = await Lecture.findAll({
      where: {
        course_id: courseId,
      },
    });

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLecture = async (req, res) => {
  const { date_time, hall, course_id } = req.body;

  try {
    const lecture = await Lecture.create({ date_time, hall, course_id });
    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateOTP = async (req, res) => {
  try {
    const lectureId = req.params.lecture_id;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    lecture.verification_code = otp;
    lecture.verification_code_timestamp = new Date();

    await lecture.save();

    // Send the OTP to students (notification mechanism here)

    return res
      .status(200)
      .json({ message: "OTP generated and sent successfully", otp });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  const lectureId = req.params.lecture_id;
  const { date_time, hall } = req.body;

  try {
    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await lecture.update({ date_time, hall });

    res.status(200).json({ message: "Lecture updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStartTime = async (req, res) => {
  try {
    const lectureId = req.params.lecture_id;

    const { start_time } = req.body;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.start_time = start_time;
    await lecture.save();

    return res.status(200).json({ message: "Start time updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateEndTime = async (req, res) => {
  try {
    const lectureId = req.params.lecture_id;
    const { end_time } = req.body;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.end_time = end_time;
    await lecture.save();

    return res.status(200).json({ message: "End time updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  const lectureId = req.params.lecture_id;

  try {
    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await lecture.destroy();

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
