import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Navigation, MapPin, AlertTriangle, PhoneCall } from 'lucide-react';

export default function MobileNavigation() {
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: Compass },
    { name: 'Routes', path: '/planner', icon: Navigation },
    { name: 'Map', path: '/safety-map', icon: MapPin },
    { name: 'Reports', path: '/community-reports', icon: AlertTriangle },
    { name: 'Emergency', path: '/emergency', icon: PhoneCall, isEmergency: true }
  ];

  // Don't show bottom navigation on Live Navigation page to maximize map canvas
  if (location.pathname === '/navigation') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-lg border-t border-[#E8E6DF] px-2 py-1 shadow-elevated safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          if (tab.isEmergency) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center -mt-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#881337] to-[#BE123C] active:from-[#4C0519] active:to-[#881337] text-white flex items-center justify-center shadow-lg shadow-rose-900/30 group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-[#9F1239] mt-0.5">
                  SOS
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#9F1239] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#9F1239] stroke-[2.3]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
