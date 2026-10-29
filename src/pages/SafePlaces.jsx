import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SafePlaceCard from '../components/SafePlaceCard';
import { calculateDistance } from '../utils/geoUtils';
import {
  HeartPulse,
  Shield,
  Pill,
  Fuel,
  Building2,
  Search,
  MapPin
} from 'lucide-react';

export default function SafePlaces() {
  const navigate = useNavigate();
  const {
    safePlaces,
    currentLocation,
    origin
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All Services', icon: Building2 },
    { id: 'Hospitals', label: 'Hospitals & Trauma', icon: HeartPulse, color: 'text-[#BE123C]' },
    { id: 'Police Stations', label: 'Police Stations', icon: Shield, color: 'text-[#1E3A8A]' },
    { id: 'Pharmacies', label: '24/7 Pharmacies', icon: Pill, color: 'text-emerald-700' },
    { id: 'Fuel Stations', label: 'Service / Fuel', icon: Fuel, color: 'text-amber-700' },
    { id: 'Public Institutions', label: 'Transit Hubs', icon: Building2, color: 'text-purple-700' }
  ];

  const referenceCoord = currentLocation
    ? [currentLocation.lat, currentLocation.lon]
    : origin.coordinates || [16.5062, 80.6480];

  const filteredPlaces = useMemo(() => {
    let list = safePlaces.map((p) => {
      const dist = calculateDistance(
        referenceCoord[0],
        referenceCoord[1],
        p.coordinates[0],
        p.coordinates[1]
      );
      return { ...p, distanceKm: dist };
    });

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.services?.some((s) => s.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => a.distanceKm - b.distanceKm);

    return list;
  }, [safePlaces, selectedCategory, searchQuery, referenceCoord]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Emergency & Public Support Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Safe Places & Emergency Facilities
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Discover verified hospitals, staffed police desks, 24/7 pharmacies, and illuminated service stations.
          </p>
        </div>

        <button
          onClick={() => navigate('/safety-map')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E8E6DF] hover:bg-[#F2F1EC] text-stone-800 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
        >
          <MapPin className="w-4 h-4 text-[#9F1239]" />
          <span>View on Full Map</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#9F1239] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-[#E8E6DF] hover:bg-[#F2F1EC]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color || 'text-stone-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative max-w-lg">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter facilities by name, medical service, or street..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#E8E6DF] text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
        />
      </div>

      {/* Facilities Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => (
            <SafePlaceCard
              key={place.id}
              place={place}
              onViewOnMap={() => navigate('/safety-map')}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E6DF] max-w-md mx-auto shadow-soft">
          <HeartPulse className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">
            No Facilities Found
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            No safe places match the selected category or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold"
          >
            Show All Safe Places
          </button>
        </div>
      )}
    </div>
  );
}
