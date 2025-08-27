const mongoose = require('mongoose');  

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foodItem: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    orderDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['placed', 'preparing', 'delivered', 'cancelled'], default: 'placed' }
});

module.exports = mongoose.model('Order', orderSchema);