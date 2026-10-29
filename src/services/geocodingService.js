/**
 * Geocoding Service using OpenStreetMap Nominatim API
 * Configured for Andhra Pradesh, India with curated local POIs
 */

const FALLBACK_LOCATIONS = [
  { name: "Benz Circle, Vijayawada, Andhra Pradesh", lat: 16.4984, lon: 80.6552, display_name: "Benz Circle, MG Road & Bandar Road, Vijayawada, Andhra Pradesh 520010" },
  { name: "AIIMS Mangalagiri, Guntur, Andhra Pradesh", lat: 16.4382, lon: 80.5678, display_name: "AIIMS Mangalagiri, NH-16, Guntur District, Andhra Pradesh 522503" },
  { name: "Pandit Nehru Bus Station (PNBS), Vijayawada, AP", lat: 16.5118, lon: 80.6185, display_name: "PNBS, National Highway 65, Vijayawada, Andhra Pradesh 520013" },
  { name: "Vijayawada Railway Junction (BZA), Andhra Pradesh", lat: 16.5186, lon: 80.6195, display_name: "Vijayawada Junction Railway Station, Railway Station Road, Vijayawada, AP 520001" },
  { name: "Government General Hospital (GGH), Vijayawada, AP", lat: 16.5165, lon: 80.6288, display_name: "GGH, Hanumanpet, Vijayawada, Andhra Pradesh 520003" },
  { name: "Amaravati Secretariat / Capital Region, Andhra Pradesh", lat: 16.5132, lon: 80.5180, display_name: "AP State Secretariat, Velagapudi, Amaravati, Andhra Pradesh 522237" },
  { name: "RK Beach Road, Visakhapatnam, Andhra Pradesh", lat: 17.7126, lon: 83.3188, display_name: "Ramakrishna Beach, Beach Road, Visakhapatnam, Andhra Pradesh 530002" },
  { name: "Tirupati Balaji Temple Base, Tirupati, Andhra Pradesh", lat: 13.6288, lon: 79.4192, display_name: "Tirupati City Center & Alipiri Road, Tirupati, Andhra Pradesh 517501" },
  { name: "Guntur Market Center, Guntur, Andhra Pradesh", lat: 16.3067, lon: 80.4365, display_name: "Guntur City Center, Arundelpet, Guntur, Andhra Pradesh 522002" },
  { name: "Rajahmundry Godavari Bridge, Andhra Pradesh", lat: 17.0005, lon: 81.7820, display_name: "Godavari Fourth Bridge, Rajahmundry, Andhra Pradesh 533101" }
];

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 800; // 800ms throttle for OSM Nominatim

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();

  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_REQUEST_INTERVAL) {
    await new Promise((res) => setTimeout(res, MIN_REQUEST_INTERVAL - timeSinceLast));
  }
  lastRequestTime = Date.now();

  try {
    // Append countrycodes=in for prioritized Indian location resolution
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=in&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Nominatim HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        id: item.place_id || `${item.lat}-${item.lon}`,
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type || item.class || 'location',
        source: 'OpenStreetMap Nominatim'
      }));
    }
  } catch (err) {
    console.warn('Nominatim API search error or timeout, checking AP catalog:', err.message);
  }

  // Fallback to matching local Andhra Pradesh points
  const matchedFallbacks = FALLBACK_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(cleanQuery) ||
      loc.display_name.toLowerCase().includes(cleanQuery)
  );

  return matchedFallbacks.map((item, idx) => ({
    id: `fb-ap-${idx}`,
    name: item.name,
    displayName: item.display_name,
    lat: item.lat,
    lon: item.lon,
    type: 'curated-point',
    source: 'SafeRoute Andhra Pradesh Catalog'
  }));
}

export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err.message);
  }
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
