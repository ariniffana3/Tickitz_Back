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

// ganti resultt dan result3
// error handling ditambahi
// masukkan token ke email

// apakah refeshToken kerjanya tanpa diketahui user,
// jika ya maka kita tak perlu menaruh refreshToken
// dalam logout, tapi apakah user bisa tahu refreshToken
