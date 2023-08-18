const router = require("express").Router();
const CourseController = require("../controllers/course.controller");

const { authJwt } = require("../middleware");

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 *
 */
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.getAllCourses
);

/**
 * @swagger
 * /course/{course_id}/students:
 *   get:
 *     summary: Get enrolled students for a specific course
 *     tags:
 *       - Course
 *     parameters:
 *       - name: course_id
 *         in: path
 *         required: true
 *         description: ID of the course to retrieve students for
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled students for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       404:
 *         description: Course not found
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 *
 */
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

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid request body or course name already in use
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 *
 */
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.createCourse
);

/**
 * @swagger
 * /course/enroll/{student_id}/{course_id}:
 *   post:
 *     summary: Enroll a student in a course
 *     tags:
 *       - Course
 *     parameters:
 *       - name: student_id
 *         in: path
 *         required: true
 *         description: ID of the student to enroll
 *         schema:
 *           type: integer
 *       - name: course_id
 *         in: path
 *         required: true
 *         description: ID of the course to enroll in
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request or student already enrolled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 */
router.post(
  "/enroll/:student_id/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.enrollStudent
);

/**
 * @swagger
 * /course/unenroll/{student_id}/{course_id}:
 *   post:
 *     summary: Un enroll a student in a course
 *     tags:
 *       - Course
 *     parameters:
 *       - name: student_id
 *         in: path
 *         required: true
 *         description: ID of the student to enroll
 *         schema:
 *           type: integer
 *       - name: course_id
 *         in: path
 *         required: true
 *         description: ID of the course to enroll in
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student un-enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request or student not enrolled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 */
router.delete(
  "/unenroll/:student_id/:course_id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.unEnrollStudent
);

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a course
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the course to update
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid request body or course name already in use
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       404:
 *         description: Course not found
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 */
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.updateCourse
);

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the course to delete
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require Lecturer or Admin Role
 *       404:
 *         description: Course not found
 *       500:
 *         description: Unable to validate Lecturer or Admin role!
 */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isLecturerOrAdmin],
  CourseController.deleteCourse
);

module.exports = router;
