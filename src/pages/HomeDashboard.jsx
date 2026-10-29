import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchBox from '../components/SearchBox';
import ReportCard from '../components/ReportCard';
import SafePlaceCard from '../components/SafePlaceCard';
import {
  Navigation,
  Clock,
  HeartPulse,
  PhoneCall,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    planRoutes,
    isCalculatingRoute,
    detectCurrentLocation,
    detectingLocation,
    communityReports,
    safePlaces,
    recentRoutes,
    emergencyContacts
  } = useApp();

  const [lastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleFindRoutes = async (e) => {
    e.preventDefault();
    const success = await planRoutes();
    if (success) {
      navigate('/routes');
    }
  };

  const handleSelectRecent = async (recent) => {
    const newOrigin = { name: recent.originName, coordinates: recent.originCoord };
    const newDest = { name: recent.destinationName, coordinates: recent.destCoord };
    setOrigin(newOrigin);
    setDestination(newDest);
    const ok = await planRoutes(newOrigin, newDest, recent.mode);
    if (ok) {
      navigate('/routes');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Banner & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9F1239]">
              Personalized Dashboard
            </span>
            <span className="text-stone-300">&bull;</span>
            <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-stone-400" />
              Updated {lastUpdated}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950">
            {getGreeting()}, traveler.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Check real-time community hazards and plan routes with verified safety awareness.
          </p>
        </div>

        {/* Quick SOS Shortcut */}
        <Link
          to="/emergency"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-950/20 transition-transform active:scale-95"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>Emergency Center</span>
        </Link>
      </div>

      {/* Main Route Search Card - Rich Cherry Accent */}
      <div className="bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#1C1917] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/50">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold mb-4 border border-rose-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Route Finder</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            Where are you travelling today?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/90 mb-6">
            Input endpoints to generate multi-corridor routes with integrated community safety factors.
          </p>

          <form onSubmit={handleFindRoutes} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchBox
                label="Starting Location"
                placeholder="Enter start location..."
                value={origin.name}
                onSelect={(val) => setOrigin(val)}
                showMyLocationButton={true}
                onMyLocationClick={() => detectCurrentLocation(true)}
                isDetectingLocation={detectingLocation}
              />

              <SearchBox
                label="Destination"
                placeholder="Enter destination..."
                value={destination.name}
                onSelect={(val) => setDestination(val)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-rose-200/80">
                <span>Supports Driving, Walking, and Cycling profiles via OSRM.</span>
              </div>

              <button
                type="submit"
                disabled={isCalculatingRoute}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-white hover:bg-rose-50 active:bg-rose-100 text-[#881337] font-black text-sm rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isCalculatingRoute ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#881337]" />
                    <span>Calculating Routes...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-[#881337]" />
                    <span>Find Safe Routes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid: Recent Routes & Live Safety Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Live Safety Updates ticker & Nearby Reports */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#BE123C] animate-pulse" />
              <h2 className="text-lg font-black text-stone-900">
                Live Community Safety Updates
              </h2>
            </div>
            <Link
              to="/community-reports"
              className="text-xs font-bold text-[#9F1239] hover:text-[#881337] hover:underline flex items-center gap-1"
            >
              <span>View all ({communityReports.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {communityReports.slice(0, 3).map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewOnMap={() => navigate('/safety-map')}
              />
            ))}
          </div>

          <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#9F1239] flex-shrink-0" />
              <p className="text-xs text-rose-950 font-medium">
                Spotted a hazard, poor lighting, or road obstruction? Submit a community notice in 30 seconds.
              </p>
            </div>
            <Link
              to="/report"
              className="whitespace-nowrap ml-3 px-3.5 py-1.5 bg-[#9F1239] hover:bg-[#881337] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Report Issue
            </Link>
          </div>
        </div>

        {/* Right 5 cols: Recent Routes & Safe Places */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Routes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>Recent Routes</span>
              </h3>
              <Link to="/planner" className="text-xs text-stone-400 hover:text-[#9F1239] font-medium">
                New Plan
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentRoutes && recentRoutes.length > 0 ? (
                recentRoutes.map((recent) => (
                  <div
                    key={recent.id}
                    onClick={() => handleSelectRecent(recent)}
                    className="cursor-pointer p-3.5 rounded-2xl bg-white border border-[#E8E6DF] hover:border-rose-300 transition-colors shadow-soft flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-stone-900 truncate group-hover:text-[#9F1239]">
                        {recent.destinationName}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        From: {recent.originName}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-stone-800 block">
                        {recent.distanceKm} km
                      </span>
                      <span className="text-[10px] text-[#9F1239] font-bold">
                        Re-check &rarr;
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-white border border-[#E8E6DF] text-center text-xs text-stone-400">
                  No recent routes yet. Use the search box above to calculate your first route.
                </div>
              )}
            </div>
          </div>

          {/* Quick Nearby Useful Places */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#BE123C]" />
                <span>Nearby Useful Services</span>
              </h3>
              <Link to="/safe-places" className="text-xs font-bold text-[#9F1239] hover:underline">
                View all ({safePlaces.length})
              </Link>
            </div>

            <div className="space-y-3">
              {safePlaces.slice(0, 2).map((place) => (
                <SafePlaceCard
                  key={place.id}
                  place={place}
                  onViewOnMap={() => navigate('/safety-map')}
                />
              ))}
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#BE123C]" />
                <span>Emergency Contacts ({emergencyContacts.length})</span>
              </span>
              <Link to="/emergency" className="text-[11px] font-bold text-[#9F1239] hover:underline">
                Manage
              </Link>
            </div>
            <p className="text-[11px] text-stone-500 leading-normal">
              Pre-configured trusted contacts can be dialed with 1-tap in the Emergency Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
