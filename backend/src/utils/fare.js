const { distanceAlongStops } = require('./geo');

// Shared fare calculation based on route stops and bus pricing
// route: BusRoute document
// fromStop / toStop: stop names (strings)
const calculateFare = (bus, route, fromStop, toStop) => {
  if (!route || !Array.isArray(route.stops) || route.stops.length === 0) {
    const fallbackDistance = 5;
    return Math.round((bus.baseFare || 10) + (bus.farePerKm || 2) * fallbackDistance);
  }

  const findStopIndex = (name) => {
    if (!name) return -1;
    return route.stops.findIndex((s) => s.name?.toLowerCase() === name.toLowerCase());
  };

  const startIdx = findStopIndex(fromStop);
  const endIdx = findStopIndex(toStop);

  const validStart = startIdx !== -1 ? startIdx : 0;
  const validEnd = endIdx !== -1 ? endIdx : route.stops.length - 1;

  const distanceKm =
    distanceAlongStops(
      route.stops,
      Math.min(validStart, validEnd),
      Math.max(validStart, validEnd)
    ) || 5;

  return Math.round((bus.baseFare || 10) + (bus.farePerKm || 2) * distanceKm);
};

module.exports = {
  calculateFare,
};

