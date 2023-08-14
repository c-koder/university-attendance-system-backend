module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
    date_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    hall: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    start_time: {
      type: Sequelize.DATE,
    },
    end_time: {
      type: Sequelize.DATE,
    },
    verification_code: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    verification_code_timestamp: {
      type: Sequelize.DATE,
    },
  });

  return Lecture;
};
