import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  X
} from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  const { currentLocation, emergencyContacts, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const locationText = currentLocation
    ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lon.toFixed(5)} (Accuracy: ~${Math.round(currentLocation.accuracy || 15)}m)`
    : 'Location not currently detected. Please enable GPS permissions.';

  const handleCopyLocation = () => {
    if (currentLocation) {
      const shareUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}`;
      const textToCopy = `EMERGENCY SOS: My current location coordinates are ${locationText}. Map: ${shareUrl}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      addToast('Emergency coordinates copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      addToast('No GPS coordinates available to copy', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border-2 border-rose-300 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Banner */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#9F1239] flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">
              Emergency Assistance
            </h2>
            <p className="text-xs text-[#9F1239] font-bold uppercase tracking-wider">
              Immediate Safety Response Options
            </p>
          </div>
        </div>

        {/* Safety Protocol Disclaimer */}
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 mb-4 leading-relaxed">
          <strong>Important Notice:</strong> Web browsers cannot autonomously dispatch emergency teams. In an immediate life-threatening situation, use the direct phone buttons below to contact public emergency dispatch.
        </div>

        {/* National & Andhra Pradesh Emergency Numbers */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-bold text-stone-700 block">
            Call Public Emergency Dispatch (India / AP):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:112"
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>112</span>
              </div>
              <span className="text-[10px] font-normal opacity-90">All-in-One India</span>
            </a>

            <a
              href="tel:100"
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>100</span>
              </div>
              <span className="text-[10px] font-normal opacity-90">AP Police</span>
            </a>

            <a
              href="tel:108"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-300" />
                <span>108</span>
              </div>
              <span className="text-[10px] font-normal text-stone-300">Ambulance AP</span>
            </a>

            <a
              href="tel:181"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-300" />
                <span>181 / Disha</span>
              </div>
              <span className="text-[10px] font-normal text-stone-300">Women Safety</span>
            </a>
          </div>
        </div>

        {/* Current Location Display & Share */}
        <div className="p-3.5 bg-[#FBFBF9] rounded-2xl border border-[#E8E6DF] mb-4">
          <span className="text-xs font-bold text-stone-700 block mb-1">
            Current GPS Coordinates to Read to Dispatch:
          </span>
          <div className="font-mono text-xs text-stone-900 bg-white p-2.5 rounded-xl border border-[#E8E6DF] flex items-center justify-between mb-2">
            <span className="truncate pr-2">{locationText}</span>
            <button
              type="button"
              onClick={handleCopyLocation}
              className="p-1 text-stone-500 hover:text-[#9F1239] transition-colors flex-shrink-0"
              title="Copy Coordinates"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLocation}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Location Message to Send via SMS</span>
          </button>
        </div>

        {/* Saved Emergency Contacts Shortcut */}
        {emergencyContacts.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-bold text-stone-700 block mb-1.5">
              Call Personal Emergency Contacts:
            </span>
            <div className="space-y-1.5">
              {emergencyContacts.slice(0, 2).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBFBF9] border border-[#E8E6DF] text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{contact.name}</span>
                    <span className="text-stone-500 text-[11px]">{contact.relationship} &bull; {contact.phone}</span>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
        >
          Close Emergency Window
        </button>
      </div>
    </div>
  );
}
