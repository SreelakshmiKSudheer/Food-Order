const express = require('express');
const userRouter = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
// https://localhost:3000/api/user/profile
userRouter.get('/profile', verifyToken, getProfile);

// https://localhost:3000/api/user/profile/update
userRouter.put('/profile/update', verifyToken, updateProfile);

module.exports = userRouter;