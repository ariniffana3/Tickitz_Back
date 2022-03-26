const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (limit, offset, searchMovieId, searchLocation, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        //  kalo pake full join yang tertampil id nya adalah id dari movie tapi createdAt tetap tertampil semua
        // kalo nama kolom di db diganti bisa tertampil semua
        // jika `SELECT sc.id, mv.id FROM schedule AS sc FULL error nya di full join
        // setelah ON tidak bisa menggunakan schedule.movieId
        //  `SELECT * FROM  schedule FULL JOIN  movie ON movieId = movie.id WHERE location like '%${searchLocation}%' AND movieId like '%${searchMovieId}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        // `SELECT * FROM  schedule JOIN  movie WHERE location like '%${searchLocation}%' AND movieId like '%${searchMovieId}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        // schedule.id tidak bisa digunakan
        // as juga tidak bisa digunakan karena akan error di selanjutnya
        // jika movie.id bisa berjalan karena from nya atau tuan rumahnya itu shedule, tapi kalo id saja tidak bisa dibilang id dari scedule
        // tapi kalo pake schedule.id ga bisa
        `SELECT * FROM schedule  FULL JOIN movie  ON movieId = movie.id WHERE location like '%${searchLocation}%' AND movieId like '%${searchMovieId}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id=?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
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
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id=?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
