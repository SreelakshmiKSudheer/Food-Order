const express = require('express');
const userRouter = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
// https://localhost:3000/api/user/profile
userRouter.get('/profile', verifyToken, getProfile);

// Support both legacy and current update endpoints
// https://localhost:3000/api/user/profile (frontend PUT)
userRouter.put('/profile', verifyToken, updateProfile);
// https://localhost:3000/api/user/profile/update (legacy)
userRouter.put('/profile/update', verifyToken, updateProfile);

module.exports = userRouter;