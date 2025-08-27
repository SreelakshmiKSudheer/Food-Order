const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FoodAvailabilitySchema = new Schema({
    foodid: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    Date: { type: Date, required: true, default: Date.now },
    Available: { type: Number, required: true },
    Initial: { type: Number, required: true }
});

module.exports = mongoose.model('FoodAvailability', FoodAvailabilitySchema);