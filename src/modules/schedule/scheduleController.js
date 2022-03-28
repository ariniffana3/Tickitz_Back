const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit, searchMovieId, searchLocation, sort } = request.query;
      page = Number(page);
      limit = Number(limit);
      page = page || 1;
      limit = limit || 3;
      sort = sort || "RAND()";
      searchMovieId = searchMovieId || "";
      searchLocation = searchLocation || "";
      const offset = page * limit - limit;

      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchMovieId,
        searchLocation,
        sort
      );
      const pageInfo = {
        page,
        totalPage: Math.ceil(result.length / limit),
        limit,
        totalData: result.length,
      };
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
      const resultt = await scheduleModel.getScheduleById(id);

      if (resultt.length <= 0) {
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
        if (!newData) {
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
      const resultt = await scheduleModel.getScheduleById(id);

      if (resultt.length <= 0) {
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
