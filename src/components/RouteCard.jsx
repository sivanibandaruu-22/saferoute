import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SafetyIndicator from './SafetyIndicator';
import {
  Clock,
  Milestone,
  Bookmark,
  Car,
  Footprints,
  Bike,
  Columns,
  Navigation as NavigationIcon,
  HeartPulse
} from 'lucide-react';

export default function RouteCard({
  route,
  isSelected,
  onSelect,
  onOpenFactorsModal
}) {
  const navigate = useNavigate();
  const { saveCurrentRoute, savedRoutes } = useApp();

  const isSaved = savedRoutes.some((r) => r.name === route.name);

  const getModeIcon = () => {
    switch (route.mode) {
      case 'walking':
        return <Footprints className="w-4 h-4 text-emerald-700" />;
      case 'cycling':
        return <Bike className="w-4 h-4 text-amber-600" />;
      default:
        return <Car className="w-4 h-4 text-[#9F1239]" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
        isSelected
          ? 'bg-rose-50/70 border-[#9F1239] shadow-elevated ring-1 ring-[#9F1239]'
          : 'bg-white border-[#E8E6DF] hover:border-rose-200 shadow-soft'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#E8E6DF] shadow-xs">
            {getModeIcon()}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
              {route.name}
            </h3>
            <span className="text-[11px] text-stone-400 font-semibold">
              Calculated via {route.source || 'OSRM'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            saveCurrentRoute(route);
          }}
          className={`p-2 rounded-xl transition-colors ${
            isSaved
              ? 'text-[#9F1239] bg-rose-100'
              : 'text-stone-400 hover:text-stone-700 hover:bg-[#F2F1EC]'
          }`}
          title={isSaved ? 'Saved in favorites' : 'Save route to favorites'}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 mb-3.5 py-2.5 px-3 bg-[#FBFBF9] rounded-xl border border-[#E8E6DF]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#9F1239]" />
          <div>
            <span className="text-[11px] text-stone-400 font-medium block -mb-0.5">Estimated Duration</span>
            <span className="text-sm sm:text-base font-extrabold text-stone-900">
              {Math.round(route.durationMin)} mins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-l border-[#E8E6DF] pl-3">
          <Milestone className="w-4 h-4 text-stone-600" />
          <div>
            <span className="text-[11px] text-stone-400 font-medium block -mb-0.5">Total Distance</span>
            <span className="text-sm sm:text-base font-extrabold text-stone-900">
              {route.distanceKm.toFixed(1)} km
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Factor Summary */}
      <div className="mb-4 space-y-2">
        <SafetyIndicator
          level={route.safetyFactors?.advisoryLevel}
          reportsCount={route.safetyFactors?.totalReportsCount || 0}
          emergencyAccess={route.safetyFactors?.emergencyAccess}
        />

        {route.safetyFactors?.emergencyAccess?.hospitalsCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <HeartPulse className="w-3.5 h-3.5 text-[#BE123C]" />
            <span>
              {route.safetyFactors.emergencyAccess.hospitalsCount} hospital(s) within 1.2km corridor
            </span>
          </div>
        )}
      </div>

      {/* Functional Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8E6DF]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenFactorsModal) onOpenFactorsModal(route);
          }}
          className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <span>Factors</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/compare');
          }}
          className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <Columns className="w-3.5 h-3.5 text-stone-500" />
          <span>Compare</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/navigation');
          }}
          className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white shadow-xs transition-colors"
        >
          <NavigationIcon className="w-3.5 h-3.5" />
          <span>Navigate</span>
        </button>
      </div>
    </div>
  );
}
