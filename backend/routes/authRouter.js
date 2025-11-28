const express = require("express");
const authRouter = express.Router();
const { registerByRole, login, getColleges } = require("../controllers/authController");

// @desc    Register user (buyer or seller)
// @route   POST http://localhost:3000/api/auth/register/:role
authRouter.post("/register/:role", registerByRole);
// @desc    login user
// @route   POST http://localhost:3000/api/auth/login
authRouter.post("/login", login);

// @desc    Get list of colleges
// @route   GET http://localhost:3000/api/auth/colleges
authRouter.get("/colleges", getColleges);

module.exports = authRouter;
