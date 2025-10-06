const express = require('express');
const buyerRouter = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isBuyer } = require('../middleware/roleMiddleware');

const { getProfile, updateProfile, getAllItems, filterItems, placeOrder, viewOrder, viewAllOrders, cancelOrder, viewOrdersByStatus, viewTodaysOrders } = require('../controllers/buyerController');

// https://localhost:3000/api/buyer/profile
buyerRouter.get('/profile', verifyToken, isBuyer, getProfile);

// https://localhost:3000/api/buyer/profile/update
buyerRouter.put('/profile/update', verifyToken, isBuyer, updateProfile);

// https://localhost:3000/api/buyer/items
buyerRouter.get('/items', verifyToken, isBuyer, getAllItems);

// https://localhost:3000/api/buyer/items?price=50&category=snacks&type=veg
buyerRouter.get('/items/filter', verifyToken, isBuyer, filterItems);

// https://localhost:3000/api/buyer/order
buyerRouter.post('/order', verifyToken, isBuyer, placeOrder);

// https://localhost:3000/api/buyer/order/:orderId
buyerRouter.get('/order/:orderId', verifyToken, isBuyer, viewOrder);

// https://localhost:3000/api/buyer/orders
buyerRouter.get('/orders', verifyToken, isBuyer, viewAllOrders);

// https://localhost:3000/api/buyer/order/:orderId/cancel
buyerRouter.delete('/order/:orderId/cancel', verifyToken, isBuyer, cancelOrder);

// https://localhost:3000/api/buyer/orders/status?status=placed
buyerRouter.get('/orders/status', verifyToken, isBuyer, viewOrdersByStatus);

// https://localhost:3000/api/buyer/orders/today
buyerRouter.get('/orders/today', verifyToken, isBuyer, viewTodaysOrders);

module.exports = buyerRouter;