const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new buyer
 * @access  Public
 */
// http://localhost:3000/api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({ message: "Username, name, and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name,
      password: hashedPassword,
      role: "buyer" // always buyer on register
    });

    res.status(201).json({ message: "Buyer registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login for admin or buyer
 * @access  Public
 */
// http://localhost:3000/api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔐 Admin login (from .env)
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { userId: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: { id: "admin", name: process.env.ADMIN_NAME, role: "admin" }
      });
    }

    // 👤 Buyer login
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (handled on client)
 * @access  Public
 */
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
