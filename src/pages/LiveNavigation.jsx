import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { locationService } from '../services/locationService';
import MapView from '../components/MapView';
import EmergencyModal from '../components/EmergencyModal';
import {
  Navigation,
  PhoneCall,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';

export default function LiveNavigation() {
  const navigate = useNavigate();
  const {
    selectedRoute,
    destination,
    currentLocation,
    addToast
  } = useApp();

  const [isNavigating] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState(null);

  if (!selectedRoute) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Navigation className="w-12 h-12 text-[#9F1239] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900 mb-2">No Active Route</h2>
        <p className="text-xs text-stone-500 mb-4">Please calculate and select a route to start navigation.</p>
        <Link to="/planner" className="px-4 py-2 bg-[#9F1239] text-white text-xs font-bold rounded-xl">
          Go to Route Planner
        </Link>
      </div>
    );
  }

  const coordinates = selectedRoute.coordinates || [];
  const currentNavCoord = isSimulating && coordinates.length > 0
    ? coordinates[simulationIndex]
    : currentLocation
    ? [currentLocation.lat, currentLocation.lon]
    : coordinates[0] || [16.5062, 80.6480];

  useEffect(() => {
    let timer = null;
    if (isSimulating && coordinates.length > 0) {
      timer = setInterval(() => {
        setSimulationIndex((prev) => {
          if (prev >= coordinates.length - 1) {
            setIsSimulating(false);
            addToast('You have arrived at your destination!', 'success');
            return coordinates.length - 1;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSimulating, coordinates, addToast]);

  useEffect(() => {
    let watchId = null;
    if (isNavigating) {
      watchId = locationService.startWatchingLocation(
        () => {},
        (err) => {
          console.warn('Live navigation GPS watch error:', err.message);
        }
      );
      setGpsWatchId(watchId);
    }

    return () => {
      if (watchId !== null) {
        locationService.stopWatchingLocation(watchId);
      }
    };
  }, [isNavigating]);

  const handleEndNavigation = () => {
    if (gpsWatchId !== null) {
      locationService.stopWatchingLocation(gpsWatchId);
    }
    setIsSimulating(false);
    navigate('/routes');
  };

  const nextStep = selectedRoute.steps?.[0] || {
    instruction: 'Proceed along highlighted route corridor towards destination',
    name: destination.name,
    distance: 400
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#FBFBF9]">
      {/* Top Turn Guidance Banner - Alabaster & Cherry */}
      <div className="absolute top-4 left-4 right-4 z-30 max-w-xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-elevated border border-[#E8E6DF] text-stone-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#881337] to-[#BE123C] text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Navigation className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold text-[#9F1239] uppercase tracking-wider block">
                Next Maneuver
              </span>
              <p className="text-sm sm:text-base font-extrabold truncate">
                {nextStep.instruction}
              </p>
              <span className="text-xs text-stone-500 font-medium">
                Towards {destination.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-[#FBFBF9] hover:bg-[#F2F1EC] text-stone-600 border border-[#E8E6DF] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute Voice Guidance'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Prototype Turn Guidance Disclaimer Notice */}
        <div className="mt-2 mx-auto max-w-lg bg-stone-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] text-stone-200 text-center border border-stone-800">
          Turn-by-turn instructions are not available in this prototype. Follow the displayed route and use appropriate navigation guidance.
        </div>
      </div>

      {/* Main Interactive Map */}
      <div className="flex-1 w-full h-full relative">
        <MapView
          height="100%"
          center={currentNavCoord}
          zoom={15}
          selectedMarkerCoord={currentNavCoord}
          interactive={true}
        />
      </div>

      {/* Floating Emergency SOS Action Button */}
      <div className="absolute right-4 bottom-28 sm:bottom-32 z-30">
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-black text-xs sm:text-sm rounded-2xl shadow-elevated shadow-rose-950/30 transition-all duration-200 active:scale-95 animate-pulse"
        >
          <PhoneCall className="w-4 h-4" />
          <span>EMERGENCY SOS</span>
        </button>
      </div>

      {/* Bottom Navigation Dashboard Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-30 max-w-xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#E8E6DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block -mb-0.5">
                Remaining Distance
              </span>
              <span className="text-lg sm:text-xl font-black text-stone-900">
                {selectedRoute.distanceKm.toFixed(1)} km
              </span>
            </div>

            <div className="h-8 w-px bg-[#E8E6DF]" />

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block -mb-0.5">
                Est. Duration
              </span>
              <span className="text-lg sm:text-xl font-black text-[#9F1239]">
                {Math.round(selectedRoute.durationMin)} min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Simulation Toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSimulating
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-[#E8E6DF]'
              }`}
              title="Simulate vehicle moving along route"
            >
              {isSimulating ? <Square className="w-4 h-4 text-amber-800" /> : <Play className="w-4 h-4 text-[#9F1239]" />}
              <span className="hidden sm:inline">{isSimulating ? 'Stop Demo' : 'Simulate Demo'}</span>
            </button>

            {/* End Navigation */}
            <button
              onClick={handleEndNavigation}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 active:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
