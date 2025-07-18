const Order = require('../models/Order');


// GET all orders
// GET http://localhost:3000/api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username name role') // show linked user details
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create a new order
// POST http://localhost:3000/api/orders
const createOrder = async (req, res) => {
  try {
    const { item, paymentStatus } = req.body;
    const userId = req.user && req.user.id;

    if (!userId || !item) {
      return res.status(400).json({ error: 'Missing user info or item' });
    }

    // Limit to 200 Meals per day
    if (item === 'Meals') {
      const mealCount = await Order.countDocuments({ item: 'Meals' });
      if (mealCount >= 200) {
        return res.status(400).json({ error: 'Meal limit reached' });
      }
    }

    const newOrder = new Order({
      user: userId,
      item,
      paymentStatus
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH mark as served
// PATCH http://localhost:3000/api/orders/:id/serve
const markOrderAsServed = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: 'Completed' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username name role');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET all orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'username name role')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET orders on today
const getTodayOrders = async (req, res) => {
  try { 
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to start of next day

    let filter = {
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    };

    // If user is not admin, filter by their user id
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('user', 'username name role')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTodaysIncompleteOrders = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate today and tomorrow for date filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find incomplete orders created today
    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
      orderStatus: { $ne: 'Completed' }
    })
      .populate('user', 'username name role')
      .sort({ createdAt: -1 });

    res.json({ orders }); // wrap in object for frontend consistency
  } catch (err) {
    console.error("Error in getTodaysIncompleteOrders:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  getTodayOrders,
  getTodaysIncompleteOrders,
  createOrder,
  markOrderAsServed,
};
