const User = require("../models/User");
const College = require("../models/College");
const FoodItem = require("../models/FoodItem");
const FoodAvailability = require("../models/FoodAvailability");
const Order = require("../models/Order");

// profile 
// api/buyer/profile
exports.getProfile = async (req, res) => {
    try {
        // req.user is typically set by authentication middleware (e.g., JWT)
        const user = await User.findById(req.user.userId).select('-password').populate('college', 'name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, email, college, role } = user;
        res.status(200).json({ name, email, college, role });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// profile update
// api/buyer/profile/update
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, email, password, college } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (college) user.college = college;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
}
};

// get all items
// api/buyer/items
exports.getAllItems = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId);
        const collegeId = user.college;
        const sellerIds = await User.find({ role: 'seller', college: collegeId }).select('_id');
        const foodItems = await FoodItem.find({ seller: { $in: sellerIds } }).populate('seller', 'name email');
        const foodAvailability = await FoodAvailability.find({ foodId: { $in: foodItems.map(item => item._id) } });
        const foodItemsWithAvailability = foodItems.map(item => {
            const availability = foodAvailability.find(f => f.foodId.toString() === item._id.toString());
            return { ...item.toObject(), available: availability ? availability.available : 0 };
        });
        res.status(200).json(foodItemsWithAvailability);
    }catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// filter items by price and/or category
// api/buyer/items?price=50&category=snacks&type=veg
exports.filterItems = async (req, res) => {
    try {
        const { price, category, type } = req.query;
        const user = await User.findById(req.user.userId);
        const collegeId = user.college;
        const sellerIds = await User.find({ role: 'seller', college: collegeId }).select('_id');
        // Build filter object
        const filter = { seller: { $in: sellerIds } };
        if (price) filter.price = { $lte: price };
        if (category) filter.category = category;
        if (type) filter.type = type;
        const foodItems = await FoodItem.find(filter).populate('seller', 'name email');
        const foodAvailability = await FoodAvailability.find({ foodId: { $in: foodItems.map(item => item._id) } });
        const foodItemsWithAvailability = foodItems.map(item => {
            const availability = foodAvailability.find(f => f.foodId.toString() === item._id.toString());
            return { ...item.toObject(), available: availability ? availability.available : 0 };
        });
        res.status(200).json(foodItemsWithAvailability);
    } catch (error) {
        console.error('Error filtering food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// place order
// api/buyer/order
exports.placeOrder = async (req, res) => {
    try {
        const { foodId, quantity } = req.body; // Only one item per order
        if (!foodId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'foodId and valid quantity are required' });
        }
        const user = await User.findById(req.user.userId);
        const collegeId = user.college;
        const sellerIds = await User.find({ role: 'seller', college: collegeId }).select('_id');
        const foodItem = await FoodItem.findOne({ seller: { $in: sellerIds }, _id: foodId });
        if (!foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        const foodAvailability = await FoodAvailability.findOne({ foodId });
        const available = foodAvailability ? foodAvailability.available : 0;
        if (available < quantity) {
            return res.status(400).json({ error: 'Requested quantity not available', available });
        }
        // Place order
        const order = new Order({
            user: user._id,
            foodItem: { foodId, quantity },
            seller: foodItem.seller,
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// view order
// api/buyer/order/:orderId
exports.viewOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user.userId })
            .populate({
                path: 'items.foodId',
                model: 'FoodItem',
                select: 'name price category type'
            });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error viewing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// cancel order
// api/buyer/order/:orderId/cancel
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user.userId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({ error: 'Order is already cancelled' });
        }
        order.orderStatus = 'cancelled';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// view all orders
// api/buyer/orders
exports.viewAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate({
                path: 'items.foodId',
                model: 'FoodItem',
                select: 'name price'
            });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error viewing all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// view orders by status
// api/buyer/orders/status?status=placed
exports.viewOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await Order.find({ user: req.user.userId, orderStatus: status })
            .populate({
                path: 'items.foodId',
                model: 'FoodItem',
                select: 'name price'
            });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error viewing orders by status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// view orders by today
// api/buyer/orders/today
exports.viewTodaysOrders = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const orders = await Order.find({
            user: req.user.userId,
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        }).populate({
            path: 'items.foodId',
            model: 'FoodItem',
            select: 'name price'
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error viewing today\'s orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
