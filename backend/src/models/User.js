const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // Role-based access: user | driver | admin
  role: {
    type: String,
    enum: ['user', 'driver', 'admin'],
    default: 'user',
  },
  // Assigned bus for approved drivers (used for live tracking)
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
