module.exports = (sequelize, Sequelize) => {
  const Attendance = sequelize.define("attendance", {
    hall: {
      type: Sequelize.STRING,
    },
    datetime: {
      type: Sequelize.DATE,
    },
    verification_one: {
      type: Sequelize.BOOLEAN,
    },
    verification_one_timestamp: {
      type: Sequelize.DATE,
    },
    verification_two: {
      type: Sequelize.BOOLEAN,
    },
    verification_two_code: {
      type: Sequelize.INTEGER,
    },
    verification_two_timestamp: {
      type: Sequelize.DATE,
    },
  });

  return Attendance;
};
