module.exports = {
  HOST:
    process.env.NODE_ENV === "production" ? process.env.DB_HOST : "localhost",
  USER: process.env.NODE_ENV === "production" ? process.env.DB_USER : "root",
  PASSWORD: process.env.NODE_ENV === "production" ? process.env.DB_PWD : "",
  DB: process.env.DB_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
