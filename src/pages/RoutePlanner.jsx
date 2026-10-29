import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import MapView from '../components/MapView';
import {
  Navigation,
  Car,
  Footprints,
  Bike,
  Sun,
  Sunset,
  Moon,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';

export default function RoutePlanner() {
  const navigate = useNavigate();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    travelMode,
    setTravelMode,
    timePreference,
    setTimePreference,
    planRoutes,
    isCalculatingRoute,
    routeCalculationError,
    detectCurrentLocation,
    detectingLocation
  } = useApp();

  const [formError, setFormError] = useState(null);

  const travelModes = [
    { id: 'driving', label: 'Driving', icon: Car, desc: 'Automobile & highway routes' },
    { id: 'walking', label: 'Walking', icon: Footprints, desc: 'Sidewalks & pedestrian ways' },
    { id: 'cycling', label: 'Cycling', icon: Bike, desc: 'Bike lanes & shared streets' }
  ];

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: Sun, desc: 'Peak daylight visibility' },
    { id: 'evening', label: 'Evening', icon: Sunset, desc: 'Dusk commercial activity' },
    { id: 'night', label: 'Night', icon: Moon, desc: 'Nighttime priority lighting' }
  ];

  const handleCalculate = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!origin.coordinates || origin.coordinates.length < 2) {
      setFormError('Please select a valid starting point from the search results or use GPS location.');
      return;
    }

    if (!destination.coordinates || destination.coordinates.length < 2) {
      setFormError('Please select a valid destination from the search suggestions.');
      return;
    }

    const success = await planRoutes();
    if (success) {
      navigate('/routes');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#9F1239] text-xs font-bold mb-2 border border-rose-200">
          <Navigation className="w-3.5 h-3.5" />
          <span>Route Planning Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          Plan Your Safe Journey
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Configure start, destination, travel mode, and time preferences to compute multi-corridor routes with safety insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E6DF] shadow-soft space-y-6">
          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Start Location */}
            <div>
              <SearchBox
                label="Starting Location (Origin)"
                placeholder="Search starting location..."
                value={origin.name}
                onSelect={(val) => {
                  setOrigin(val);
                  setFormError(null);
                }}
                showMyLocationButton={true}
                onMyLocationClick={() => detectCurrentLocation(true)}
                isDetectingLocation={detectingLocation}
              />
              {origin.coordinates && (
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1 px-1 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>Lat: {origin.coordinates[0].toFixed(4)}, Lon: {origin.coordinates[1].toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Destination */}
            <div>
              <SearchBox
                label="Destination"
                placeholder="Search destination..."
                value={destination.name}
                onSelect={(val) => {
                  setDestination(val);
                  setFormError(null);
                }}
              />
              {destination.coordinates && (
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1 px-1 font-mono">
                  <MapPin className="w-3 h-3 text-[#9F1239]" />
                  <span>Lat: {destination.coordinates[0].toFixed(4)}, Lon: {destination.coordinates[1].toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Travel Modes */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {travelModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = travelMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTravelMode(mode.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-50 border-[#9F1239] text-[#9F1239] ring-2 ring-[#9F1239]/20 font-bold'
                          : 'bg-[#FBFBF9] border-[#E8E6DF] text-stone-700 hover:border-rose-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-[#9F1239]' : 'text-stone-400'}`} />
                      <span className="text-xs font-bold">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                Powered by OSRM {travelMode} profile.
              </p>
            </div>

            {/* Time Preferences */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                Time Preference (Informational Factors)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = timePreference === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTimePreference(item.id)}
                      className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-50 border-[#9F1239] text-[#9F1239] ring-2 ring-[#9F1239]/20 font-bold'
                          : 'bg-[#FBFBF9] border-[#E8E6DF] text-stone-700 hover:border-rose-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#9F1239]' : 'text-stone-400'}`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message if any */}
            {(formError || routeCalculationError) && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#9F1239]" />
                <span>{formError || routeCalculationError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculatingRoute}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-bold text-sm rounded-xl shadow-md shadow-rose-950/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isCalculatingRoute ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Calculating Safety Corridors...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Calculate Safe Routes</span>
                </>
              )}
            </button>
          </form>

          {/* Ethics & Transparent Data Notice */}
          <div className="pt-4 border-t border-[#E8E6DF] text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Info className="w-3.5 h-3.5 text-[#9F1239]" />
              <span>Transparent Data Rules</span>
            </div>
            <p>
              Calculated routes cross-reference verified community incident reports and nearby registered facilities. No fabricated sensor scores are used.
            </p>
          </div>
        </div>

        {/* Right Map Preview: 7 cols */}
        <div className="lg:col-span-7 space-y-3">
          <div className="h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft">
            <MapView height="100%" interactive={true} />
          </div>

          <div className="text-center text-xs text-stone-500">
            Click map markers to preview active hazard reports, police stations, and 24h hospitals.
          </div>
        </div>
      </div>
    </div>
  );
}
