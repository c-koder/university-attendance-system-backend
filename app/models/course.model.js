module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("course", {
    semester: {
      type: Sequelize.INTEGER,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
    },
  });

  return Course;
};
