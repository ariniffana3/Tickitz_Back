const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");
const helperMidtrans = require("../../helper/midtrans");
const qr = require("qrcode");
const cloudinary = require("cloudinary").v2;
const path = require("path");

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
        total: data.totalPayment,
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
      let result = await bookingModel.getBookingByUserId(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id ${id} not found`,
          null
        );
      }
      result = result.map((item) => {
        if (item.totalTicket * 1 > 1) {
          data = result.filter((item2) => {
            return item2.id == item.id && item2.seat !== item.seat;
          });
          data.map((a) => {
            item.seat = item.seat + ", " + a.seat;
          });
        }
        return item;
      });
      let result2 = result;
      result2.map((item) => {
        if (item.totalTicket * 1 > 1) {
          result2.map((item2, index) => {
            if (item.id == item2.id && item2.seat !== item.seat) {
              result.splice(index, 1);
            }
          });
        }
      });

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
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
      console.log(error);
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
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;
      const paymentType = result.payment_type;
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
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
          const options = {
            folder: "pesanfilm/imageQr",
          };
          var qrCode = "";
          qr.toDataURL(qrData, async (err, qrDataURL) => {
            if (err) throw err;

            await cloudinary.uploader.upload(
              qrDataURL,
              options,
              (error, result) => {
                if (error) {
                  console.error("Error uploading to Cloudinary:", error);
                } else {
                  qrCode = result.url;
                }
              }
            );
          });

          const setData = {
            paymentMethod: paymentType,
            statusPayment: "SUCCESS",
            qrCode,
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
        const options = {
          folder: "pesanfilm/imageQr",
        };
        var qrCode = "";
        qr.toDataURL(qrData, async (err, qrDataURL) => {
          if (err) throw err;

          await cloudinary.uploader.upload(
            qrDataURL,
            options,
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
              } else {
                qrCode = result.url;
              }
            }
          );
        });
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "SUCCESS",
          qrCode,
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
