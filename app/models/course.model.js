module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("course", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Course;
};
