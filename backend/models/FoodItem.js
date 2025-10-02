const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'] 
    },
    type: { type: String, required: true, enum: ['Veg', 'Vegan', 'NonVeg']  },
    ingredients: [{ type: String, required: true }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);