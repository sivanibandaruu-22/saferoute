import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Navigation,
  MapPin,
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  Settings,
  Menu,
  X,
  Compass,
  FileText
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Plan Route', path: '/planner', icon: Navigation },
    { name: 'Safety Map', path: '/safety-map', icon: MapPin },
    { name: 'Reports', path: '/community-reports', icon: AlertTriangle },
    { name: 'Safe Places', path: '/safe-places', icon: HeartPulse },
    { name: 'My Reports', path: '/my-reports', icon: FileText }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FBFBF9]/90 border-b border-[#E8E6DF] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Cherry & Alabaster */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#881337] via-[#9F1239] to-[#BE123C] flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-0.5">
              Safe<span className="text-[#9F1239]">Route</span>
            </span>
            <span className="hidden sm:block text-[9.5px] font-bold uppercase tracking-widest text-stone-400 -mt-1">
              Safety & Emergency Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                  active
                    ? 'text-[#9F1239] bg-rose-50/90 border border-rose-200/80 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2F1EC]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#9F1239]' : 'text-stone-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Theme toggle button removed per user request) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Settings Shortcut */}
          <Link
            to="/settings"
            className={`p-2 rounded-xl transition-colors ${
              isActive('/settings')
                ? 'text-[#9F1239] bg-rose-50 border border-rose-200'
                : 'text-stone-500 hover:text-stone-800 hover:bg-[#F2F1EC]'
            }`}
            title="Settings & Privacy"
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Emergency Center Quick SOS Button */}
          <Link
            to="/emergency"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-900/25 transition-all duration-200 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>Emergency</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-[#F2F1EC]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E6DF] bg-[#FBFBF9]/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                  active
                    ? 'text-[#9F1239] bg-rose-50 border border-rose-200/70'
                    : 'text-stone-700 hover:bg-[#F2F1EC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#9F1239]' : 'text-stone-400'}`} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E8E6DF] flex justify-between items-center px-1">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-semibold text-stone-600 py-1"
            >
              <Settings className="w-4 h-4 text-stone-400" />
              Settings & Privacy
            </Link>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Cherry-Alabaster
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
