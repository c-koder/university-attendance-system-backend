const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

const { verifySignUp } = require("../middleware");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
  AuthController.signup
);

router.post("/signin", AuthController.signin);

router.post("/signout", AuthController.signout);

module.exports = router;
