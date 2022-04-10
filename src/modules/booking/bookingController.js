const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      let data = request.body;
      data = {
        ...data,
        statusPayment: "success",
      };
      const result = await bookingModel.createBooking(data);
      data.seat.map(async (item) => {
        const bookingSeat = {
          bookingId: result.id,
          seat: item,
        };
        await bookingModel.createBookingSeat(bookingSeat);
      });
      return helperWrapper.response(response, 200, "Success create data !", {
        ...result,
        ...data,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const { statusUsed } = request.body;
      const resultBookingId = await bookingModel.getBookingById(id);

      if (resultBookingId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id = ${id} not found`,
          null
        );
      }
      const newData = {
        statusUsed,
        updatedAt: new Date(Date.now()),
      };
      const result = await bookingModel.updateStatusBooking(id, newData);
      return helperWrapper.response(
        response,
        200,
        "succes update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingByUserId(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getBookingByIdBooking: async (request, response) => {
    try {
      const { id } = request.params;
      let data = await bookingModel.getBookingByIdBooking(id);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id ${id} not found`,
          null
        );
      }
      const seat = data.map((item) => item.seat);
      // eslint-disable-next-line no-unused-expressions
      data.length > 1 ? (data = { ...data[0], seat }) : data;
      return helperWrapper.response(response, 200, "succes get data !", data);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;
      let result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );
      result = result.map((item) => item.seat);
      if (result.length <= 0) {
        return helperWrapper.response(response, 404, `Data not found`, null);
      }
      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getDashboardBooking: async (request, response) => {
    try {
      const { scheduleId, premiere, location } = request.query;
      const result = await bookingModel.getDashboardBooking(
        scheduleId,
        premiere,
        location
      );
      if (result.length <= 0) {
        return helperWrapper.response(response, 404, `Data not found`, null);
      }
      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
