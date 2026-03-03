const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  fromStop: { type: String, required: true },
  toStop: { type: String, required: true },
  fare: { type: Number, required: true },
  status: {
    type: String,
    enum: ['booked', 'cancelled'],
    default: 'booked',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);

