const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareProfile = require("../../middleware/uploadImageProfile");

Router.get("/:id", userController.getUserByUserId);
Router.patch("/profile/:id", userController.updateProfile);
Router.patch("/image/:id", middlewareProfile, userController.updateImage);
Router.patch("/password/:id", userController.updatePassword);

module.exports = Router;
