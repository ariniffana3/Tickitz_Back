const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST_ONLINE,
  user: process.env.MYSQL_USER_ONLINE,
  password: process.env.MYSQL_PASSWORD_ONLINE,
  database: process.env.MYSQL_DATABASE_ONLINE,
  // host: process.env.MYSQL_HOST_LOCAL,
  // user: process.env.MYSQL_USER_LOCAL,
  // password: process.env.MYSQL_PASSWORD_LOCAL,
  // database: process.env.MYSQL_DATABASE_LOCAL,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('You"re now connected db mysql ...');
});
module.exports = connection;
