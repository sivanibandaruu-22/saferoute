/**
 * Geographic utility functions for SafeRoute
 */

// Calculate Haversine distance between two coordinates in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format distance nicely: "450 m" or "3.8 km"
export function formatDistance(km) {
  if (km === undefined || km === null || isNaN(km)) return '0 km';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Format travel duration in minutes or hours + minutes
export function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return '0 min';
  const mins = Math.round(minutes);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

// Validate coordinate pair
export function isValidCoordinate(coord) {
  if (!coord) return false;
  const lat = Array.isArray(coord) ? coord[0] : coord.lat;
  const lon = Array.isArray(coord) ? coord[1] : coord.lon;
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

// Distance from a point to a line segment (in km)
function distToSegmentSquared(p, v, w) {
  const l2 = (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2;
  if (l2 === 0) return (p[0] - v[0]) ** 2 + (p[1] - v[1]) ** 2;
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return (p[0] - (v[0] + t * (w[0] - v[0]))) ** 2 + (p[1] - (v[1] + t * (w[1] - v[1]))) ** 2;
}

// Check if a point is within buffer distance (km) of a polyline geometry [[lat, lon], ...]
export function isPointNearRoute(point, polylineCoords, bufferKm = 0.5) {
  if (!polylineCoords || polylineCoords.length < 2) return false;
  const pLat = Array.isArray(point) ? point[0] : point.lat;
  const pLon = Array.isArray(point) ? point[1] : point.lon;

  // Approximate 1 deg lat ~ 111 km, 1 deg lon ~ 111 * cos(lat) km
  const latFactor = 111;
  const lonFactor = 111 * Math.cos((pLat * Math.PI) / 180);

  const bufferSquared = bufferKm * bufferKm;

  for (let i = 0; i < polylineCoords.length - 1; i++) {
    const v = [polylineCoords[i][0] * latFactor, polylineCoords[i][1] * lonFactor];
    const w = [polylineCoords[i + 1][0] * latFactor, polylineCoords[i + 1][1] * lonFactor];
    const p = [pLat * latFactor, pLon * lonFactor];

    if (distToSegmentSquared(p, v, w) <= bufferSquared) {
      return true;
    }
  }
  return false;
}

// Bounding box for list of coordinates to fit map view
export function getBoundsForCoordinates(coords) {
  if (!coords || coords.length === 0) return null;
  let minLat = Infinity,
    maxLat = -Infinity,
    minLon = Infinity,
    maxLon = -Infinity;

  coords.forEach((c) => {
    const lat = Array.isArray(c) ? c[0] : c.lat;
    const lon = Array.isArray(c) ? c[1] : c.lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
  });

  // Add small padding
  const latPad = Math.max((maxLat - minLat) * 0.1, 0.005);
  const lonPad = Math.max((maxLon - minLon) * 0.1, 0.005);

  return [
    [minLat - latPad, minLon - lonPad],
    [maxLat + latPad, maxLon + lonPad],
  ];
}
