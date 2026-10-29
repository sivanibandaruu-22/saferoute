import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { locationService } from '../services/locationService';
import { calculateRoutes } from '../services/routingService';
import { safePlacesService } from '../services/safePlacesService';
import { DEFAULT_MAP_CENTER } from '../data/demoData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Geolocation & Origin/Destination State
  const [currentLocation, setCurrentLocation] = useState(null); // { lat, lon, accuracy }
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Active Route Planning Inputs (Andhra Pradesh, India)
  const [origin, setOrigin] = useState({
    name: "Benz Circle, Vijayawada, Andhra Pradesh",
    coordinates: [16.4984, 80.6552]
  });
  const [destination, setDestination] = useState({
    name: "AIIMS Mangalagiri, Andhra Pradesh",
    coordinates: [16.4382, 80.5678]
  });
  const [travelMode, setTravelMode] = useState('driving'); // driving, walking, cycling
  const [timePreference, setTimePreference] = useState('morning'); // morning, evening, night

  // Calculated Routes & Navigation State
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeCalculationError, setRouteCalculationError] = useState(null);

  // Reports State
  const [communityReports, setCommunityReports] = useState(() => storage.getReports());
  const [myReportIds, setMyReportIds] = useState(() => storage.getMyReportIds());
  const [confirmedReportIds, setConfirmedReportIds] = useState(() => storage.getConfirmedReportIds());
  const [incorrectRecords, setIncorrectRecords] = useState(() => storage.getIncorrectReports());

  // Safe Places State
  const [safePlaces, setSafePlaces] = useState([]);

  // Emergency Contacts & Saved Routes
  const [emergencyContacts, setEmergencyContacts] = useState(() => storage.getContacts());
  const [savedRoutes, setSavedRoutes] = useState(() => storage.getSavedRoutes());
  const [recentRoutes, setRecentRoutes] = useState(() => storage.getRecentRoutes());

  // Preferences & Map Layers
  const [preferences, setPreferences] = useState(() => storage.getPreferences());
  const [mapLayers, setMapLayers] = useState({
    reports: true,
    hospitals: true,
    police: true,
    pharmacies: true,
    fuel: true,
    transit: true
  });

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check initial browser permission state
  useEffect(() => {
    locationService.checkPermission().then(setLocationPermission);
    safePlacesService.getPlaces().then(setSafePlaces);
  }, []);

  // Detect current location action
  const detectCurrentLocation = useCallback(async (setAsOrigin = false) => {
    setDetectingLocation(true);
    setLocationError(null);
    try {
      const pos = await locationService.getCurrentLocation();
      setCurrentLocation(pos);
      setLocationPermission('granted');

      if (setAsOrigin) {
        setOrigin({
          name: `My Location (${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)})`,
          coordinates: [pos.lat, pos.lon]
        });
      }
      addToast('Location detected successfully', 'success');
      return pos;
    } catch (err) {
      setLocationError(err.message);
      addToast(err.message, 'warning');
      return null;
    } finally {
      setDetectingLocation(false);
    }
  }, [addToast]);

  // Plan Route Execution
  const planRoutes = useCallback(
    async (customOrigin = null, customDest = null, customMode = null, customTime = null) => {
      const startCoord = customOrigin ? customOrigin.coordinates : origin.coordinates;
      const endCoord = customDest ? customDest.coordinates : destination.coordinates;
      const activeMode = customMode || travelMode;
      const activeTime = customTime || timePreference;

      if (!startCoord || !endCoord) {
        addToast('Please select both a starting point and destination', 'warning');
        return false;
      }

      setIsCalculatingRoute(true);
      setRouteCalculationError(null);

      try {
        const routes = await calculateRoutes({
          origin: startCoord,
          destination: endCoord,
          mode: activeMode,
          timePreference: activeTime,
          reports: communityReports,
          safePlaces
        });

        if (routes && routes.length > 0) {
          setCalculatedRoutes(routes);
          setSelectedRouteIndex(0);

          // Add to recent searches
          const newRecent = {
            id: `REC-${Date.now()}`,
            originName: customOrigin ? customOrigin.name : origin.name,
            destinationName: customDest ? customDest.name : destination.name,
            originCoord: startCoord,
            destCoord: endCoord,
            mode: activeMode,
            timestamp: new Date().toISOString(),
            distanceKm: routes[0].distanceKm,
            durationMin: routes[0].durationMin
          };
          const updatedRecent = [newRecent, ...recentRoutes.filter(r => r.destinationName !== newRecent.destinationName)].slice(0, 5);
          setRecentRoutes(updatedRecent);
          storage.saveRecentRoutes(updatedRecent);

          return true;
        } else {
          throw new Error('No viable route could be found for the selected endpoints.');
        }
      } catch (err) {
        setRouteCalculationError(err.message);
        addToast(err.message, 'error');
        return false;
      } finally {
        setIsCalculatingRoute(false);
      }
    },
    [origin, destination, travelMode, timePreference, communityReports, safePlaces, recentRoutes, addToast]
  );

  // Submit community report
  const submitReport = useCallback(
    (reportData) => {
      const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const newReport = {
        id: newId,
        category: reportData.category,
        title: reportData.title || `${reportData.category} reported`,
        description: reportData.description,
        locationName: reportData.locationName,
        coordinates: reportData.coordinates,
        severity: reportData.severity,
        status: 'Reported',
        reportedAt: now,
        confirmations: 1,
        reportedIncorrectCount: 0,
        imageUrl: reportData.imageUrl || null,
        isDemo: true, // Transparently labeled as demo data per Section 23
        author: 'You (Current Session)',
        timeline: [
          { status: 'Reported', timestamp: now, note: 'Submitted via SafeRoute web client' }
        ]
      };

      const updatedReports = [newReport, ...communityReports];
      setCommunityReports(updatedReports);
      storage.saveReports(updatedReports);

      // Track as user's report
      storage.addMyReportId(newId);
      setMyReportIds((prev) => [newId, ...prev]);

      // Automatically add user's confirmation
      storage.addConfirmedReportId(newId);
      setConfirmedReportIds((prev) => [...prev, newId]);

      addToast('Safety hazard report submitted successfully!', 'success');
      return newReport;
    },
    [communityReports, addToast]
  );

  // Confirm a report
  const confirmReport = useCallback(
    (reportId) => {
      if (confirmedReportIds.includes(reportId)) {
        addToast('You have already confirmed this report.', 'info');
        return;
      }

      const updated = communityReports.map((rep) => {
        if (rep.id === reportId) {
          const newConfirmations = (rep.confirmations || 0) + 1;
          let newStatus = rep.status;
          const newTimeline = [...(rep.timeline || [])];

          // Upgrade to Community Confirmed after 5 confirmations
          if (newConfirmations >= 5 && rep.status === 'Reported') {
            newStatus = 'Community Confirmed';
            newTimeline.push({
              status: 'Community Confirmed',
              timestamp: new Date().toISOString(),
              note: `Reached ${newConfirmations} community confirmations`
            });
          }

          return {
            ...rep,
            confirmations: newConfirmations,
            status: newStatus,
            timeline: newTimeline
          };
        }
        return rep;
      });

      setCommunityReports(updated);
      storage.saveReports(updated);
      storage.addConfirmedReportId(reportId);
      setConfirmedReportIds((prev) => [...prev, reportId]);

      addToast('Thank you for confirming this report!', 'success');
    },
    [communityReports, confirmedReportIds, addToast]
  );

  // Report incorrect information
  const flagReportIncorrect = useCallback(
    (reportId, reason) => {
      storage.recordIncorrectReport(reportId, reason);
      setIncorrectRecords((prev) => ({ ...prev, [reportId]: { reason, timestamp: new Date().toISOString() } }));

      // Increment incorrect count on the report (does not silently delete)
      const updated = communityReports.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            reportedIncorrectCount: (rep.reportedIncorrectCount || 0) + 1
          };
        }
        return rep;
      });

      setCommunityReports(updated);
      storage.saveReports(updated);
      addToast('Feedback recorded. Thank you for keeping community data accurate.', 'success');
    },
    [communityReports, addToast]
  );

  // Emergency Contacts CRUD
  const addEmergencyContact = useCallback(
    (contactData) => {
      const newContact = {
        id: `EC-${Date.now()}`,
        name: contactData.name,
        relationship: contactData.relationship,
        phone: contactData.phone,
        isPrimary: emergencyContacts.length === 0 ? true : !!contactData.isPrimary,
        notifyOnSOS: true
      };
      const updated = [...emergencyContacts, newContact];
      setEmergencyContacts(updated);
      storage.saveContacts(updated);
      addToast('Emergency contact added successfully', 'success');
      return newContact;
    },
    [emergencyContacts, addToast]
  );

  const updateEmergencyContact = useCallback(
    (id, updatedFields) => {
      const updated = emergencyContacts.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      setEmergencyContacts(updated);
      storage.saveContacts(updated);
      addToast('Contact updated', 'success');
    },
    [emergencyContacts, addToast]
  );

  const deleteEmergencyContact = useCallback(
    (id) => {
      const updated = emergencyContacts.filter((c) => c.id !== id);
      setEmergencyContacts(updated);
      storage.saveContacts(updated);
      addToast('Emergency contact removed', 'info');
    },
    [emergencyContacts, addToast]
  );

  // Save / Delete Route
  const saveCurrentRoute = useCallback(
    (routeToSave = null) => {
      const route = routeToSave || calculatedRoutes[selectedRouteIndex];
      if (!route) {
        addToast('No active route to save', 'warning');
        return;
      }
      const existing = savedRoutes.find((r) => r.id === route.id || (r.originName === origin.name && r.destinationName === destination.name));
      if (existing) {
        addToast('This route is already saved in your favorites', 'info');
        return;
      }

      const newSaved = {
        id: `SR-${Date.now()}`,
        name: route.name,
        originName: origin.name,
        destinationName: destination.name,
        originCoord: origin.coordinates,
        destCoord: destination.coordinates,
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
        mode: route.mode || travelMode,
        savedAt: new Date().toISOString(),
        advisoryLevel: route.safetyFactors?.advisoryLevel || 'Clear Information'
      };

      const updated = [newSaved, ...savedRoutes];
      setSavedRoutes(updated);
      storage.saveSavedRoutes(updated);
      addToast('Route saved to your favorites!', 'success');
    },
    [calculatedRoutes, selectedRouteIndex, origin, destination, travelMode, savedRoutes, addToast]
  );

  const deleteSavedRoute = useCallback(
    (id) => {
      const updated = savedRoutes.filter((r) => r.id !== id);
      setSavedRoutes(updated);
      storage.saveSavedRoutes(updated);
      addToast('Route removed from saved list', 'info');
    },
    [savedRoutes, addToast]
  );

  // Toggle map layer visibility
  const toggleMapLayer = useCallback((layerKey) => {
    setMapLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  // Clear all data
  const resetAllData = useCallback(() => {
    storage.clearAllData();
    setCommunityReports(storage.getReports());
    setMyReportIds([]);
    setConfirmedReportIds([]);
    setIncorrectRecords({});
    setEmergencyContacts(storage.getContacts());
    setSavedRoutes([]);
    setRecentRoutes(storage.getRecentRoutes());
    addToast('All local demonstration data has been reset to defaults.', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        // Geolocation
        currentLocation,
        locationPermission,
        detectingLocation,
        locationError,
        detectCurrentLocation,

        // Route inputs
        origin,
        setOrigin,
        destination,
        setDestination,
        travelMode,
        setTravelMode,
        timePreference,
        setTimePreference,

        // Routes
        calculatedRoutes,
        selectedRouteIndex,
        setSelectedRouteIndex,
        selectedRoute: calculatedRoutes[selectedRouteIndex] || null,
        isCalculatingRoute,
        routeCalculationError,
        planRoutes,

        // Reports
        communityReports,
        myReportIds,
        confirmedReportIds,
        incorrectRecords,
        submitReport,
        confirmReport,
        flagReportIncorrect,

        // Safe Places
        safePlaces,

        // Contacts & Saved Routes
        emergencyContacts,
        addEmergencyContact,
        updateEmergencyContact,
        deleteEmergencyContact,
        savedRoutes,
        recentRoutes,
        saveCurrentRoute,
        deleteSavedRoute,

        // Layers & Preferences
        mapLayers,
        toggleMapLayer,
        preferences,
        setPreferences,
        resetAllData,

        // Toasts
        toasts,
        addToast,
        removeToast,

        // Helpers
        defaultMapCenter: DEFAULT_MAP_CENTER
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
