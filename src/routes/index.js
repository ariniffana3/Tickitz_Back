const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const userRoutes = require("../modules/user/userRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);
Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);

module.exports = Router;

/// https://tickitzz.herokuapp.com
// https://github.com/microsoftarchive/redis/releases
// auth auth jwt redis multer
// uplouad file, bisa post, limit, file validation 500 kb 1 mb jpg png
// auth auth registrasi pake skema database, bycrpt, login, role user
// redis, postmannya di clear, opt refresh token, aktivasi, readme,
