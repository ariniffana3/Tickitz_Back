const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "tickitz",
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('You"re now connected db mysql ...');
});
module.exports = connection;
