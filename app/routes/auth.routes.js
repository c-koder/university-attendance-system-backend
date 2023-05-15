const router = require("express").Router();
const Controller = require("../controllers/auth.controller");

const { verifySignUp } = require("../middleware");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  Controller.signup
);
router.post("/signin", Controller.signin);
router.post("/signout", Controller.signout);

module.exports = router;
