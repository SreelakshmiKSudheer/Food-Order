const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
