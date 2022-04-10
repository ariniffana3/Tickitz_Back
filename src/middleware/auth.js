const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;
      // console.log(token); isinya adalah
      // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.

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
        // console.log(result); isinya sebagai berikut
        // {
        //   id: 2,
        //   firstName: 'budi',
        //   lastName: '',
        //   image: '',
        //   noTelp: '',
        //   email: 'doremi@gmail.com',
        //   role: 'user',
        //   status: 'active',
        //   createdAt: '2022-03-31T21:36:56.000Z',
        //   updatedAt: null,
        //   iat: 1648763396,
        //   exp: 1648849796
        // }
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
