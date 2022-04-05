const connection = require("../../config/mysql");

module.exports = {
  getUserByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT 
      user.id,
      user.firstName,
      user.lastName, 
      user.email,
      user.image,
      user.noTelp,
      user.status,
      user.password
       FROM user WHERE id=?`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
