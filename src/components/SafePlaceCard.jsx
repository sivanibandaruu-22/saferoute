import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDistance } from '../utils/geoUtils';
import {
  HeartPulse,
  Shield,
  Pill,
  Fuel,
  Building2,
  Navigation,
  PhoneCall,
  Clock,
  MapPin
} from 'lucide-react';

export default function SafePlaceCard({ place, onViewOnMap }) {
  const navigate = useNavigate();
  const { setDestination, planRoutes } = useApp();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hospitals':
        return <HeartPulse className="w-5 h-5 text-[#BE123C]" />;
      case 'Police Stations':
        return <Shield className="w-5 h-5 text-[#1E3A8A]" />;
      case 'Pharmacies':
        return <Pill className="w-5 h-5 text-emerald-700" />;
      case 'Fuel Stations':
        return <Fuel className="w-5 h-5 text-amber-700" />;
      default:
        return <Building2 className="w-5 h-5 text-purple-700" />;
    }
  };

  const handleDirections = () => {
    setDestination({
      name: place.name,
      coordinates: place.coordinates
    });
    planRoutes(null, { name: place.name, coordinates: place.coordinates });
    navigate('/routes');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6DF] shadow-soft hover:shadow-elevated transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#E8E6DF] flex-shrink-0">
              {getCategoryIcon(place.category)}
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#9F1239] uppercase tracking-wider block">
                {place.category}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug">
                {place.name}
              </h3>
            </div>
          </div>

          {place.distanceKm !== undefined && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap">
              {formatDistance(place.distanceKm)}
            </span>
          )}
        </div>

        {/* Address & Hours */}
        <div className="space-y-1.5 text-xs text-stone-600 mb-3">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
            <span className="leading-tight">{place.address}</span>
          </div>

          {place.openingHours && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{place.openingHours}</span>
            </div>
          )}
        </div>

        {/* Services tags */}
        {place.services && place.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.services.map((service, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#FBFBF9] text-stone-600 font-semibold border border-[#E8E6DF]"
              >
                {service}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#E8E6DF]">
        <button
          type="button"
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </button>

        {onViewOnMap && (
          <button
            type="button"
            onClick={() => onViewOnMap(place)}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            title="View place on map"
          >
            <MapPin className="w-4 h-4" />
          </button>
        )}

        {place.phone ? (
          <a
            href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1 py-2 px-3 bg-[#FBFBF9] hover:bg-rose-50 border border-[#E8E6DF] hover:border-rose-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
            title={`Call ${place.phone}`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#9F1239]" />
            <span>Call</span>
          </a>
        ) : (
          <span className="text-[10px] text-stone-400 italic px-2">No phone listed</span>
        )}
      </div>
    </div>
  );
}
