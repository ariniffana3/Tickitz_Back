const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return helperWrapper.response(
          response,
          403,
          "please login first",
          null
        );
      }
      token = token.split(" ")[1];

      const checkRedis = await redis.get(`accessToken:${token}`);
      if (checkRedis) {
        return helperWrapper.response(
          response,
          403,
          "Your token is destroyed please login again",
          null
        );
      }

      jwt.verify(token, "RAHASIA", async (error, result) => {
        if (error) {
          return helperWrapper.response(response, 403, error.message, null);
        }
        request.decodeToken = result;
        return next();
      });
    } catch (error) {
      if (error) {
        return helperWrapper.response(response, 403, "bad request", null);
      }
    }
  },
  isAdmin: (request, response, next) => {
    try {
      if (request.decodeToken.role !== "admin") {
        return helperWrapper.response(
          response,
          403,
          "only admin can access",
          null
        );
      }
      return next();
    } catch (error) {
      if (error) {
        return helperWrapper.response(response, 403, "bad request", null);
      }
    }
  },
};
