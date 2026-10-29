import React from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import {
  Shield,
  Navigation,
  MapPin,
  HeartPulse,
  ArrowRight,
  Compass,
  Users,
  Info
} from 'lucide-react';

export default function LandingPage() {
  const previewRoute = [
    [16.4984, 80.6552],
    [16.4880, 80.6450],
    [16.4780, 80.6280],
    [16.4650, 80.6050],
    [16.4520, 80.5850],
    [16.4382, 80.5678]
  ];

  const steps = [
    { number: '1', title: 'Enter a destination', desc: 'Type an address, select a point on the map, or use your current location.' },
    { number: '2', title: 'Explore available routes', desc: 'Compare multiple calculated corridors for driving, walking, or cycling.' },
    { number: '3', title: 'Review available route factors', desc: 'Check verified community incident notices, road obstacles, and lighting information.' },
    { number: '4', title: 'Check nearby services', desc: 'Know where hospitals, police stations, and 24h pharmacies are along your path.' },
    { number: '5', title: 'Choose a route based on your needs', desc: 'Travel informed with the peace of mind that comes from community awareness.' }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-900">
      {/* Hero Section - Cherry & Alabaster */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#E8E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold shadow-xs">
                <Shield className="w-3.5 h-3.5 text-[#9F1239]" />
                <span>Intelligent Safety & Emergency Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 leading-tight">
                Travel with more information. Choose your route with confidence.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SafeRoute combines route information, community reports and nearby services to help you understand your journey better.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/planner"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] active:from-[#4C0519] active:to-[#881337] text-white font-bold text-sm shadow-lg shadow-rose-950/20 transition-all duration-200 group active:scale-95"
                >
                  <Navigation className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Plan a Route</span>
                </Link>

                <Link
                  to="/safety-map"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F2F1EC] text-stone-800 border border-[#E8E6DF] font-bold text-sm transition-colors shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-[#9F1239]" />
                  <span>Explore Safety Map</span>
                </Link>
              </div>

              {/* Stat badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#E8E6DF]">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900">OSM + OSRM</div>
                  <div className="text-[11px] text-stone-500 font-medium">Live Global Routing</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#9F1239]">100% Transparent</div>
                  <div className="text-[11px] text-stone-500 font-medium">No Fabricated Scores</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#BE123C]">24/7 Rapid</div>
                  <div className="text-[11px] text-stone-500 font-medium">Emergency Hub</div>
                </div>
              </div>
            </div>

            {/* Right Map Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl p-2.5 sm:p-3 bg-gradient-to-br from-rose-50 via-white to-stone-100 border border-[#E8E6DF] shadow-2xl">
                <div className="h-[380px] sm:h-[420px] rounded-2xl overflow-hidden relative border border-[#E8E6DF]">
                  <MapView
                    center={[16.4700, 80.6100]}
                    zoom={13}
                    customRouteCoordinates={previewRoute}
                    interactive={true}
                    height="100%"
                  />

                  {/* Floating badge over preview */}
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-[#E8E6DF] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9F1239] animate-pulse" />
                    <span className="text-xs font-bold text-stone-900">
                      Live Corridor Analysis Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Sections */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Designed for Informed Urban Travel
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            SafeRoute prioritizes verified data, neighbor collaboration, and rapid assistance over black-box algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1: Route Awareness */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#9F1239] flex items-center justify-center mb-5 border border-rose-200/80">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Route Awareness
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              Understand route factors before travelling. Inspect road obstructions, road classifications, and lighting notices along your corridor.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9F1239] hover:text-[#881337]"
            >
              <span>Explore Route Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 2: Community Reports */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 border border-amber-200/80">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Community Reports
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              Explore safety hazards and updates reported by community members. Confirm existing alerts or report new road blockages and hazards.
            </p>
            <Link
              to="/community-reports"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>Browse Community Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 3: Emergency Assistance */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#BE123C] flex items-center justify-center mb-5 border border-rose-300">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Emergency Assistance
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              Access nearest emergency contacts and public services in 1-click. Instant hospital routing, location sharing, and emergency hotline confirmation.
            </p>
            <Link
              to="/emergency"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BE123C] hover:text-[#9F1239]"
            >
              <span>Open Emergency Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#E8E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9F1239] block mb-1">
              Step-by-Step Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              How SafeRoute Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-5 rounded-2xl bg-[#FBFBF9] border border-[#E8E6DF] flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] text-white font-black text-sm flex items-center justify-center mb-3.5 shadow-xs">
                    {step.number}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Safety Notice Disclaimer Banner */}
      <section className="py-8 bg-[#F5F4EF] border-t border-[#E8E6DF]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600">
            <Info className="w-4 h-4 text-[#9F1239] flex-shrink-0" />
            <p>
              <strong>Safety & Data Notice:</strong> Safety indicators are informational and depend on the availability and quality of underlying community data. They are not a guarantee of personal safety. SafeRoute does not fabricate sensor measurements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
