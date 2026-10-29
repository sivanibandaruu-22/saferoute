import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/geocodingService';
import { MapPin, Navigation, Search, Loader2, X } from 'lucide-react';

export default function SearchBox({
  label = 'Search Location',
  placeholder = 'Enter address, landmark, or street...',
  value = '',
  onChange,
  onSelect,
  showMyLocationButton = false,
  onMyLocationClick,
  isDetectingLocation = false,
  className = ''
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const hits = await searchLocations(query);
        setResults(hits);
        setIsOpen(hits.length > 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.name || place.displayName);
    setIsOpen(false);
    if (onSelect) {
      onSelect({
        name: place.displayName || place.name,
        coordinates: [place.lat, place.lon]
      });
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    if (onChange) onChange('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {showMyLocationButton && (
            <button
              type="button"
              onClick={onMyLocationClick}
              disabled={isDetectingLocation}
              className="text-[#9F1239] hover:text-[#881337] text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#9F1239]" />
              ) : (
                <Navigation className="w-3 h-3" />
              )}
              <span>{isDetectingLocation ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 text-stone-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239] transition-all shadow-xs"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 text-[#9F1239] animate-spin" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-stone-400 hover:text-stone-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-2xl shadow-elevated border border-[#E8E6DF] max-h-60 overflow-y-auto divide-y divide-[#F2F1EC]">
          {results.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => handleSelect(place)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50/60 flex items-start gap-2.5 transition-colors group"
            >
              <MapPin className="w-4 h-4 text-stone-400 group-hover:text-[#9F1239] flex-shrink-0 mt-0.5 transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-800 truncate">
                  {place.name}
                </p>
                <p className="text-[11px] text-stone-500 truncate">
                  {place.displayName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
