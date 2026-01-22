const BusRoute = require('../models/BusRoute');
const Bus = require('../models/Bus');
const Place = require('../models/Place');
const { distanceAlongStops, isPlaceNearStops } = require('../utils/geo');

// Helper: find route loosely matching from/to
const findMatchingRoute = async (from, to) => {
  const query = {
    from: { $regex: from, $options: 'i' },
    to: { $regex: to, $options: 'i' },
  };
  let route = await BusRoute.findOne(query);
  if (!route) {
    // Try reverse order
    route = await BusRoute.findOne({
      from: { $regex: to, $options: 'i' },
      to: { $regex: from, $options: 'i' },
    });
  }
  return route;
};

// Helper: fetch places near stops for a given type
const fetchPlacesAlongRoute = async (route, type) => {
  if (!route) return [];
  const places = await Place.find({ type });
  return places.filter((p) => isPlaceNearStops(p, route.stops, 5));
};

// POST /api/trip/plan
const planTrip = async (req, res) => {
  try {
    const { from, to } = req.body || {};
    if (!from || !to) {
      return res.status(400).json({ message: 'from and to are required' });
    }

    const route = await findMatchingRoute(from, to);
    let buses = [];
    if (route) {
      buses = await Bus.find({ routeId: route._id });
    }

    const privateBuses = buses.filter((b) => b.operatorType === 'private');
    const metroBuses = buses.filter((b) => b.operatorType === 'metro');

    // Distance for calculations
    const totalDistanceKm = route ? distanceAlongStops(route.stops) || 10 : 10;

    // Build options array
    const options = [];

    // Private bus option if route exists and has private buses
    if (route && privateBuses.length > 0) {
      const minDuration =
        privateBuses.reduce((min, b) => Math.min(min, b.approxDurationMinutes || Infinity), Infinity) ||
        45;
      const firstBus = privateBuses[0];
      const fareEstimate = Math.round(
        (firstBus.baseFare || 10) + (firstBus.farePerKm || 2) * totalDistanceKm
      );
      const frequencyMinutes = privateBuses.reduce(
        (min, b) => Math.min(min, b.frequencyMinutes || Infinity),
        Infinity
      );

      const placesAlongRoute = {
        food: await fetchPlacesAlongRoute(route, 'food'),
        activities: await fetchPlacesAlongRoute(route, 'activity'),
        attractions: await fetchPlacesAlongRoute(route, 'attraction'),
      };

      options.push({
        mode: 'private-bus',
        routeId: route._id,
        summary: {
          durationMinutes: Number.isFinite(minDuration) ? minDuration : 45,
          fareEstimate,
          frequencyMinutes: Number.isFinite(frequencyMinutes) ? frequencyMinutes : 10,
        },
        placesAlongRoute,
      });
    }

    // Auto/Taxi option always
    const autoDuration = Math.max(15, Math.round((totalDistanceKm / 25) * 60)); // assume 25 km/h
    const autoFare = Math.round(15 * totalDistanceKm + 30); // base + per km
    const autoPlaces = route
      ? {
          food: await fetchPlacesAlongRoute(route, 'food'),
          activities: await fetchPlacesAlongRoute(route, 'activity'),
          attractions: await fetchPlacesAlongRoute(route, 'attraction'),
        }
      : { food: [], activities: [], attractions: [] };
    options.push({
      mode: 'auto',
      summary: { durationMinutes: autoDuration, fareEstimate: autoFare },
      placesAlongRoute: autoPlaces,
    });

    // Metro option only if metro buses exist
    if (route && metroBuses.length > 0) {
      const minDuration =
        metroBuses.reduce((min, b) => Math.min(min, b.approxDurationMinutes || Infinity), Infinity) ||
        30;
      const firstMetro = metroBuses[0];
      const fareEstimate = Math.round(
        (firstMetro.baseFare || 15) + (firstMetro.farePerKm || 3) * totalDistanceKm
      );
      const metroPlaces = {
        food: await fetchPlacesAlongRoute(route, 'food'),
        activities: await fetchPlacesAlongRoute(route, 'activity'),
        attractions: await fetchPlacesAlongRoute(route, 'attraction'),
      };

      options.push({
        mode: 'metro',
        routeId: route._id,
        summary: {
          durationMinutes: Number.isFinite(minDuration) ? minDuration : 30,
          fareEstimate,
        },
        placesAlongRoute: metroPlaces,
      });
    }

    return res.json({
      from,
      to,
      options,
    });
  } catch (error) {
    console.error('planTrip error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  planTrip,
};
