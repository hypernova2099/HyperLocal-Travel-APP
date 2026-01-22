const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  name: String,
  operatorType: String, // "private" | "ksrtc" | "metro"
  frequencyMinutes: Number,
  approxDurationMinutes: Number,
  baseFare: Number,
  farePerKm: Number,
});

module.exports = mongoose.model('Bus', busSchema);
