import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { getBoundsForCoordinates } from '../utils/geoUtils';
import {
  ShieldAlert,
  Moon,
  AlertTriangle,
  CarFront,
  Footprints,
  Waves,
  HelpCircle,
  Construction,
  HeartPulse,
  BadgeAlert,
  Pill,
  Fuel,
  Navigation,
  ThumbsUp,
  Flag,
  PhoneCall
} from 'lucide-react';

// Custom SVG DivIcon generator function styled for Cherry & Alabaster
function createCustomDivIcon({ bgClass, iconSvg, size = 34, pulse = false }) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulse ? `<div class="absolute -inset-2 rounded-full ${bgClass} opacity-40 user-pulse-ring"></div>` : ''}
        <div class="w-[${size}px] h-[${size}px] rounded-full ${bgClass} text-white flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// Icons for map elements - Cherry & Alabaster Palette
const ICONS = {
  userLocation: createCustomDivIcon({
    bgClass: 'bg-[#9F1239]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
    size: 28,
    pulse: true
  }),
  origin: createCustomDivIcon({
    bgClass: 'bg-[#15803D]',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>',
    size: 36
  }),
  destination: createCustomDivIcon({
    bgClass: 'bg-[#881337]',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    size: 36
  }),
  selectedPoint: createCustomDivIcon({
    bgClass: 'bg-[#BE123C]',
    iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="6" fill="white"/></svg>',
    size: 32,
    pulse: true
  }),

  // Report Categories
  report_suspicious: createCustomDivIcon({
    bgClass: 'bg-[#D97706]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/></svg>',
    size: 30
  }),
  report_lighting: createCustomDivIcon({
    bgClass: 'bg-[#4338CA]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    size: 30
  }),
  report_blockage: createCustomDivIcon({
    bgClass: 'bg-[#EA580C]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/></svg>',
    size: 30
  }),
  report_danger: createCustomDivIcon({
    bgClass: 'bg-[#9F1239]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    size: 30
  }),
  report_default: createCustomDivIcon({
    bgClass: 'bg-[#44403C]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    size: 30
  }),

  // Safe Places
  hospital: createCustomDivIcon({
    bgClass: 'bg-[#BE123C]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    size: 32
  }),
  police: createCustomDivIcon({
    bgClass: 'bg-[#1E3A8A]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    size: 32
  }),
  pharmacy: createCustomDivIcon({
    bgClass: 'bg-[#047857]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
    size: 30
  }),
  fuel: createCustomDivIcon({
    bgClass: 'bg-[#B45309]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>',
    size: 30
  }),
  transit: createCustomDivIcon({
    bgClass: 'bg-[#7C3AED]',
    iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>',
    size: 30
  })
};

// Map click listener component
function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
}

// Auto fit bounds to route or center
function MapBoundsController({ coordinates, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 1) {
      const bounds = getBoundsForCoordinates(coordinates);
      if (bounds) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    } else if (center) {
      map.setView(center, zoom || 14);
    }
  }, [coordinates, center, zoom, map]);

  return null;
}

