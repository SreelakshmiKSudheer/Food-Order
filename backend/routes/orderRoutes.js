const express = require('express');
const OrderRouter = express.Router();
const {
  getOrders,
  createOrder,
  markOrderAsServed,
  getTodayOrders,
  getOrderById,
  getTodaysIncompleteOrders,
  getOrdersByUserId
} = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin, isBuyer } = require('../middleware/roleMiddleware');

// http://localhost:3000/api/orders
OrderRouter.get('/' , verifyToken, isAdmin, getOrders);
// http://localhost:3000/api/orders
OrderRouter.post('/', verifyToken, isBuyer, createOrder); // only buyers can create order

// http://localhost:3000/api/orders/:id/serve
OrderRouter.patch('/:id/serve' , verifyToken, isAdmin, markOrderAsServed); // optional

// http://localhost:3000/api/orders/today
OrderRouter.get('/today', verifyToken, getTodayOrders);
// http://localhost:3000/api/orders/todayIncomplete
OrderRouter.get('/todayIncomplete', verifyToken, isAdmin, getTodaysIncompleteOrders);
OrderRouter.get('/:id', verifyToken, isBuyer, getOrderById);


// // http://localhost:3000/api/orders/:id
// OrderRouter.delete('/:id', verifyToken, isBuyer, getOrders); // only buyers can delete their own orders
// OrderRouter.put('/:id', verifyToken, isBuyer, getOrders); // only buyers can update their own orders


module.exports = OrderRouter;
