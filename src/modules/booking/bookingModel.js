const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  createBookingSeat: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingseat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  //   getBookingByIdBooking: () =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         "SELECT COUNT(*) AS total FROM booking",
  //         (error, result) => {
  //           if (!error) {
  //             resolve(result[0].total);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
  //   getSeatBooking: (limit, offset, searchMovieId, searchLocation, sort) =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         // yang tertampil id nya adalah id dari movie
  //         `SELECT * FROM booking FULL JOIN movie ON movieId = movie.idformovie WHERE location like '%${searchLocation}%' AND movieId like '%${searchMovieId}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
  //         [limit, offset],
  //         (error, result) => {
  //           if (!error) {
  //             resolve(result);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
  //   getDashboardBooking: (id) =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         "SELECT * FROM booking WHERE id=?",
  //         id,
  //         (error, result) => {
  //           if (!error) {
  //             resolve(result);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
  //   updateStatusBooking: (id, data) =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         "UPDATE booking SET ? WHERE id = ?",
  //         [data, id],
  //         (error) => {
  //           if (!error) {
  //             const newResult = {
  //               id,
  //               ...data,
  //             };
  //             resolve(newResult);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
};
