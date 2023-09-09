require("rootpath")();
require("dotenv").config();

const express = require("express");
const morgon = require("morgan");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

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
const User = db.user;
const Course = db.course;

db.sequelize
  .sync()
  .then(async () => {
    const existingRoleCount = await Role.findAndCountAll();
    if (existingRoleCount.count === 0) {
      await Role.create({
        id: 1,
        name: "student",
      });
      await Role.create({
        id: 2,
        name: "lecturer",
      });
      await Role.create({
        id: 3,
        name: "admin",
      });
    }

    const existingUsersCount = await User.findAndCountAll();
    if (existingUsersCount.count === 0) {
      for (let i = 1; i <= 10; i++) {
        const user = await User.create({
          id: i,
          email: faker.internet.email(),
          password: bcrypt.hashSync(faker.internet.password(), 8),
          full_name: faker.person.fullName(),
          department: "CIS",
          reg_no: `18APC35${i.toString().padStart(2, "0")}`,
        });

        const studentRole = await Role.findOne({ where: { name: "student" } });
        if (studentRole) {
          await user.setRoles([studentRole.id]);
        }
      }
    }

    const existingCoursesCount = await Course.findAndCountAll();
    if (existingCoursesCount.count === 0) {
      const courseNames = [
        "Rapid Application Development",
        "Electronic Business Strategy, Architecture and Design",
        "Enterprise Architecture",
        "Management Information Systems",
        "IT Auditing",
        "Entrepreneurship and Innovation",
        "Software Engineering",
        "Data Communication and Networks",
        "Geographical Information Systems",
        "Advanced Database Systems",
        "Organizational Behavior and Management",
        "Agile Software Development",
        "Software Quality Assurance",
        "Design Patterns and Applications",
      ];

      for (let i = 1; i <= 10; i++) {
        await Course.create({
          id: i,
          name: courseNames[i - 1], // Subtract 1 to access the correct index
        });
      }
    }

    console.log("Data seeded...");
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 8080;

app.listen(port, () => console.log("Server listening on port " + port));
