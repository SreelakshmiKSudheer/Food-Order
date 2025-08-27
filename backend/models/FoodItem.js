const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: [{ type: String, required: true }]
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);