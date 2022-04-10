const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const { sendMail } = require("../../helper/mail");
const authModel = require("./authModel");
const redis = require("../../config/redis");

module.exports = {
  register: async (request, response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { firstName, lastName, noTelp, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.length >= 1 && checkEmail[0].status === "active") {
        return helperWrapper.response(
          response,
          404,
          "email has been used, please login",
          null
        );
      }
      if (checkEmail[0].length <= 0) {
        const saltRounds = 12;
        password = await bcrypt.hash(password, saltRounds);
        const setData = {
          id: uuidv4(),
          firstName,
          lastName,
          noTelp,
          email,
          password,
        };
        await authModel.register(setData);
      }
      const token = jwt.sign({ email }, "RAHASIA2", { expiresIn: "2h" });

      const setSendEmail = {
        to: email,
        subject: "Email verification",
        name: firstName,
        template: "verificationEmail.html",
        bottonUrl: token,
      };

      await sendMail(setSendEmail);
      // console.log(resultSendMail);

      // jika menggunakan nodemailer
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: `${process.env.EMAIL}`,
      //     pass: `${process.env.PASSEMAIL}`,
      //   },
      // });

      // const token = jwt.sign({ email }, "RAHASIA2", { expiresIn: "2h" });

      // const mailOptions = {
      //   from: `${process.env.EMAIL}`,
      //   to: email,
      //   subject: "Pesanfilm email verification",
      //   text: `copy this token quickly, its will expired in 2 hours ${token}`,
      // };

      // transporter.sendMail(mailOptions, (err) => {
      //   if (err) {
      //     return helperWrapper.response(
      //       response,
      //       400,
      //       "cannot verify this account",
      //       null
      //     );
      //   }
      // });
      if (checkEmail.length >= 1 && checkEmail[0].status === "notActive") {
        return helperWrapper.response(
          response,
          404,
          "You has been register before, pleaase activate, check your email",
          null
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Register success, please check your email to activate account !",
        null
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  activation: async (request, response) => {
    try {
      let { token } = request.params;
      // try cacth token dari request.params
      if (!token) {
        return helperWrapper.response(
          response,
          403,
          "please fill the token",
          null
        );
      }
      token = token.split(" ")[1];
      jwt.verify(token, "RAHASIA2", async (error, result) => {
        if (error) {
          return helperWrapper.response(response, 403, error.message, null);
        }
        const status = { status: "active" };
        const resultActivation = await authModel.activation(
          result.email,
          status
        );

        return helperWrapper.response(
          response,
          200,
          "Account Activated!",
          resultActivation
        );
      });
    } catch (error) {
      if (error) {
        return helperWrapper.response(response, 400, "bad request", null);
      }
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registered",
          null
        );
      }
      if (checkUser[0].status !== "active") {
        return helperWrapper.response(
          response,
          404,
          "Please activate email",
          null
        );
      }
      const result = await bcrypt.compare(password, checkUser[0].password);
      if (!result) {
        return helperWrapper.response(response, 404, "Wrong Password", null);
      }
      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      if (error) {
        return helperWrapper.response(response, 400, "Bad Request", null);
      }
    }
  },
  refresh: async (request, response) => {
    try {
      const refreshToken = request.params;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify({ refreshToken }, "RAHASIABARU", async (error, result) => {
        if (error) {
          return helperWrapper.response(response, 400, error.message, null);
        }
        // eslint-disable-next-line no-param-reassign
        delete result.iat;
        // eslint-disable-next-line no-param-reassign
        delete result.exp;
        const token = jwt.sign({ result }, "RAHASIA", { expiresIn: "24h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
