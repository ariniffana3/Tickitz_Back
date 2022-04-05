const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
require("dotenv").config();

module.exports = {
  register: async (request, response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { firstName, lastName, noTelp, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.length >= 1 && checkEmail.status == "active") {
        return helperWrapper.response(
          response,
          404,
          "email has been used, please login",
          null
        );
      }
      if (checkEmail.length <= 0) {
        const saltRounds = 12;
        password = await bcrypt.hash(password, saltRounds);
        const setData = {
          firstName,
          lastName,
          noTelp,
          email,
          password,
        };
        await authModel.register(setData);
      }
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSEMAIL}`,
        },
      });

      const token = jwt.sign({ email }, "RAHASIA", { expiresIn: "2h" });

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: email,
        subject: "Pesanfilm email verification",
        text: `copy this token quickly, its will expired in 2 hours ${token}`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return helperWrapper.response(
            response,
            400,
            "cannot verify this account",
            null
          );
        }
      });

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
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(
        response,
        403,
        "please fill the token",
        null
      );
    }
    token = token.split(" ")[1];
    jwt.verify(token, "RAHASIA", async (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      const status = { status: "active" };
      const resultt = await authModel.activation(result.email, status);

      return helperWrapper.response(
        response,
        200,
        "Account verified!",
        resultt
      );
    });
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
      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
