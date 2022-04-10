const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.updateStatusBooking
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByIdBooking
);
Router.get(
  "/seat/",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.get(
  "/dashboard/",
  middlewareAuth.authentication,
  bookingController.getDashboardBooking
);
Router.get(
  "/user/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);

module.exports = Router;
