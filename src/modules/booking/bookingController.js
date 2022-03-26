const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const data = request.body;
      const dataCreateBooking = {
        scheduleId: data.scheduleId,
        dateBooking: data.dateBooking,
        timeBooking: data.timeBooking,
        totalTicket: data.seat.length,
        totalPayment: data.totalPayment,
        paymentMethod: data.paymentMethod,
        statusPayment: "succes",
      };
      const result = await bookingModel.createBooking(dataCreateBooking);

      // eslint-disable-next-line no-plusplus
      for (let a = 0; a <= data.seat.length - 1; a++) {
        const bookingSeat = {
          bookingId: result.id,
          seat: data.seat[a],
        };
        // eslint-disable-next-line no-await-in-loop
        // eslint-disable-next-line no-await-in-loop
        const resultBookingSeat = await bookingModel.createBookingSeat(
          bookingSeat
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  //   getBookingByIdBooking: async (request, response) => {
  //     try {
  //       let { page, limit, searchMovieId, searchLocation, sort } = request.query;
  //       page = Number(page);
  //       limit = Number(limit);
  //       page = page || 1;
  //       limit = limit || 3;
  //       sort = sort || "RAND()";
  //       searchMovieId = searchMovieId || "";
  //       searchLocation = searchLocation || "";
  //       const offset = page * limit - limit;
  //       const totalData = await bookingModel.getCountBooking();
  //       const totalPage = Math.ceil(totalData / limit);
  //       const pageInfo = {
  //         page,
  //         totalPage,
  //         limit,
  //         totalData,
  //       };
  //       const result = await bookingModel.getAllBooking(
  //         limit,
  //         offset,
  //         searchMovieId,
  //         searchLocation,
  //         sort
  //       );
  //       return helperWrapper.response(
  //         response,
  //         200,
  //         "succes get data !",
  //         result,
  //         pageInfo
  //       );
  //     } catch (error) {
  //       console.log(error);
  //       return helperWrapper.response(response, 400, "bad request", null);
  //     }
  //   },
  //   getSeatBooking: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       const result = await bookingModel.getBookingById(id);

  //       if (result.length <= 0) {
  //         return helperWrapper.response(
  //           response,
  //           404,
  //           `Data by Id${id} not found`,
  //           null
  //         );
  //       }
  //       return helperWrapper.response(response, 200, "succes get data !", result);

  //       //   response.status(200);
  //       //   response.send("hello world");
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "bad request", null);
  //     }
  //   },
  //   getDashboardBooking: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       const result = await bookingModel.getBookingById(id);

  //       if (result.length <= 0) {
  //         return helperWrapper.response(
  //           response,
  //           404,
  //           `Data by Id${id} not found`,
  //           null
  //         );
  //       }
  //       return helperWrapper.response(response, 200, "succes get data !", result);

  //       //   response.status(200);
  //       //   response.send("hello world");
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "bad request", null);
  //     }
  //   },
  //   updateStatusBooking: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       const { movieId, premiere, price, location, dateStart, dateEnd, time } =
  //         request.body;
  //       const resultt = await bookingModel.getBookingById(id);

  //       if (resultt.length <= 0) {
  //         return helperWrapper.response(
  //           response,
  //           404,
  //           `Data by Id${id} not found`,
  //           null
  //         );
  //       }
  //       const newData = {
  //         movieId,
  //         premiere,
  //         price,
  //         location,
  //         dateStart,
  //         dateEnd,
  //         time,
  //         updatedAt: new Date(Date.now()),
  //       };
  //       // eslint-disable-next-line no-restricted-syntax
  //       for (const data in newData) {
  //         if (!newData) {
  //           delete newData[data];
  //         }
  //       }
  //       const result = await bookingModel.updateBooking(id, newData);
  //       return helperWrapper.response(
  //         response,
  //         200,
  //         "succes update data !",
  //         result
  //       );
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "bad request", null);
  //     }
  //   },
};
