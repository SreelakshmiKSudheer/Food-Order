const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');

// http://localhost:3000/api/
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

module.exports = router;