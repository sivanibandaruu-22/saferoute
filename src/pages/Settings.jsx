import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  MapPin,
  Bookmark,
  Trash2,
  Lock,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const {
    locationPermission,
    detectCurrentLocation,
    detectingLocation,
    savedRoutes,
    deleteSavedRoute,
    resetAllData
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hazardAlerts, setHazardAlerts] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    resetAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E6DF]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Application Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          Settings & Local Privacy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Customize notifications, location permissions, review the design palette, and manage stored browser data.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Theme & Design System (Theme toggle button removed per user request) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E6DF] shadow-soft">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#9F1239]" />
                <span>Visual Palette: Cherry &amp; Alabaster</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                SafeRoute is rendered in the unified Cherry &amp; Alabaster theme for elevated clarity and warm readability.
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-[#9F1239] px-2.5 py-1 rounded-full border border-rose-200">
              Active Theme
            </span>
          </div>

          {/* Color Swatches Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#E8E6DF]">
            <div className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center gap-3">
              <span className="w-6 h-6 rounded-xl bg-[#FBFBF9] border border-[#E8E6DF] shadow-xs flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Alabaster</span>
                <span className="text-[10px] text-stone-400 font-mono">#FBFBF9</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center gap-3">
              <span className="w-6 h-6 rounded-xl bg-[#9F1239] shadow-xs flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Deep Cherry</span>
                <span className="text-[10px] text-stone-400 font-mono">#9F1239</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center gap-3">
              <span className="w-6 h-6 rounded-xl bg-[#BE123C] shadow-xs flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Vibrant Rose</span>
                <span className="text-[10px] text-stone-400 font-mono">#BE123C</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center gap-3">
              <span className="w-6 h-6 rounded-xl bg-[#1C1917] shadow-xs flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Espresso Stone</span>
                <span className="text-[10px] text-stone-400 font-mono">#1C1917</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Location Permission Explainer */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E6DF] shadow-soft">
          <h2 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#9F1239]" />
            <span>Browser Location Permissions</span>
          </h2>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            SafeRoute requests GPS coordinates solely to center the map, locate nearby safety hazards, and provide live journey feedback. Web applications cannot force permission changes; they are managed by your browser security settings.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF]">
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                Current Permission State:
              </span>
              <span className="text-xs font-mono font-bold text-[#9F1239] capitalize">
                {locationPermission}
              </span>
            </div>

            <button
              onClick={() => detectCurrentLocation()}
              disabled={detectingLocation}
              className="px-4 py-2 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white rounded-xl text-xs font-bold transition-colors shadow-xs self-start sm:self-auto"
            >
              {detectingLocation ? 'Testing GPS...' : 'Test Location Detection'}
            </button>
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E6DF] shadow-soft">
          <h2 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#9F1239]" />
            <span>Application Notification Preferences</span>
          </h2>
          <p className="text-xs text-stone-500 mb-4">
            Toggle in-app hazard alerts and toast confirmations.
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] cursor-pointer">
              <span className="text-xs font-bold text-stone-800">
                In-app Toast Alerts & Confirmations
              </span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-[#9F1239] rounded focus:ring-[#9F1239]/20"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] cursor-pointer">
              <span className="text-xs font-bold text-stone-800">
                Route Corridor Hazard Advisories
              </span>
              <input
                type="checkbox"
                checked={hazardAlerts}
                onChange={(e) => setHazardAlerts(e.target.checked)}
                className="w-4 h-4 text-[#9F1239] rounded focus:ring-[#9F1239]/20"
              />
            </label>
          </div>
        </div>

        {/* 4. Saved Routes Manager */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E6DF] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>Saved Favorite Routes ({savedRoutes.length})</span>
              </h2>
              <p className="text-xs text-stone-500">
                Routes bookmarked for swift retrieval.
              </p>
            </div>
          </div>

          {savedRoutes.length > 0 ? (
            <div className="space-y-2.5">
              {savedRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-stone-900 block truncate">
                      {route.name}
                    </span>
                    <span className="text-stone-500 text-[11px] truncate block">
                      {route.originName} &rarr; {route.destinationName}
                    </span>
                    <span className="text-[10px] text-[#9F1239] font-bold">
                      {route.distanceKm.toFixed(1)} km &bull; {Math.round(route.durationMin)} mins
                    </span>
                  </div>

                  <button
                    onClick={() => deleteSavedRoute(route.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg"
                    title="Remove route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-[#FBFBF9] rounded-2xl border border-dashed border-[#E8E6DF] text-xs text-stone-400">
              No saved routes yet. Click the bookmark icon on any route card to save it here.
            </div>
          )}
        </div>

        {/* 5. Privacy & Storage Reset */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E6DF] shadow-soft space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Local Storage & Privacy Guarantee</span>
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            SafeRoute operates entirely on client-side technologies. Your hazard reports, emergency contacts, saved routes, and search history are retained exclusively in your device's <strong>localStorage</strong>. No personal location history is stored on remote servers or sold to third parties.
          </p>

          <div className="pt-2 border-t border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                Reset Demo Data
              </span>
              <span className="text-[11px] text-stone-500">
                Erase user-submitted reports and restore clean initial demo records.
              </span>
            </div>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#9F1239] border border-rose-200 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
            >
              Clear All Stored Data
            </button>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E8E6DF]">
            <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#9F1239]" />
              Reset Stored Application Data?
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              This will reset custom reports, emergency contacts, and saved routes in your browser back to the initial demonstration state.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-1.5 bg-[#9F1239] hover:bg-[#881337] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
