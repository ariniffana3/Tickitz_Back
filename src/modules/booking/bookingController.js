const { uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");
const helperMidtrans = require("../../helper/midtrans");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const data = request.body;
      const dataCreate = {
        ...data,
        totalTicket: data.seat.length,
        statusPayment: "success",
      };
      delete dataCreate.seat;
      const result = await bookingModel.createBooking(dataCreate);
      data.seat.map(async (item) => {
        const bookingSeat = {
          bookingId: result.id,
          seat: item,
        };
        await bookingModel.createBookingSeat(bookingSeat);
      });
      const setDataMidtrans = {
        id: uuidv4(),
        total: 100000,
      };
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      return helperWrapper.response(response, 200, "Success post data !", {
        id: 1,
        ...request.body,
        redirectUrl: resultMidtrans.redirect_url,
      });
      // return helperWrapper.response(response, 200, "Success create data !", {
      //   ...result,
      //   ...data,
      // });
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
  postMidtransNotification: async (request, response) => {
    try {
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. 
        Order ID: ${orderId}. 
        Transaction status: ${transactionStatus}. 
        Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "PENDING",
            // updatedAt: ...
          };
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "SUCCESS",
            // updatedAt: ...
          };
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
        // id = orderId;
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "SUCCESS",
          // updatedAt: ...
        };
        console.log(
          `Sukses melakukan pembayaran dengan id ${orderId} 
          dan data yang diubah ${JSON.stringify(setData)}`
        );
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
      }
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
