const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.post("/", bookingController.createBooking);
Router.patch("/ticket/:id", bookingController.updateStatusBooking);
Router.get("/id/:id", bookingController.getBookingByIdBooking);
Router.get("/seat/", bookingController.getSeatBooking);
Router.get("/dashboard/", bookingController.getDashboardBooking);

module.exports = Router;
