const User = require("../models/User");
const College = require("../models/College");
const FoodItem = require("../models/FoodItem");
const FoodAvailability = require("../models/FoodAvailability");
const Order = require("../models/Order");

// https://localhost:3000/api/seller/fooditem
exports.createFoodItem = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            price,
            category,
            type,
            ingredients
        } = req.body;
        const sellerId = req.user.userId;

        // Validate required fields
        if (!name || !image || !price || !category || !type || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: "Missing required fields: name, image, price, category, type, ingredients" });
        }

        // Validate enums
        const validCategories = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
        const validTypes = ['Veg', 'Vegan', 'NonVeg'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category. Must be one of: " + validCategories.join(", ") });
        }
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: "Invalid type. Must be one of: " + validTypes.join(", ") });
        }

        const foodItem = new FoodItem({
            name,
            description,
            image,
            price,
            category,
            type,
            ingredients,
            seller: sellerId
        });
        await foodItem.save();
        res.status(201).json(foodItem);
    } catch (error) {
        console.error('Error creating food item:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/fooditem/:id
exports.deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        await FoodItem.findByIdAndDelete(id);
        res.status(200).json({ message: "Food item deleted" });
    } catch (error) {
        console.error('Error deleting food item:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/fooditem/:id/availability
exports.updateFoodAvailability = async (req, res) => {
    try {
        const { foodItemId } = req.params;
        const { available, initial } = req.body;
        let update = {};
        if (available !== undefined) update.available = available;
        if (initial !== undefined) update.initial = initial;
        const foodAvailability = await FoodAvailability.findOneAndUpdate(
            { foodid: foodItemId },
            update,
            { new: true, upsert: true }
        );
        res.status(200).json(foodAvailability);
    } catch (error) {
        console.error('Error updating food availability:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/orders/today
exports.viewTodaysOrders = async (req, res) => {
    try {
        const sellerId = req.user.userId;
        if (!sellerId) {
            return res.status(400).json({ error: "Missing sellerId in header" });
        }
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const orders = await Order.find({
            seller: sellerId,
            createdAt: { $gte: start, $lte: end }
        }).populate('customer foodItems');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error viewing today\'s orders:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/orders/history/:sellerId
exports.viewOrderHistory = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orders = await Order.find({ seller: sellerId }).populate('customer foodItems');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error viewing order history:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/customers/:sellerId
exports.listCustomers = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const customers = await Order.distinct('user', { seller: sellerId });
        const customerDetails = await User.find({ _id: { $in: customers } });
        res.status(200).json(customerDetails);
    } catch (error) {
        console.error('Error listing customers:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/orders/customer/:sellerId/:customerId
exports.listOrdersByCustomer = async (req, res) => {
    try {
        const { sellerId, customerId } = req.params;
        const orders = await Order.find({ seller: sellerId, user: customerId }).populate('foodItems');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error listing orders by customer:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/sales/summary/:sellerId
exports.summaryOfSale = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        // Only delivered orders for this seller
        const orders = await Order.find({ seller: sellerId, orderStatus: 'delivered' }).populate('foodItem');
        let totalSales = 0;
        let totalOrders = orders.length;
        for (const order of orders) {
            const price = order.foodItem ? order.foodItem.price : 0;
            totalSales += price * (order.quantity || 1);
        }
        res.status(200).json({ totalOrders, totalSales });
    } catch (error) {
        console.error('Error getting summary of sale:', error);
        res.status(400).json({ error: error.message });
    }
};

// https://localhost:3000/api/seller/order/:orderId/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;
        const validStatuses = ['placed', 'preparing', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: "Invalid order status." });
        }
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error editing order status:', error);
        res.status(400).json({ error: error.message });
    }
};