export default function MapView({
  center = null,
  zoom = 13,
  interactive = true,
  height = '100%',
  onMapClick = null,
  selectedMarkerCoord = null,
  customRouteCoordinates = null,
  className = ''
}) {
  const {
    currentLocation,
    origin,
    destination,
    calculatedRoutes,
    selectedRouteIndex,
    setSelectedRouteIndex,
    communityReports,
    safePlaces,
    mapLayers,
    confirmReport,
    flagReportIncorrect,
    confirmedReportIds,
    setDestination: setGlobalDestination,
    planRoutes,
    defaultMapCenter
  } = useApp();

  const mapCenter = center || (currentLocation ? [currentLocation.lat, currentLocation.lon] : defaultMapCenter);
  const activeRoute = calculatedRoutes[selectedRouteIndex] || null;
  const polylineCoords = customRouteCoordinates || (activeRoute ? activeRoute.coordinates : null);

  const getReportIcon = (category) => {
    switch (category) {
      case 'Suspicious Activity': return ICONS.report_suspicious;
      case 'Poor Lighting': return ICONS.report_lighting;
      case 'Road Blockage': return ICONS.report_blockage;
      case 'Dangerous Road':
      case 'Accident': return ICONS.report_danger;
      default: return ICONS.report_default;
    }
  };

  const getSafePlaceIcon = (category) => {
    switch (category) {
      case 'Hospitals': return ICONS.hospital;
      case 'Police Stations': return ICONS.police;
      case 'Pharmacies': return ICONS.pharmacy;
      case 'Fuel Stations': return ICONS.fuel;
      default: return ICONS.transit;
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-[#E8E6DF] bg-[#FBFBF9] shadow-soft ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Dynamic Bounds / Pan Controller */}
        <MapBoundsController coordinates={polylineCoords} center={mapCenter} zoom={zoom} />

        {/* Map Click Handler */}
        {onMapClick && <MapEventsHandler onMapClick={onMapClick} />}

        {/* User Current Location Marker */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lon]} icon={ICONS.userLocation}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-[#9F1239] block">Your Current Location</span>
                <span className="text-stone-500 text-[11px]">
                  GPS Accuracy: ~{Math.round(currentLocation.accuracy || 15)}m
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Temporary Clicked/Selected Point Marker */}
        {selectedMarkerCoord && (
          <Marker position={selectedMarkerCoord} icon={ICONS.selectedPoint}>
            <Popup>
              <div className="text-xs font-bold text-[#9F1239]">Selected Location</div>
            </Popup>
          </Marker>
        )}

        {/* Origin Marker */}
        {origin?.coordinates && (
          <Marker position={origin.coordinates} icon={ICONS.origin}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-emerald-700 block">Starting Point</span>
                <p className="text-stone-700 text-[11px] mt-0.5">{origin.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.coordinates && (
          <Marker position={destination.coordinates} icon={ICONS.destination}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-[#9F1239] block">Destination</span>
                <p className="text-stone-700 text-[11px] mt-0.5">{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polylines - Cherry & Alabaster Contrast */}
        {calculatedRoutes &&
          calculatedRoutes.map((route, idx) => {
            const isSelected = idx === selectedRouteIndex;
            return (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                eventHandlers={{
                  click: () => setSelectedRouteIndex(idx)
                }}
                pathOptions={{
                  color: isSelected ? '#9F1239' : '#A8A29E', // Rich Cherry vs Soft Stone
                  weight: isSelected ? 6.5 : 4,
                  opacity: isSelected ? 0.95 : 0.55,
                  dashArray: isSelected ? null : '6, 8',
                  lineJoin: 'round',
                  lineCap: 'round'
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">{route.name}</span>
                    <span className="text-stone-600 block">
                      {route.distanceKm.toFixed(1)} km &bull; {Math.round(route.durationMin)} mins
                    </span>
                    <button
                      onClick={() => setSelectedRouteIndex(idx)}
                      className="mt-1 text-[11px] text-[#9F1239] font-bold hover:underline"
                    >
                      {isSelected ? 'Currently Selected' : 'Select This Route'}
                    </button>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* Community Report Markers */}
        {mapLayers.reports &&
          communityReports.map((report) => (
            <Marker key={report.id} position={report.coordinates} icon={getReportIcon(report.category)}>
              <Popup>
                <div className="text-xs min-w-[210px]">
                  <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1.5 border-[#E8E6DF]">
                    <span className="font-bold text-stone-900">{report.category}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        report.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : report.severity === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </div>

                  <p className="text-stone-700 text-[11px] mb-2 leading-relaxed">{report.description}</p>

                  <div className="text-[10px] text-stone-500 mb-2 flex items-center justify-between">
                    <span className="truncate pr-1">{report.locationName}</span>
                    <span className="text-[#9F1239] font-bold whitespace-nowrap">
                      {report.confirmations} confirms
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#E8E6DF]">
                    <button
                      onClick={() => confirmReport(report.id)}
                      disabled={confirmedReportIds.includes(report.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
                        confirmedReportIds.includes(report.id)
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {confirmedReportIds.includes(report.id) ? 'Confirmed' : 'Confirm (+1)'}
                    </button>

                    <button
                      onClick={() => flagReportIncorrect(report.id, 'User marked on map')}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Report Inaccurate / Resolved"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Safe Places Markers */}
        {safePlaces.map((place) => {
          const isVisible =
            (place.category === 'Hospitals' && mapLayers.hospitals) ||
            (place.category === 'Police Stations' && mapLayers.police) ||
            (place.category === 'Pharmacies' && mapLayers.pharmacies) ||
            (place.category === 'Fuel Stations' && mapLayers.fuel) ||
            (place.category === 'Public Institutions' && mapLayers.transit);

          if (!isVisible) return null;

          return (
            <Marker key={place.id} position={place.coordinates} icon={getSafePlaceIcon(place.category)}>
              <Popup>
                <div className="text-xs min-w-[210px]">
                  <div className="flex items-center justify-between gap-1 border-b pb-1 mb-1 border-[#E8E6DF]">
                    <span className="font-bold text-stone-900 truncate">{place.name}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-medium">
                      {place.type}
                    </span>
                  </div>

                  <p className="text-stone-600 text-[11px]">{place.address}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {place.openingHours}
                  </p>

                  <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#E8E6DF]">
                    <button
                      onClick={() => {
                        setGlobalDestination({
                          name: place.name,
                          coordinates: place.coordinates
                        });
                        planRoutes();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#9F1239] hover:bg-[#881337] text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors shadow-xs"
                    >
                      <Navigation className="w-3 h-3" />
                      Get Directions
                    </button>

                    {place.phone && (
                      <a
                        href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                        className="p-1.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
                        title={`Call ${place.phone}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#9F1239]" />
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Attribution Watermark Badge */}
      <div className="absolute bottom-1 right-2 z-20 text-[9px] text-stone-500 bg-[#FBFBF9]/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#E8E6DF] pointer-events-none">
        &copy; OpenStreetMap | OSRM &bull; Cherry-Alabaster
      </div>
    </div>
  );
}
