import { INITIAL_SAFE_PLACES } from '../data/demoData';
import { calculateDistance } from '../utils/geoUtils';

/**
 * Service to manage and query Safe Places (Hospitals, Police, Pharmacies, etc.)
 */

export const safePlacesService = {
  // Get safe places, optionally sorted by distance from [lat, lon]
  getPlaces: async (referenceCoord = null, categoryFilter = 'All') => {
    let places = [...INITIAL_SAFE_PLACES];

    // Category filtering
    if (categoryFilter && categoryFilter !== 'All') {
      places = places.filter((p) => p.category === categoryFilter);
    }

    // Attach distance if reference coordinate provided
    if (referenceCoord && Array.isArray(referenceCoord) && referenceCoord.length === 2) {
      const [refLat, refLon] = referenceCoord;
      places = places.map((place) => {
        const distKm = calculateDistance(refLat, refLon, place.coordinates[0], place.coordinates[1]);
        return {
          ...place,
          distanceKm: distKm
        };
      });

      // Sort by proximity
      places.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return places;
  },

  // Find single nearest place of a specific category
  findNearest: async (referenceCoord, category) => {
    const places = await safePlacesService.getPlaces(referenceCoord, category);
    return places.length > 0 ? places[0] : null;
  }
};
