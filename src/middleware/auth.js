const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;
    // console.log(token); isinya adalah
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.

    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

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
  },
  isAdmin: (request, response, next) => {
    if (request.decodeToken.role !== "admin") {
      return helperWrapper.response(
        response,
        403,
        "only admin can access",
        null
      );
    }
    return next();
  },
};
