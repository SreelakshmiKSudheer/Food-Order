const User = require("../models/User");
const College = require("../models/College");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Register user by role (buyer/seller)
 * @route   POST /api/auth/register/:role
 * @access  Public
 */
exports.registerByRole = async (req, res) => {
  try {
    const { role } = req.params;
    let { name, email, password, college } = req.body;

    if (!name || !email || !password || !college) {
      return res.status(400).json({ message: "Name, email, password, and college are required" });
    }
    // Remove the colon from the role parameter if present
    const cleanRole = role.replace(/^:/, "");
    if (!["buyer", "seller"].includes(cleanRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let collegeId = undefined;

    // Assuming you have a College model
    const College = require("../models/College");
    let collegeDoc = await College.findOne({ name: college });
    if (!collegeDoc) {
        collegeDoc = await College.create({ name: college });
    }
    collegeId = collegeDoc._id;


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: cleanRole,
      college: collegeId
    });

    // Create JWT token for the newly registered user
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        college: collegeId
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response with token and user info
    res.status(201).json({ 
      message: `Registered successfully as ${cleanRole}`,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        college: collegeId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { userId: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: { id: "admin", name: "Admin", role: "admin" }
      });
    }

    // Buyer/Seller login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.role === "buyer" || user.role === "seller") {
      const token = jwt.sign(
        { userId: user._id, role: user.role, college: user.college },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
        token,
        user: {
          id: user._id,
          name: user.name,  
          role: user.role,
          college: user.college
        }
      });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get list of colleges
// @route   GET /api/auth/colleges
// @access  Public
exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
