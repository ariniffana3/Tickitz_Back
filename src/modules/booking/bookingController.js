const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");
const helperMidtrans = require("../../helper/midtrans");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const data = request.body;
      const dataCreate = {
        id: uuidv4(),
        ...data,
        totalTicket: data.seat.length,
        statusPayment: "Yet Paid",
      };
      delete dataCreate.seat;
      const result = await bookingModel.createBooking(dataCreate);
      data.seat.map(async (item) => {
        const bookingSeat = {
          id: uuidv4(),
          bookingId: result.id,
          seat: item,
        };
        await bookingModel.createBookingSeat(bookingSeat);
      });
      const setDataMidtrans = {
        id: result.id,
        total: 100000,
      };
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);

      const redirectUrl = { redirectUrl: resultMidtrans.redirect_url };
      await bookingModel.updateStatusBooking(result.id, redirectUrl);

      return helperWrapper.response(response, 200, "Success post data !", {
        id: result.id,
        ...request.body,
        redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      console.log(error);
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
      // console.log(request.body);
      // {
      //   "transaction_time": "2022-04-11 04:28:55",
      //   "transaction_status": "settlement",
      //   "transaction_id": "0eaadc94-26d2-4a8a-96b7-9d1e2ccee435",
      //   "status_message": "midtrans payment notification",
      //   "status_code": "200",
      //   "signature_key": "ae6e92d353d9796c080be04017f11463021979adab8a4ccb91272fd75e291c80009e0927415133f1cb46d5822492691873a57dfaad4dc54ffed74bb7ae6c61fe",
      //   "settlement_time": "2022-04-11 04:28:58",
      //   "payment_type": "bca_klikpay",
      //   "order_id": "8c5d510b-becc-4244-8457-c3b03fcaf68c",
      //   "merchant_id": "G284301233",
      //   "gross_amount": "100000.00",
      //   "fraud_status": "accept",
      //   "currency": "IDR",
      //   "approval_code": "112233"
      // }
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;
      const paymentType = result.payment_type;
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
          // id = orderId;
          const setData = {
            paymentMethod: paymentType,
            statusPayment: "PENDING",
            updatedAt: new Date(Date.now()),
          };
          const resultUpdate = await bookingModel.updateStatusBooking(
            orderId,
            setData
          );
          return helperWrapper.response(
            response,
            200,
            "succes get data !",
            resultUpdate
          );
        }
        if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
          // id = orderId;
          const setData = {
            paymentMethod: paymentType,
            statusPayment: "SUCCESS",
            updatedAt: new Date(Date.now()),
          };
          const resultUpdate = await bookingModel.updateStatusBooking(
            orderId,
            setData
          );
          return helperWrapper.response(
            response,
            200,
            "succes get data !",
            resultUpdate
          );
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
        // id = orderId;
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "SUCCESS",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "FAILED",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "FAILED",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "PENDING",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      }
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
