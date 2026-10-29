import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import SearchBox from '../components/SearchBox';
import {
  Layers,
  AlertTriangle,
  HeartPulse,
  Shield,
  Pill,
  Fuel,
  Check
} from 'lucide-react';

export default function SafetyMap() {
  const {
    mapLayers,
    toggleMapLayer,
    communityReports,
    safePlaces,
    detectCurrentLocation,
    detectingLocation
  } = useApp();

  const [mapCenter, setMapCenter] = useState(null);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const layerItems = [
    { key: 'reports', label: 'Community Reports', count: communityReports.length, icon: AlertTriangle, color: 'text-amber-600' },
    { key: 'hospitals', label: 'Hospitals & Trauma', count: safePlaces.filter(p => p.category === 'Hospitals').length, icon: HeartPulse, color: 'text-[#BE123C]' },
    { key: 'police', label: 'Police Stations', count: safePlaces.filter(p => p.category === 'Police Stations').length, icon: Shield, color: 'text-[#1E3A8A]' },
    { key: 'pharmacies', label: '24/7 Pharmacies', count: safePlaces.filter(p => p.category === 'Pharmacies').length, icon: Pill, color: 'text-emerald-700' },
    { key: 'fuel', label: 'Fuel / Well-lit Areas', count: safePlaces.filter(p => p.category === 'Fuel Stations').length, icon: Fuel, color: 'text-amber-700' }
  ];

  const handleLocationSelect = (item) => {
    if (item.coordinates) {
      setMapCenter(item.coordinates);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#FBFBF9]">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 max-w-4xl mx-auto pointer-events-none">
        {/* Search bar */}
        <div className="pointer-events-auto flex-1 max-w-md shadow-elevated">
          <SearchBox
            label=""
            placeholder="Search location or neighborhood on map..."
            onSelect={handleLocationSelect}
            showMyLocationButton={true}
            onMyLocationClick={async () => {
              const pos = await detectCurrentLocation();
              if (pos) setMapCenter([pos.lat, pos.lon]);
            }}
            isDetectingLocation={detectingLocation}
          />
        </div>

        {/* Action Pills */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-elevated border backdrop-blur-md transition-all ${
              showLayerPanel
                ? 'bg-[#9F1239] text-white border-[#9F1239] ring-2 ring-[#9F1239]/20'
                : 'bg-white/95 text-stone-800 border-[#E8E6DF] hover:bg-[#F2F1EC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Map Layers</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles Floating Dropdown Card */}
      {showLayerPanel && (
        <div className="absolute top-20 right-4 z-40 w-72 bg-white/98 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[#E8E6DF] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E6DF] mb-3">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#9F1239]" />
              Layer Visibility
            </span>
            <span className="text-[10px] text-stone-400">Click to toggle</span>
          </div>

          <div className="space-y-1.5">
            {layerItems.map((item) => {
              const Icon = item.icon;
              const isChecked = !!mapLayers[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleMapLayer(item.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                    isChecked
                      ? 'bg-rose-50/80 text-stone-900 border border-rose-200'
                      : 'text-stone-400 hover:bg-[#F2F1EC]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 font-mono">
                      {item.count}
                    </span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-[#9F1239] border-[#9F1239] text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-[#E8E6DF] text-[10px] text-stone-500 leading-tight">
            Markers update instantaneously on the interactive map canvas.
          </div>
        </div>
      )}

      {/* Main Interactive Map */}
      <div className="flex-1 w-full h-full relative">
        <MapView
          height="100%"
          center={mapCenter}
          zoom={13}
          interactive={true}
        />
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 max-w-2xl mx-auto pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-elevated border border-[#E8E6DF] flex items-center justify-between gap-3 overflow-x-auto text-xs text-stone-600">
          <span className="font-bold text-stone-900 flex-shrink-0">Legend:</span>
          <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              Community Reports
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BE123C]" />
              Hospitals
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
              Police Stations
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              Pharmacies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
