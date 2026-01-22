const BusRoute = require('../models/BusRoute');
const Bus = require('../models/Bus');
const { distanceAlongStops } = require('../utils/geo');

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

    // Determine stop indices
    const findStopIndex = (name) => {
      if (!name) return -1;
      return route.stops.findIndex((s) => s.name?.toLowerCase() === name.toLowerCase());
    };
    const startIdx = findStopIndex(fromStop);
    const endIdx = findStopIndex(toStop);

    const validStart = startIdx !== -1 ? startIdx : 0;
    const validEnd = endIdx !== -1 ? endIdx : route.stops.length - 1;
    const distanceKm = distanceAlongStops(route.stops, Math.min(validStart, validEnd), Math.max(validStart, validEnd)) || 5;

    const busesWithFare = privateBuses.map((bus) => {
      const fare = Math.round((bus.baseFare || 10) + (bus.farePerKm || 2) * distanceKm);
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

// GET /api/bus/routes/:routeId
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

module.exports = {
  getPrivateBusOptions,
  getRouteDetails,
};
