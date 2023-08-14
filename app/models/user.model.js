module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    full_name: {
      type: Sequelize.STRING,
    },
    department: {
      type: Sequelize.STRING,
    },
    reg_no: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
