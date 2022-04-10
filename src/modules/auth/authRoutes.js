const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/activation", authController.activation);
Router.post("/refresh", authController.refresh);
Router.post("/logout", authController.logout);

module.exports = Router;
