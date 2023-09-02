const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit, searchMovieId, searchLocation, sort } = request.query;
      page = Number(page);
      limit = Number(limit);
      page = page || 1;
      limit = limit || 3;
      sort = sort || "id";
      searchMovieId = searchMovieId || "";
      searchLocation = searchLocation || "";
      const offset = page * limit - limit;
      const count = await scheduleModel.getCountSchedule(
        searchMovieId,
        searchLocation
      );
      const pageInfo = {
        page,
        totalPage: Math.ceil(count / limit),
        limit,
        totalData: count.length,
      };
      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchMovieId,
        searchLocation,
        sort
      );
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by searchMovieId= ${searchMovieId}, searchLocation${searchLocation} not found`,
          null
        );
      }
      redis.setEx(
        `getSchedule:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      return helperWrapper.response(
        response,
        200,
        "succes get data !",
        result,
        pageInfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      redis.setEx(`getSchedule:${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  createSchedule: async (request, response) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        id: uuidv4(),
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };
      const result = await scheduleModel.createSchedule(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const resultScheduleId = await scheduleModel.getScheduleById(id);

      if (resultScheduleId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      const newData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in newData) {
        if (!newData[data]) {
          delete newData[data];
        }
      }
      const result = await scheduleModel.updateSchedule(id, newData);
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
  deleteSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const resultScheduleId = await scheduleModel.getScheduleById(id);

      if (resultScheduleId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id ${id} not found`,
          null
        );
      }
      const result = await scheduleModel.deleteSchedule(id);
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
