const session = require("express-session");

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  production: {
    dialect: process.env.DB_DIALECT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  test: {},

  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "your_default_session_secret",
  env: process.env.NODE_ENV || "development",
};
