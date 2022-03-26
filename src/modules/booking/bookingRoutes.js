const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

// Router.get("/", bookingController.getAllBooking);
// Router.get("/:id", bookingController.getBookingById);
Router.post("/", bookingController.createBooking);
// Router.patch("/:id", bookingController.updateBooking);
// Router.delete("/:id", bookingController.deleteBooking);

module.exports = Router;
