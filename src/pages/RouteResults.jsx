import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RouteCard from '../components/RouteCard';
import MapView from '../components/MapView';
import {
  Navigation,
  ArrowLeft,
  Columns,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  X,
  Clock
} from 'lucide-react';

export default function RouteResults() {
  const navigate = useNavigate();
  const {
    origin,
    destination,
    calculatedRoutes,
    selectedRouteIndex,
    setSelectedRouteIndex
  } = useApp();

  const [activeFactorsRoute, setActiveFactorsRoute] = useState(null);

  if (!calculatedRoutes || calculatedRoutes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#9F1239] flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Navigation className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          No Calculated Routes Available
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
          Please select your origin and destination in the Route Planner to calculate safety corridors.
        </p>
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9F1239] hover:bg-[#881337] text-white rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Open Route Planner</span>
        </Link>
      </div>
    );
  }

  const currentRoute = calculatedRoutes[selectedRouteIndex] || calculatedRoutes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E6DF]">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/planner"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              Available Route Corridors
            </h1>
          </div>
          <p className="text-xs text-stone-500 ml-8 mt-0.5 truncate max-w-xl">
            From <span className="font-bold text-stone-800">{origin.name}</span> to{' '}
            <span className="font-bold text-stone-800">{destination.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 ml-8 sm:ml-0">
          <button
            onClick={() => navigate('/compare')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            <Columns className="w-4 h-4 text-stone-500" />
            <span>Compare Corridors</span>
          </button>

          <button
            onClick={() => navigate('/navigation')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Start Live Navigation</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Route Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
            <span>{calculatedRoutes.length} Calculated Alternatives</span>
            <span className="text-[#9F1239]">Click to select corridor</span>
          </div>

          <div className="space-y-3.5">
            {calculatedRoutes.map((route, idx) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={idx === selectedRouteIndex}
                onSelect={() => setSelectedRouteIndex(idx)}
                onOpenFactorsModal={(r) => setActiveFactorsRoute(r)}
              />
            ))}
          </div>

          {/* Safety Disclaimer */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#E8E6DF] text-[11px] text-stone-500 leading-normal">
            <strong>Informational Notice:</strong> Safety indicators depend on community report availability and underlying OpenStreetMap tags. They are not a guarantee of personal safety.
          </div>
        </div>

        {/* Right: Interactive Map (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="h-[480px] sm:h-[560px] rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft relative">
            <MapView height="100%" interactive={true} />

            {/* Selected Route Floating Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-[#E8E6DF] flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-stone-900 block">
                  {currentRoute.name}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {currentRoute.distanceKm.toFixed(1)} km &bull; {Math.round(currentRoute.durationMin)} mins
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFactorsRoute(currentRoute)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  Factors
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/navigation')}
                  className="px-3.5 py-1 text-xs font-bold rounded-lg bg-[#9F1239] hover:bg-[#881337] text-white transition-colors"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Factors Detailed Modal */}
      {activeFactorsRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#E8E6DF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#E8E6DF] mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9F1239] text-[11px] font-bold mb-1 border border-rose-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Route Factors Breakdown
                </div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  {activeFactorsRoute.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveFactorsRoute(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Factor 1: Community Reports */}
              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Community Reports (within 400m)
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {activeFactorsRoute.safetyFactors?.totalReportsCount || 0}
                  </span>
                </div>
                <p className="text-stone-600 mb-2 leading-relaxed">
                  {activeFactorsRoute.safetyFactors?.totalReportsCount > 0
                    ? `Notices detected along this corridor: ${activeFactorsRoute.safetyFactors.nearbyReports.map((r) => r.category).join(', ')}.`
                    : 'No active safety hazard or road obstacle reports logged along this route corridor.'}
                </p>
                <span className="text-[10px] text-stone-400 font-medium">Source: SafeRoute Verified Community Dataset</span>
              </div>

              {/* Factor 2: Nearby Emergency Services */}
              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-[#BE123C]" />
                    Emergency Facilities Access (within 1.2km)
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded bg-rose-100 text-[#9F1239]">
                    {activeFactorsRoute.safetyFactors?.emergencyAccess?.hospitalsCount || 0} Hospital(s)
                  </span>
                </div>
                <p className="text-stone-600 mb-1 leading-relaxed">
                  Access to {activeFactorsRoute.safetyFactors?.emergencyAccess?.policeCount || 0} police station(s) and {activeFactorsRoute.safetyFactors?.emergencyAccess?.pharmaciesCount || 0} pharmacy/medical point(s).
                </p>
                <span className="text-[10px] text-stone-400 font-medium">Source: OpenStreetMap Point-of-Interest Registry</span>
              </div>

              {/* Factor 3: Lighting Information */}
              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Lighting & Time Information
                  </span>
                  <span className="text-[10px] text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Informational Notice
                  </span>
                </div>
                <p className="text-stone-600 mb-1 leading-relaxed">
                  {activeFactorsRoute.safetyFactors?.timeFactorNote}
                </p>
                <span className="text-[10px] text-stone-400 italic block mt-1">
                  Note: SafeRoute does not fabricate real-time optical lux readings. Street lighting evaluation relies on community reports and municipality road classes.
                </span>
              </div>

              {/* Mandatory Ethics Disclaimer */}
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-950 leading-relaxed">
                <strong>Mandatory Safety Disclaimer:</strong> {activeFactorsRoute.safetyFactors?.dataAvailability?.disclaimer}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8E6DF] flex justify-end">
              <button
                onClick={() => setActiveFactorsRoute(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors"
              >
                Close Factors Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
