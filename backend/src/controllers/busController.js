const BusRoute = require('../models/BusRoute');
const Bus = require('../models/Bus');
const { calculateFare } = require('../utils/fare');

// GET /api/bus/private-options
const getPrivateBusOptions = async (req, res) => {
  try {
    const { routeId, fromStop, toStop } = req.query;
    if (!routeId) {
      return res.status(400).json({ message: 'routeId is required' });
    }

    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const privateBuses = await Bus.find({ routeId, operatorType: 'private' });
    if (privateBuses.length === 0) {
      return res.json({ routeId, fromStop, toStop, buses: [] });
    }

    const busesWithFare = privateBuses.map((bus) => {
      const fare = calculateFare(bus, route, fromStop, toStop);
      return {
        _id: bus._id,
        name: bus.name,
        operatorType: bus.operatorType,
        frequencyMinutes: bus.frequencyMinutes,
        fare,
      };
    });

    return res.json({
      routeId,
      fromStop,
      toStop,
      buses: busesWithFare,
    });
  } catch (error) {
    console.error('getPrivateBusOptions error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/bus/route/:routeId
const getRouteDetails = async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    return res.json(route);
  } catch (error) {
    console.error('getRouteDetails error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/bus/:busId
const getBusById = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    return res.json(bus);
  } catch (error) {
    console.error('getBusById error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPrivateBusOptions,
  getRouteDetails,
  getBusById,
};
