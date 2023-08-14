const router = require("express").Router();
const AttendanceController = require("../controllers/attendance.controller");

const { authJwt } = require("../middleware");

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Mark attendance
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the student
 *               lecture_id:
 *                 type: integer
 *                 description: ID of the lecture
 *     responses:
 *       '201':
 *         description: Attendance created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/report/:lecture_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  AttendanceController.generateAttendanceReport
);

/**
 * @swagger
 * /attendance/report/{lecture_id}:
 *   get:
 *     summary: Generate attendance report
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: lecture_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Attendance report for the lecture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lecture:
 *                   $ref: '#/components/schemas/Lecture'
 *                 attendees:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *
 */
router.post("/", [authJwt.verifyToken], AttendanceController.createAttendance);

/**
 * @swagger
 * /attendance/verify-otp/{user_id}/{lecture_id}:
 *   post:
 *     summary: Verify OTP for attendance
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: lecture_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: OTP entered by the student
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP verification successful
 *       '400':
 *         description: Invalid OTP
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/verify-otp/:lecture_id",
  [authJwt.verifyToken],
  AttendanceController.verifyOTP
);

module.exports = router;
