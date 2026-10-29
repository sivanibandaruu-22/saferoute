/**
 * Location Service wrapping Browser Geolocation API
 * Handles permissions, timeouts, and live coordinate streaming with explicit consent.
 */

export const locationService = {
  // Query browser permission status if supported
  checkPermission: async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      return 'unknown';
    }
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      return status.state; // 'granted' | 'prompt' | 'denied'
    } catch {
      return 'unknown';
    }
  },

  // Get current position single snapshot
  getCurrentLocation: (options = {}) => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000,
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp
          });
        },
        (err) => {
          let message = 'Unable to retrieve location.';
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Location access was denied. Please allow location permissions in your browser.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            message = 'Location information is currently unavailable.';
          } else if (err.code === err.TIMEOUT) {
            message = 'Location request timed out. Please retry.';
          }
          reject(new Error(message));
        },
        defaultOptions
      );
    });
  },

  // Watch position for Live Navigation
  startWatchingLocation: (onUpdate, onError) => {
    if (!('geolocation' in navigator)) {
      if (onError) onError(new Error('Geolocation is not supported.'));
      return null;
    }

    return navigator.geolocation.watchPosition(
      (pos) => {
        onUpdate({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp
        });
      },
      (err) => {
        if (onError) onError(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  },

  // Stop watching
  stopWatchingLocation: (watchId) => {
    if (watchId !== null && watchId !== undefined && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};
