import React, { useState } from 'react';
import { Info, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SafetyIndicator({
  level = 'Clear Information',
  reportsCount = 0,
  emergencyAccess = null
}) {
  const [showDetails, setShowDetails] = useState(false);

  const getBadgeStyle = () => {
    if (reportsCount === 0) {
      return {
        bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-800',
        icon: ShieldCheck,
        label: 'No Active Incident Reports Along Corridor'
      };
    } else if (reportsCount > 2) {
      return {
        bg: 'bg-rose-50 border-rose-200 text-[#9F1239] font-bold',
        icon: AlertTriangle,
        label: `${reportsCount} Community Hazard Notice(s)`
      };
    } else {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800 font-semibold',
        icon: Info,
        label: `${reportsCount} Community Notice Along Corridor`
      };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setShowDetails(!showDetails)}
        className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-all hover:scale-[1.02] ${style.bg}`}
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{style.label}</span>
        <Info className="w-3 h-3 text-stone-400 opacity-70 ml-0.5" />
      </div>

      {/* Explanatory Popover */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute left-0 top-full mt-2 z-40 w-72 sm:w-80 p-4 bg-white rounded-2xl shadow-elevated border border-[#E8E6DF] text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E6DF] mb-2.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#9F1239]" />
                Informational Route Factors
              </span>
              <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Transparent Data
              </span>
            </div>

            <div className="space-y-2.5 text-stone-600">
              <div className="flex justify-between items-center text-[11px]">
                <span>Hazard Reports within 400m:</span>
                <span className="font-bold text-stone-900">{reportsCount}</span>
              </div>

              {emergencyAccess && (
                <div className="flex justify-between items-center text-[11px]">
                  <span>Nearby Emergency Facilities:</span>
                  <span className="font-bold text-stone-900">
                    {emergencyAccess.hospitalsCount || 0} Hospital(s), {emergencyAccess.policeCount || 0} Police
                  </span>
                </div>
              )}

              <div className="p-2.5 bg-[#FBFBF9] rounded-xl text-[10px] text-stone-500 border border-[#E8E6DF] leading-relaxed">
                <strong>Mandatory Safety Notice:</strong> Safety indicators are purely informational and depend on community data availability. SafeRoute does not guarantee personal safety.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
