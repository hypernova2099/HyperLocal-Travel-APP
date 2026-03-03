const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const BusRoute = require('../models/BusRoute');
const { calculateFare } = require('../utils/fare');

// POST /api/booking (authRequired)
const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { busId, routeId, fromStop, toStop } = req.body || {};

    if (!busId || !routeId || !fromStop || !toStop) {
      return res.status(400).json({
        message: 'busId, routeId, fromStop, and toStop are required',
      });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(400).json({ message: 'Invalid busId' });
    }

    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(400).json({ message: 'Invalid routeId' });
    }

    // Ensure bus actually belongs to the given route
    if (!bus.routeId || bus.routeId.toString() !== routeId) {
      return res.status(400).json({ message: 'Bus does not belong to this route' });
    }

    // Use the unified fare calculation so booking fare matches displayed fare
    const fare = calculateFare(bus, route, fromStop, toStop);

    const booking = await Booking.create({
      userId,
      busId,
      routeId,
      fromStop,
      toStop,
      fare,
    });

    console.log('Booking created:', booking._id.toString());
    return res.status(201).json(booking);
  } catch (error) {
    console.error('createBooking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
};

