const router = require("express").Router();
const UserController = require("../controllers/user.controller");

const { authJwt } = require("../middleware");

/**
 * @swagger
 * /user/{student_id}/courses:
 *   get:
 *     summary: Get enrolled courses of a student
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/courses",
  [authJwt.verifyToken],
  UserController.getEnrolledCourses
);

/**
 * @swagger
 * /user/{student_id}/profile:
 *   get:
 *     summary: Get student profile
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Student profile information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", [authJwt.verifyToken], UserController.viewProfile);

/**
 * @swagger
 * /user/{student_id}/profile:
 *   put:
 *     summary: Update student profile
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               reg_no:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated student profile information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 */
router.put("/profile", [authJwt.verifyToken], UserController.updateProfile);

module.exports = router;
