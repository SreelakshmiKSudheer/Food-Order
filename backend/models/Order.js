const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  paymentMethod: { type: String, enum: ['upi', 'on-time'], required: true },
  paymentStatus: { type: Boolean, default: false },
  orderStatus: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
