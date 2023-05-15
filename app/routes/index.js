const router = require("express").Router();

const UserRouter = require("./user.routes");
const AuthRouter = require("./auth.routes");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

module.exports = router;
