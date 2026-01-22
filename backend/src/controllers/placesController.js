const BusRoute = require('../models/BusRoute');
const Place = require('../models/Place');
const { isPlaceNearStops } = require('../utils/geo');

// GET /api/places
const getPlaces = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const places = await Place.find(filter);
    return res.json(places);
  } catch (error) {
    console.error('getPlaces error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/places/along-route
const getPlacesAlongRoute = async (req, res) => {
  try {
    const { routeId, type } = req.query;
    if (!routeId || !type) {
      return res.status(400).json({ message: 'routeId and type are required' });
    }
    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    const places = await Place.find({ type });
    const near = places.filter((p) => isPlaceNearStops(p, route.stops, 5));
    return res.json(near);
  } catch (error) {
    console.error('getPlacesAlongRoute error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPlaces,
  getPlacesAlongRoute,
};
