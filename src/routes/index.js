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

// ganti resultt dan result3-----sudah
// error handling ditambahi------sudah
// masukkan token ke email-------sudah
// mengubah database yang id
// uuid semua
// update password ?? masalahnya di refresh tokennya diketahui user ga
// midtrans belum dicoba
// user belum ditambahkan auth-----sudah
// tambahkan di postman notification untuk midtrans
// update profile id nya ambil dari token ?

// ini sebagai admin
// create movie----sudah diperbaiki blm di up
// update movie kadang bisa kadang tidak, id not found terus ??????? percobaan kedua blm berhasil
// create booking---------sudah diperbaiki blm di push
// get booking by id booking --------solved
// get booking by userId ------------solved
// register kadang bad request, kadang tidak bisa memfilter email
// refresh token menampilkan html error dari heroku---------------------------solved
// get user by userId juga tampil html heroku---------------------------------solved
// refreh token muncul html---------------------------------------------------sudah digantti jadi request.params
// activation blm ada tokennya------------------------------------------------solved

// muncul html heroku bisa lihat logs

// sebagai user
// create movie muncul html heroku

// dijalankan di lokal
// ditambahkan .file ke create movie---------------------------------------------solved
// update movie bisa cuma hati2 karena banyak yang kosong id nya
// create booking --------------------------------------------------------------solved
// get booking by id booking bisa
// get booking by userId bisa
// register ---------------------------------------------------------------------solved

// create booking ditambah total ticket

// https://git.heroku.com/pesanfilm.git
// https://pesanfilm.herokuapp.com/

// untuk remote redis remote
// redis-cli -h {host} -p {port} -a {password}

// admin doremi@gmail.com 1233
// user anaffiadiysor@gmail.com 123
// user budi@gmail.com 1
