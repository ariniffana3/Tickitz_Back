const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");

module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      const result = await movieModel.getAllMovie();
      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
