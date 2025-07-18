const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

// Register a new buyer
authRouter.post("/register", authController.register);

// Login (admin or buyer)
authRouter.post("/login", authController.login);

// Logout
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
