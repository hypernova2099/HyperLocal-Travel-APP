const mongoose = require('mongoose');

const driverRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busNumber: { type: String, required: true },
  operatorName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DriverRequest', driverRequestSchema);

