require("rootpath")();
require("dotenv").config();

const express = require("express");
const morgon = require("morgan");

const app = express();

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");

const router = require("./app/routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgon("dev"));

app.use(
  cookieSession({
    name: "uas-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(function (err, req, res, next) {
  res.status(err.status || 404).send("Error: route doesn't exist!");
});

app.use("/api", router);

const db = require("./app/models");

const Role = db.role;

db.sequelize.sync().then(() => {
  // Role.create({
  //   id: 1,
  //   name: "student",
  // });
  // Role.create({
  //   id: 2,
  //   name: "lecturer",
  // });
  // Role.create({
  //   id: 3,
  //   name: "admin",
  // });
});

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 8080;

app.listen(port, () => console.log("Server listening on port " + port));
