const express = require('express');
const sellerRouter = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isSeller } = require('../middleware/roleMiddleware');

const { createFoodItem, deleteFoodItem, updateFoodAvailability, viewTodaysOrders, viewOrderHistory, listCustomers, listOrdersByCustomer, updateOrderStatus, summaryOfSale } = require('../controllers/sellerController');

// https://localhost:3000/api/seller/fooditem
sellerRouter.post('/fooditem', verifyToken, isSeller, createFoodItem);

// https://localhost:3000/api/seller/fooditem/:id
sellerRouter.delete('/fooditem/:itemId', verifyToken, isSeller, deleteFoodItem);

// https://localhost:3000/api/seller/fooditem/:id/availability
sellerRouter.put('/fooditem/:foodItemId/availability', verifyToken, isSeller, updateFoodAvailability);

// https://localhost:3000/api/seller/orders/today
sellerRouter.get('/orders/today', verifyToken, isSeller, viewTodaysOrders);

// https://localhost:3000/api/seller/orders/history/:sellerId
sellerRouter.get('/orders/history/:sellerId', verifyToken, isSeller, viewOrderHistory);

// https://localhost:3000/api/seller/customers/:sellerId
sellerRouter.get('/customers/:sellerId', verifyToken, isSeller, listCustomers);

// https://localhost:3000/api/seller/orders/customer/:sellerId/:customerId
sellerRouter.get('/orders/customer/:sellerId/:customerId', verifyToken, isSeller, listOrdersByCustomer);

// https://localhost:3000/api/seller/order/:orderId/status
sellerRouter.put('/order/:orderId/status', verifyToken, isSeller, updateOrderStatus);

// https://localhost:3000/api/seller/sales/summary/:sellerId
sellerRouter.get('/sales/summary/:sellerId', verifyToken, isSeller, summaryOfSale);

module.exports = sellerRouter;