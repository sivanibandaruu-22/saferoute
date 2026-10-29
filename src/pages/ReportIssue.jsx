import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '../data/demoData';
import SearchBox from '../components/SearchBox';
import MapView from '../components/MapView';
import {
  AlertTriangle,
  Send,
  Eye,
  Moon,
  Construction,
  CarFront,
  Footprints,
  Waves,
  HelpCircle
} from 'lucide-react';

export default function ReportIssue() {
  const navigate = useNavigate();
  const {
    submitReport,
    detectCurrentLocation,
    detectingLocation
  } = useApp();

  const [category, setCategory] = useState('Poor Lighting');
  const [severity, setSeverity] = useState('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('MG Road near Sub-Collector Office, Vijayawada, AP');
  const [coordinates, setCoordinates] = useState([16.5085, 80.6382]);
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCatIcon = (name) => {
    switch (name) {
      case 'Suspicious Activity': return <Eye className="w-4 h-4 text-amber-600" />;
      case 'Poor Lighting': return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'Road Blockage': return <Construction className="w-4 h-4 text-orange-600" />;
      case 'Dangerous Road': return <AlertTriangle className="w-4 h-4 text-[#9F1239]" />;
      case 'Accident': return <CarFront className="w-4 h-4 text-[#BE123C]" />;
      case 'Flooded Area': return <Waves className="w-4 h-4 text-blue-600" />;
      case 'Stray Animal': return <Footprints className="w-4 h-4 text-amber-700" />;
      default: return <HelpCircle className="w-4 h-4 text-stone-500" />;
    }
  };

  const handleMiniMapClick = (latlng) => {
    setCoordinates(latlng);
    setLocationName(`Pin at ${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!description.trim() || description.trim().length < 10) {
      errors.description = 'Please provide a clear description (at least 10 characters).';
    }

    if (!locationName.trim() || !coordinates) {
      errors.location = 'Please select or search a valid report location.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    submitReport({
      category,
      severity,
      title: title.trim() || `${category} issue`,
      description: description.trim(),
      locationName: locationName.trim(),
      coordinates,
      reportedAt: new Date(dateTime).toISOString(),
      imageUrl: imageUrl.trim() || null
    });

    setIsSubmitting(false);
    navigate('/my-reports');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Community Contribution Feed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          Report a Safety Concern or Hazard
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Help your fellow community members travel safer. Reports immediately update the interactive safety map and active corridor calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form: 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E6DF] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                1. Select Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {REPORT_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-50 border-[#9F1239] text-[#9F1239] ring-2 ring-[#9F1239]/20 font-bold'
                          : 'bg-[#FBFBF9] border-[#E8E6DF] text-stone-700 hover:border-rose-200'
                      }`}
                    >
                      <div className="mb-1">{getCatIcon(cat.value)}</div>
                      <span className="text-[11px] leading-tight font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Severity Level */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                2. Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SEVERITY_LEVELS.map((sev) => {
                  const isSelected = severity === sev.value;
                  return (
                    <button
                      key={sev.value}
                      type="button"
                      onClick={() => setSeverity(sev.value)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-100 border-[#9F1239] text-[#9F1239] ring-2 ring-[#9F1239]/20 font-bold'
                          : 'bg-[#FBFBF9] border-[#E8E6DF] text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">{sev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Location Picker */}
            <div>
              <SearchBox
                label="3. Report Location *"
                placeholder="Search street name, address, or landmark..."
                value={locationName}
                onChange={setLocationName}
                onSelect={(val) => {
                  setLocationName(val.name);
                  setCoordinates(val.coordinates);
                }}
                showMyLocationButton={true}
                onMyLocationClick={async () => {
                  const pos = await detectCurrentLocation();
                  if (pos) {
                    setCoordinates([pos.lat, pos.lon]);
                    setLocationName(`Current Location (${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)})`);
                  }
                }}
                isDetectingLocation={detectingLocation}
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Tip: You can also click anywhere on the adjacent map to place the marker.
              </span>
              {formErrors.location && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.location}</p>
              )}
            </div>

            {/* 4. Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Brief Headline (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken streetlight on corner of 7th"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                  }}
                  placeholder="Describe the hazard clearly: what is blocking the path, is it well-lit, how should other pedestrians or drivers proceed?"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* 5. Date & Optional Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Optional Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Submit Community Report</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Map Location Pinpoint: 5 cols */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-[#E8E6DF] text-xs text-stone-600 flex items-center justify-between">
            <span className="font-bold text-stone-900">Pinpoint Location:</span>
            <span className="font-mono text-[11px] text-[#9F1239] font-bold">
              {coordinates ? `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}` : 'Click map'}
            </span>
          </div>

          <div className="h-[420px] rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft">
            <MapView
              center={coordinates}
              zoom={14}
              selectedMarkerCoord={coordinates}
              onMapClick={handleMiniMapClick}
              height="100%"
            />
          </div>

          {/* Ethics / Demo Label */}
          <div className="p-3 bg-white rounded-2xl border border-[#E8E6DF] text-[10px] text-stone-500 leading-normal">
            <strong>Demonstration Label:</strong> All submissions in this academic prototype are recorded locally and marked as community-submitted demonstration data.
          </div>
        </div>
      </div>
    </div>
  );
}
