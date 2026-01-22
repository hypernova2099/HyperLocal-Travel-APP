// Simple haversine distance in km between two lat/lng pairs
const toRad = (value) => (value * Math.PI) / 180;

const haversineKm = (a, b) => {
  if (!a || !b || a.lat === undefined || a.lng === undefined || b.lat === undefined || b.lng === undefined) {
    return 0;
  }
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const aVal = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
};

// Sum distances along stops between two indices
const distanceAlongStops = (stops = [], startIdx = 0, endIdx = stops.length - 1) => {
  if (stops.length < 2) return 0;
  const s = Math.max(0, Math.min(startIdx, stops.length - 1));
  const e = Math.max(0, Math.min(endIdx, stops.length - 1));
  let total = 0;
  for (let i = s; i < e; i++) {
    total += haversineKm(stops[i], stops[i + 1]);
  }
  return total;
};

// Check if place is close to any stop (rough filter using lat/lng box)
const isPlaceNearStops = (place, stops = [], thresholdKm = 5) => {
  return stops.some((stop) => haversineKm(stop, place) <= thresholdKm);
};

module.exports = {
  haversineKm,
  distanceAlongStops,
  isPlaceNearStops,
};
