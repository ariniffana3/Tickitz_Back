const { v4: uuidv4 } = require("uuid");
const redis = require("../../config/redis");
const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, sort, searchName, searchRelease } = request.query;
      page = Number(page);
      limit = Number(limit);
      page = page || 1;
      limit = limit || 3;
      sort = sort || "RAND()";
      searchName = searchName || "";
      const offset = page * limit - limit;
      let totalData;
      searchRelease
        ? (totalData = await movieModel.getCountMovieAndRelease(
            searchName,
            searchRelease
          ))
        : (totalData = await movieModel.getCountMovie(searchName));
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      let result;

      searchRelease
        ? (result = await movieModel.getAllMovieAndRelease(
            limit,
            offset,
            sort,
            searchName,
            searchRelease
          ))
        : (result = await movieModel.getAllMovie(
            limit,
            offset,
            sort,
            searchName
          ));

      redis.setEx(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      if (totalData <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by searchName = ${searchName} not found`,
          null
        );
      }
      // console.log(request.decodeToken);
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        result,
        pageInfo
      );
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
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      // console.log(request.file); berisi
      // {
      //   fieldname: 'image',
      //   originalname: 'Brown >\x0E.jpg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   path: 'https://res.cloudinary.com/dabzupph0/image/upload/v1648767561/pesanfilm/bcnafemqhuw34dxbpahh.jpg',
      //   size: 163867,
      //   filename: 'pesanfilm/bcnafemqhuw34dxbpahh'
      // }
      const {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
      } = request.body;
      const setData = {
        id: uuidv4(),
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
      };
      const result = await movieModel.createMovie(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
      } = request.body;
      const resultMovieId = await movieModel.getMovieById(id);

      if (resultMovieId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id= ${id} not found`,
          null
        );
      }

      const newData = {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
        updatedAt: new Date(Date.now()),
      };
      if (request.file) {
        cloudinary.uploader.destroy(
          `${resultMovieId[0].image.split(".")[0]}`,
          (error) => {
            if (error) {
              return helperWrapper.response(response, 404, error.message, null);
            }
          }
        );
        // newData = {
        //   ...newData,
        //   image: `${request.file.filename}.${
        //     request.file.mimetype.split("/")[1]
        //   }`,
        // };
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const data in newData) {
        if (!newData[data]) {
          delete newData[data];
        }
      }
      const result = await movieModel.updateMovie(id, newData);
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
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const resultMovieId = await movieModel.getMovieById(id);

      if (resultMovieId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id = ${id} not found`,
          null
        );
      }
      cloudinary.uploader.destroy(
        `${resultMovieId[0].image.split(".")[0]}`,
        (error) => {
          if (error) {
            return helperWrapper.response(response, 404, error.message, null);
          }
        }
      );
      const result = await movieModel.deleteMovie(id);
      return helperWrapper.response(
        response,
        200,
        "succes delete data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
