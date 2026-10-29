import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import {
  Columns,
  ArrowLeft,
  Navigation,
  Clock,
  Milestone,
  AlertTriangle,
  HeartPulse,
  BadgeAlert,
  Info
} from 'lucide-react';

export default function RouteComparison() {
  const navigate = useNavigate();
  const {
    calculatedRoutes,
    selectedRouteIndex,
    setSelectedRouteIndex
  } = useApp();

  const [comparedRouteAIndex, setComparedRouteAIndex] = useState(0);
  const [comparedRouteBIndex, setComparedRouteBIndex] = useState(() =>
    calculatedRoutes.length > 1 ? 1 : 0
  );

  if (!calculatedRoutes || calculatedRoutes.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#9F1239] flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Columns className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          At least 2 routes needed for comparison
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
          Please calculate routes between your origin and destination to compare safety corridors side-by-side.
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

  const routeA = calculatedRoutes[comparedRouteAIndex];
  const routeB = calculatedRoutes[comparedRouteBIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E6DF]">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/routes"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              Neutral Route Comparison
            </h1>
          </div>
          <p className="text-xs text-stone-500 ml-8 mt-0.5">
            Compare duration, distance, reported hazards, and emergency access metrics side-by-side without subjective rankings.
          </p>
        </div>

        <button
          onClick={() => navigate('/navigation')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white rounded-xl text-xs font-bold shadow-xs"
        >
          <Navigation className="w-4 h-4" />
          <span>Start Navigation with Active Route</span>
        </button>
      </div>

      {/* Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Route A Selector */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft">
          <label className="block text-xs font-bold text-stone-600 mb-1.5">
            Primary Route Corridor (A)
          </label>
          <select
            value={comparedRouteAIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              setComparedRouteAIndex(idx);
              setSelectedRouteIndex(idx);
            }}
            className="w-full text-xs sm:text-sm font-bold p-2.5 rounded-xl border border-[#E8E6DF] bg-[#FBFBF9] text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
          >
            {calculatedRoutes.map((r, idx) => (
              <option key={r.id} value={idx}>
                {r.name} ({r.distanceKm.toFixed(1)} km &bull; {Math.round(r.durationMin)} min)
              </option>
            ))}
          </select>
        </div>

        {/* Route B Selector */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft">
          <label className="block text-xs font-bold text-stone-600 mb-1.5">
            Comparison Corridor (B)
          </label>
          <select
            value={comparedRouteBIndex}
            onChange={(e) => setComparedRouteBIndex(parseInt(e.target.value))}
            className="w-full text-xs sm:text-sm font-bold p-2.5 rounded-xl border border-[#E8E6DF] bg-[#FBFBF9] text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
          >
            {calculatedRoutes.map((r, idx) => (
              <option key={r.id} value={idx}>
                {r.name} ({r.distanceKm.toFixed(1)} km &bull; {Math.round(r.durationMin)} min)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm divide-y divide-[#E8E6DF]">
            <thead className="bg-[#FBFBF9] text-stone-500 font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Comparison Metric</th>
                <th className="py-3.5 px-4 sm:px-6 text-[#9F1239]">
                  {routeA.name}
                </th>
                <th className="py-3.5 px-4 sm:px-6 text-stone-800">
                  {routeB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF] text-stone-800">
              {/* Distance */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-stone-400" />
                  <span>Total Distance</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#9F1239]">
                  {routeA.distanceKm.toFixed(1)} km
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold">
                  {routeB.distanceKm.toFixed(1)} km
                </td>
              </tr>

              {/* Estimated Duration */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>Estimated Duration</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#9F1239]">
                  {Math.round(routeA.durationMin)} minutes
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold">
                  {Math.round(routeB.durationMin)} minutes
                </td>
              </tr>

              {/* Active Incident Reports */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Community Hazard Notices (400m)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  <span className="font-bold">{routeA.safetyFactors?.totalReportsCount || 0} notice(s)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  <span className="font-bold">{routeB.safetyFactors?.totalReportsCount || 0} notice(s)</span>
                </td>
              </tr>

              {/* Nearby Hospitals */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#BE123C]" />
                  <span>Nearby Hospital Facilities (1.2km)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  {routeA.safetyFactors?.emergencyAccess?.hospitalsCount || 0} facility(ies)
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  {routeB.safetyFactors?.emergencyAccess?.hospitalsCount || 0} facility(ies)
                </td>
              </tr>

              {/* Nearby Police Stations */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <BadgeAlert className="w-4 h-4 text-blue-700" />
                  <span>Nearby Police Stations (1.2km)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  {routeA.safetyFactors?.emergencyAccess?.policeCount || 0} station(s)
                </td>
                <td className="py-3.5 px-4 sm:px-6">
                  {routeB.safetyFactors?.emergencyAccess?.policeCount || 0} station(s)
                </td>
              </tr>

              {/* Route Engine Source */}
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-400" />
                  <span>Routing Calculation Source</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-xs text-stone-500">
                  {routeA.source}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-xs text-stone-500">
                  {routeB.source}
                </td>
              </tr>

              {/* Select Action */}
              <tr className="bg-[#FBFBF9]">
                <td className="py-4 px-4 sm:px-6 font-bold">Active Selection</td>
                <td className="py-4 px-4 sm:px-6">
                  <button
                    onClick={() => {
                      setSelectedRouteIndex(comparedRouteAIndex);
                      navigate('/routes');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedRouteIndex === comparedRouteAIndex
                        ? 'bg-[#9F1239] text-white shadow-xs'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {selectedRouteIndex === comparedRouteAIndex ? 'Currently Selected' : 'Choose Route A'}
                  </button>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <button
                    onClick={() => {
                      setSelectedRouteIndex(comparedRouteBIndex);
                      navigate('/routes');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedRouteIndex === comparedRouteBIndex
                        ? 'bg-[#9F1239] text-white shadow-xs'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {selectedRouteIndex === comparedRouteBIndex ? 'Currently Selected' : 'Choose Route B'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Map comparison preview */}
      <div className="h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft">
        <MapView height="100%" interactive={true} />
      </div>

      <div className="p-4 bg-white rounded-2xl border border-[#E8E6DF] text-xs text-stone-500 text-center leading-relaxed">
        <strong>Neutrality Commitment:</strong> SafeRoute does not calculate an arbitrary numeric &quot;Safety Score&quot;. Route factors are presented neutrally so you can make informed decisions based on your individual requirements.
      </div>
    </div>
  );
}
