const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
          };

          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  activation: (email, status) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE email =?`,
        [status, email],
        (error) => {
          if (!error) {
            resolve(status);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email =?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
