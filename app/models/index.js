const config = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  timezone: "+05:30",
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.course = require("../models/course.model.js")(sequelize, Sequelize);
db.lecture = require("../models/lecture.model.js")(sequelize, Sequelize);
db.attendance = require("../models/attendance.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.user.belongsToMany(db.course, { through: "user_courses" });
db.course.belongsToMany(db.user, { through: "user_courses" });

db.user.hasMany(db.attendance, {
  foreignKey: "user_id",
});

db.course.hasMany(db.lecture, {
  foreignKey: "course_id",
});

db.lecture.belongsTo(db.course, {
  foreignKey: "course_id",
});

db.lecture.hasMany(db.attendance, {
  foreignKey: "lecture_id",
});

db.attendance.belongsTo(db.user, {
  foreignKey: "user_id",
});

db.attendance.belongsTo(db.lecture, {
  foreignKey: "lecture_id",
});

db.ROLES = ["student", "lecturer", "admin"];

module.exports = db;
