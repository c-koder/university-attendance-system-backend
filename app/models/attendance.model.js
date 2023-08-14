module.exports = (sequelize, Sequelize) => {
  const Attendance = sequelize.define("attendance", {
    verification_one: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    verification_one_timestamp: {
      type: Sequelize.DATE,
    },
    verification_two: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    verification_two_timestamp: {
      type: Sequelize.DATE,
    },
  });

  return Attendance;
};
