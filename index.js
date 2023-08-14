require("rootpath")();
require("dotenv").config();

const express = require("express");
const morgon = require("morgan");

const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const specs = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "University Attendance API",
      version: "1.0.0",
      description: "API documentation for the University Attendance system",
    },
    components: {
      schemas: {
        Course: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            full_name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            department: {
              type: "string",
            },
            reg_no: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Lecture: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            date_time: {
              type: "string",
              format: "date-time",
            },
            hall: {
              type: "string",
            },
            start_time: {
              type: "string",
              format: "date-time",
            },
            end_time: {
              type: "string",
              format: "date-time",
            },
            verification_code: {
              type: "integer",
            },
            verification_code_timestamp: {
              type: "string",
              format: "date-time",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Attendance: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            verification_one: {
              type: "boolean",
            },
            verification_one_timestamp: {
              type: "string",
              format: "date-time",
            },
            verification_two: {
              type: "boolean",
            },
            verification_two_timestamp: {
              type: "string",
              format: "date-time",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./app/routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
