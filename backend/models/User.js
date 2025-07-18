const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'buyer'], default: 'buyer' }
});

module.exports = mongoose.model('User', UserSchema);
