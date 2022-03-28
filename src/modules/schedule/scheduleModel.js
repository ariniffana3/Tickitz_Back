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
        // SELECT * FROM schedule  FULL JOIN movie  ON movieId = movie.id WHERE location like '%${searchLocation}%' AND movieId like '%${searchMovieId}%' ORDER BY ${sort} LIMIT ? OFFSET ?
        `SELECT 
        sc.id,
        sc.movieId,
        sc.premiere,
        sc.price,
        sc.location,
        sc.dateStart,
        sc.dateEnd,
        sc.time,
        sc.createdAt,
        sc.updatedAt,
        mv.name,
        mv.category,
        mv.director,
        mv.cast,
        mv.releaseDate,
        mv.duration,
        mv.synopsis
        FROM schedule AS sc JOIN movie AS mv  
        ON sc.movieId = mv.id WHERE location like '%${searchLocation}%' AND movieId=? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [searchMovieId, limit, offset],
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
