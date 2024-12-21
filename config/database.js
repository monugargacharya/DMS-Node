const sql = require("mysql2");
require("dotenv").config();

const conn = sql.createPool({
  connectionLimit: 50,
  queueLimit: 500,
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DBdatabase,
  port: process.env.DBport,
  multipleStatements: true,
  connectTimeout: 60 * 60 * 1000,
});

module.exports = conn;
