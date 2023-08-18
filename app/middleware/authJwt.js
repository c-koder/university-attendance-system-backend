const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.user;

verifyToken = (req, res, next) => {
  const token = req.header("Authorization") || req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isLecturer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "lecturer") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Lecturer Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Lecturer role!",
    });
  }
};

isLecturerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "lecturer") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Lecturer or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Lecturer or Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isLecturer,
  isLecturerOrAdmin,
};

module.exports = authJwt;
