const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error) => {
        if (!error) {
          const newResult = {
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
      connection.query("INSERT INTO bookingseat SET ?", data, (error) => {
        if (!error) {
          resolve();
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE id=?",
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
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT 
        bk.id,
        bk.scheduleId,
        bk.dateBooking,
        bk.timeBooking,
        bk.totalTicket,
        bk.totalPayment,
        bk.paymentMethod,
        bk.statusPayment,
        bk.statusUsed,
        bk.qrCode,
        bks.seat,
        bk.createdAt,
        bk.updatedAt,
        mv.name,
        mv.category,
        sc.premiere
        FROM booking AS bk JOIN bookingseat AS bks ON bk.id COLLATE utf8mb4_unicode_ci =bks.bookingId
        JOIN schedule AS sc ON bk.scheduleId = sc.id 
        JOIN movie AS mv ON sc.movieId = mv.Id WHERE bk.userId =? ORDER BY createdAt DESC `,
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
  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
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

  getBookingByIdBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bk.id, 
        bk.scheduleId, 
        bk.dateBooking, 
        bk.timeBooking, 
        bk.totalTicket, 
        bk.totalPayment, 
        bk.paymentMethod, 
        bk.statusPayment, 
        bk.statusUsed, 
        bks.seat, 
        bk.createdAt, 
        bk.updatedAt, 
        mv.name, 
        mv.category 
        FROM booking AS bk
        JOIN bookingseat AS bks ON bk.id COLLATE utf8mb4_unicode_ci = bks.bookingId 
        JOIN schedule AS sc ON bk.scheduleId COLLATE utf8mb4_unicode_ci = sc.id 
        JOIN movie AS mv ON sc.movieId COLLATE utf8mb4_unicode_ci = mv.Id WHERE bk.Id = ?
`,
        id,
        // SELECT bk.id, bk.scheduleId, bk.dateBooking, bk.timeBooking, bk.totalTicket, bk.totalPayment, bk.paymentMethod, bk.statusPayment, bk.statusUsed, bks.seat, bk.createdAt, bk.updatedAt, mv.name, mv.category FROM booking AS bk JOIN bookingSeat AS bks ON bk.id=bks.bookingId JOIN schedule AS sc ON bk.scheduleId = sc.id JOIN movie AS mv ON sc.movieId = mv.Id WHERE bk.Id =3;
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT seat FROM booking AS bk
        JOIN bookingseat  AS bks ON bk.id = bks.bookingId  
        WHERE bk.dateBooking=?
        AND bk.timeBooking=? AND bk.scheduleId=?`,
        [dateBooking, timeBooking, scheduleId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboardBooking: (scheduleId, premiere, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(bk.createdAt) AS month, SUM(bk.totalPayment) AS total
         FROM booking AS bk JOIN schedule AS sc ON bk.ScheduleId = sc.id
         WHERE sc.id=${scheduleId} AND location=? AND premiere=? 
         GROUP BY MONTH(bk.createdAt)`,
        [location, premiere],
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
