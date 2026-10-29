import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import MobileNavigation from './components/MobileNavigation';
import ToastContainer from './components/Toast';

// 13 Connected Pages
import LandingPage from './pages/LandingPage';
import HomeDashboard from './pages/HomeDashboard';
import RoutePlanner from './pages/RoutePlanner';
import RouteResults from './pages/RouteResults';
import RouteComparison from './pages/RouteComparison';
import LiveNavigation from './pages/LiveNavigation';
import SafetyMap from './pages/SafetyMap';
import ReportIssue from './pages/ReportIssue';
import CommunityReports from './pages/CommunityReports';
import MyReports from './pages/MyReports';
import SafePlaces from './pages/SafePlaces';
import EmergencyCenter from './pages/EmergencyCenter';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-stone-900 antialiased selection:bg-rose-900 selection:text-white">
          {/* Top Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 pb-24 md:pb-6">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<HomeDashboard />} />
              <Route path="/planner" element={<RoutePlanner />} />
              <Route path="/routes" element={<RouteResults />} />
              <Route path="/compare" element={<RouteComparison />} />
              <Route path="/navigation" element={<LiveNavigation />} />
              <Route path="/safety-map" element={<SafetyMap />} />
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/community-reports" element={<CommunityReports />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/safe-places" element={<SafePlaces />} />
              <Route path="/emergency" element={<EmergencyCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Mobile Thumb Navigation (Bottom Bar) */}
          <MobileNavigation />

          {/* In-App Toast Alert Queue */}
          <ToastContainer />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
