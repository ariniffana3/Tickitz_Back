const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");

Router.use("/movie", movieRoutes);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
