const bcrypt = require("bcrypt");
const helperWrapper = require("../../helper/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getUserByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserByUserId(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      delete result[0].password;
      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const { firstName, lastName, noTelp } = request.body;
      const resultUserId = await userModel.getUserByUserId(id);

      if (resultUserId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      const newData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in newData) {
        if (!newData[data]) {
          delete newData[data];
        }
      }
      const result = await userModel.updateProfile(id, newData);
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
  updateImage: async (request, response) => {
    try {
      const { id } = request.params;
      const resultUserId = await userModel.getUserByUserId(id);

      if (resultUserId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      if (!request.file) {
        return helperWrapper.response(
          response,
          404,
          `No imege has been update`,
          null
        );
      }

      cloudinary.uploader.destroy(
        `${resultUserId[0].image.split(".")[0]}`,
        (error) => {
          if (error) {
            return helperWrapper.response(response, 404, error.message, null);
          }
        }
      );

      const newData = {
        image: `${request.file.filename}.${
          request.file.mimetype.split("/")[1]
        }`,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateProfile(id, newData);
      return helperWrapper.response(
        response,
        200,
        "succes update image !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      let { newPassword, confirmPassword } = request.body;
      const resultUserId = await userModel.getUserByUserId(id);
      const resultPassword = await bcrypt.compare(
        newPassword,
        resultUserId[0].password
      );
      let error = null;
      // eslint-disable-next-line no-unused-expressions
      !newPassword
        ? (error = `fill newPassword`)
        : newPassword !== confirmPassword
        ? (error = `newPassword and confirmPassword must match`)
        : resultUserId.length <= 0
        ? (error = `Data by Id${id} not found`)
        : resultPassword
        ? (error = `password must be different`)
        : null;

      if (error) {
        return helperWrapper.response(response, 404, error, null);
      }
      if (resultUserId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by Id${id} not found`,
          null
        );
      }
      const saltRounds = 12;
      newPassword = await bcrypt.hash(newPassword, saltRounds);
      const newData = {
        password: newPassword,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateProfile(id, newData);
      return helperWrapper.response(
        response,
        200,
        "succes update data !",
        result
      );
    } catch (error) {
      if (error) {
        return helperWrapper.response(response, 400, "bad request", null);
      }
    }
  },
};
