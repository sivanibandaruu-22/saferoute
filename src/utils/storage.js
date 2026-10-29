import { INITIAL_COMMUNITY_REPORTS, INITIAL_EMERGENCY_CONTACTS } from '../data/demoData';

// Versioned keys with _ap_v2 to ensure a clean slate in the user's browser
const KEYS = {
  REPORTS: 'saferoute_reports_ap_v2',
  MY_REPORTS: 'saferoute_my_report_ids_ap_v2',
  CONFIRMED_REPORTS: 'saferoute_confirmed_ids_ap_v2',
  INCORRECT_REPORTS: 'saferoute_incorrect_reports_ap_v2',
  CONTACTS: 'saferoute_emergency_contacts_ap_v2',
  SAVED_ROUTES: 'saferoute_saved_routes_ap_v2',
  RECENT_ROUTES: 'saferoute_recent_routes_ap_v2',
  PREFERENCES: 'saferoute_user_preferences_ap_v2'
};

function safeParse(jsonString, fallback) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to parse storage item:', err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to store key ${key}:`, err);
    return false;
  }
}

export const storage = {
  // Reports
  getReports: () => {
    const raw = localStorage.getItem(KEYS.REPORTS);
    if (!raw) {
      storage.saveReports(INITIAL_COMMUNITY_REPORTS);
      return INITIAL_COMMUNITY_REPORTS;
    }
    return safeParse(raw, INITIAL_COMMUNITY_REPORTS);
  },
  saveReports: (reports) => safeSet(KEYS.REPORTS, reports),

  // My Reports (IDs created by this browser)
  getMyReportIds: () => safeParse(localStorage.getItem(KEYS.MY_REPORTS), []),
  addMyReportId: (id) => {
    const ids = storage.getMyReportIds();
    if (!ids.includes(id)) {
      ids.unshift(id);
      safeSet(KEYS.MY_REPORTS, ids);
    }
  },

  // Confirmations by this user
  getConfirmedReportIds: () => safeParse(localStorage.getItem(KEYS.CONFIRMED_REPORTS), []),
  addConfirmedReportId: (id) => {
    const ids = storage.getConfirmedReportIds();
    if (!ids.includes(id)) {
      ids.push(id);
      safeSet(KEYS.CONFIRMED_REPORTS, ids);
    }
  },

  // Reports marked incorrect
  getIncorrectReports: () => safeParse(localStorage.getItem(KEYS.INCORRECT_REPORTS), {}),
  recordIncorrectReport: (id, reason) => {
    const records = storage.getIncorrectReports();
    records[id] = { reason, timestamp: new Date().toISOString() };
    safeSet(KEYS.INCORRECT_REPORTS, records);
  },

  // Emergency Contacts - starts clean
  getContacts: () => {
    const raw = localStorage.getItem(KEYS.CONTACTS);
    if (!raw) {
      storage.saveContacts(INITIAL_EMERGENCY_CONTACTS);
      return INITIAL_EMERGENCY_CONTACTS;
    }
    return safeParse(raw, INITIAL_EMERGENCY_CONTACTS);
  },
  saveContacts: (contacts) => safeSet(KEYS.CONTACTS, contacts),

  // Saved Routes
  getSavedRoutes: () => safeParse(localStorage.getItem(KEYS.SAVED_ROUTES), []),
  saveSavedRoutes: (routes) => safeSet(KEYS.SAVED_ROUTES, routes),

  // Recent Searches / Routes (Andhra Pradesh Corridors)
  getRecentRoutes: () => safeParse(localStorage.getItem(KEYS.RECENT_ROUTES), [
    {
      id: "REC-AP-1",
      originName: "Benz Circle, Vijayawada, AP",
      destinationName: "AIIMS Mangalagiri, Andhra Pradesh",
      originCoord: [16.4984, 80.6552],
      destCoord: [16.4382, 80.5678],
      mode: "driving",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      distanceKm: 12.4,
      durationMin: 22
    },
    {
      id: "REC-AP-2",
      originName: "Pandit Nehru Bus Station (PNBS)",
      destinationName: "Government General Hospital (GGH), Vijayawada",
      originCoord: [16.5118, 80.6185],
      destCoord: [16.5165, 80.6288],
      mode: "driving",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      distanceKm: 2.3,
      durationMin: 8
    }
  ]),
  saveRecentRoutes: (routes) => safeSet(KEYS.RECENT_ROUTES, routes),

  // Preferences
  getPreferences: () => safeParse(localStorage.getItem(KEYS.PREFERENCES), {
    notificationsEnabled: true,
    safetyAlerts: true,
    preferredTravelMode: 'driving',
    timePreference: 'morning'
  }),
  savePreferences: (prefs) => safeSet(KEYS.PREFERENCES, prefs),

  // Reset all application data
  clearAllData: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    storage.saveReports(INITIAL_COMMUNITY_REPORTS);
    storage.saveContacts(INITIAL_EMERGENCY_CONTACTS);
  }
};
