import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { safePlacesService } from '../services/safePlacesService';
import EmergencyModal from '../components/EmergencyModal';
import {
  PhoneCall,
  Share2,
  HeartPulse,
  Shield,
  Trash2,
  Edit2,
  UserPlus,
  MessageSquare,
  Info
} from 'lucide-react';

export default function EmergencyCenter() {
  const navigate = useNavigate();
  const {
    currentLocation,
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    setDestination,
    planRoutes,
    addToast
  } = useApp();

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState('Family / Friend');
  const [contactErrors, setContactErrors] = useState({});
  const [copiedLocation, setCopiedLocation] = useState(false);

  const handleFindNearestHospital = async () => {
    const refCoord = currentLocation
      ? [currentLocation.lat, currentLocation.lon]
      : [16.5062, 80.6480];
    const nearest = await safePlacesService.findNearest(refCoord, 'Hospitals');
    if (nearest) {
      setDestination({
        name: nearest.name,
        coordinates: nearest.coordinates
      });
      addToast(`Routing to nearest hospital: ${nearest.name}`, 'info');
      await planRoutes(null, { name: nearest.name, coordinates: nearest.coordinates });
      navigate('/routes');
    }
  };

  const handleFindNearestPolice = async () => {
    const refCoord = currentLocation
      ? [currentLocation.lat, currentLocation.lon]
      : [16.5062, 80.6480];
    const nearest = await safePlacesService.findNearest(refCoord, 'Police Stations');
    if (nearest) {
      setDestination({
        name: nearest.name,
        coordinates: nearest.coordinates
      });
      addToast(`Routing to nearest police: ${nearest.name}`, 'info');
      await planRoutes(null, { name: nearest.name, coordinates: nearest.coordinates });
      navigate('/routes');
    }
  };

  const handleShareLocation = async () => {
    if (!currentLocation) {
      addToast('No GPS coordinates detected yet. Please enable location permissions.', 'warning');
      return;
    }

    const shareUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}`;
    const shareData = {
      title: 'SafeRoute Emergency Location',
      text: `EMERGENCY ALERT: My current GPS location coordinates are: ${currentLocation.lat.toFixed(5)}, ${currentLocation.lon.toFixed(5)}`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Location shared successfully', 'success');
      } catch (err) {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} | View map: ${shareUrl}`);
      setCopiedLocation(true);
      addToast('Location message copied to clipboard!', 'success');
      setTimeout(() => setCopiedLocation(false), 3000);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!contactName.trim()) errors.name = 'Contact name is required.';
    if (!contactPhone.trim() || contactPhone.trim().length < 7) {
      errors.phone = 'Valid phone number is required.';
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    if (editingContact) {
      updateEmergencyContact(editingContact.id, {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship
      });
      setEditingContact(null);
    } else {
      addEmergencyContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship
      });
    }

    setContactName('');
    setContactPhone('');
    setContactRelationship('Family / Friend');
    setShowAddContactModal(false);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setContactName(contact.name);
    setContactPhone(contact.phone);
    setContactRelationship(contact.relationship);
    setShowAddContactModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Alert & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>High-Priority Emergency Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Emergency Center & Quick Assistance
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Rapid access to official emergency dispatch hotlines, hospital routing, and personal trusted contacts.
          </p>
        </div>

        {/* Primary SOS Action Trigger */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-black text-sm rounded-2xl shadow-elevated shadow-rose-950/25 transition-all duration-200 active:scale-95 animate-pulse"
        >
          <PhoneCall className="w-5 h-5" />
          <span>CALL EMERGENCY SERVICES</span>
        </button>
      </div>

      {/* Grid of 4 Fast Emergency Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: Emergency Assistance Modal */}
        <div
          onClick={() => setIsEmergencyModalOpen(true)}
          className="cursor-pointer p-5 rounded-2xl bg-white border border-[#E8E6DF] hover:border-rose-300 shadow-soft hover:shadow-elevated transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#881337] to-[#BE123C] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Emergency Hotline
          </h3>
          <p className="text-[11px] text-stone-500 leading-normal">
            Dial 112 (National), 100 (Police), 108 (Ambulance), or 181 (Disha).
          </p>
        </div>

        {/* Action 2: Share Location */}
        <div
          onClick={handleShareLocation}
          className="cursor-pointer p-5 rounded-2xl bg-white border border-[#E8E6DF] hover:border-rose-300 shadow-soft hover:shadow-elevated transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#9F1239] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Share My Location
          </h3>
          <p className="text-[11px] text-stone-500 leading-normal">
            {copiedLocation ? 'Copied to clipboard!' : 'Send GPS coordinates link via SMS or native share.'}
          </p>
        </div>

        {/* Action 3: Nearest Hospital */}
        <div
          onClick={handleFindNearestHospital}
          className="cursor-pointer p-5 rounded-2xl bg-white border border-[#E8E6DF] hover:border-rose-300 shadow-soft hover:shadow-elevated transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#BE123C] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Find Nearest Hospital
          </h3>
          <p className="text-[11px] text-stone-500 leading-normal">
            Instant 1-click navigation to the closest emergency room.
          </p>
        </div>

        {/* Action 4: Nearest Police */}
        <div
          onClick={handleFindNearestPolice}
          className="cursor-pointer p-5 rounded-2xl bg-white border border-[#E8E6DF] hover:border-rose-300 shadow-soft hover:shadow-elevated transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Find Police Station
          </h3>
          <p className="text-[11px] text-stone-500 leading-normal">
            Navigate to the nearest staffed police assistance desk.
          </p>
        </div>
      </div>

      {/* Emergency Contacts Manager Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E6DF] shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Trusted Personal Contacts
            </h2>
            <p className="text-xs text-stone-500">
              Saved locally on your device for immediate 1-tap call or SMS in distress.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingContact(null);
              setContactName('');
              setContactPhone('');
              setContactRelationship('Family / Friend');
              setShowAddContactModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9F1239] hover:bg-[#881337] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Contact Cards List */}
        {emergencyContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {contact.name}
                    </span>
                    {contact.isPrimary && (
                      <span className="text-[10px] bg-rose-100 text-[#9F1239] px-1.5 py-0.5 rounded font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    {contact.relationship} &bull; {contact.phone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors"
                    title={`Call ${contact.name}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  <a
                    href={`sms:${contact.phone.replace(/[^0-9+]/g, '')}?body=EMERGENCY%20ALERT:%20Please%20check%20on%20me.`}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                    title="Send SMS"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleOpenEdit(contact)}
                    className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteEmergencyContact(contact.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#FBFBF9] rounded-2xl border border-dashed border-[#E8E6DF] text-xs text-stone-400">
            No emergency contacts added yet. Click &quot;Add Contact&quot; to configure trusted family or friends.
          </div>
        )}
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-4 bg-white rounded-2xl border border-[#E8E6DF] text-xs text-stone-500 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-stone-800">
          <Info className="w-4 h-4 text-[#9F1239]" />
          <span>Operational Boundary Notice</span>
        </div>
        <p>
          SafeRoute does not replace official 112 / 100 public safety dispatchers. In acute life-threatening situations, dial local emergency responders immediately.
        </p>
      </div>

      {/* Add / Edit Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8E6DF]">
            <h3 className="text-base font-bold text-stone-900 mb-3">
              {editingContact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
                />
                {contactErrors.name && (
                  <p className="text-rose-600 mt-1">{contactErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
                />
                {contactErrors.phone && (
                  <p className="text-rose-600 mt-1">{contactErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Relationship
                </label>
                <select
                  value={contactRelationship}
                  onChange={(e) => setContactRelationship(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E6DF] bg-white text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
                >
                  <option value="Family / Parent">Family / Parent</option>
                  <option value="Partner / Spouse">Partner / Spouse</option>
                  <option value="Friend / Roommate">Friend / Roommate</option>
                  <option value="Colleague / Work">Colleague / Work</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9F1239] hover:bg-[#881337] text-white font-bold rounded-xl"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Hotline Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
