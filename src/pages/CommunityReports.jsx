import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ReportCard from '../components/ReportCard';
import { calculateDistance } from '../utils/geoUtils';
import { REPORT_CATEGORIES } from '../data/demoData';
import {
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react';

export default function CommunityReports() {
  const navigate = useNavigate();
  const { communityReports, currentLocation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const statusTabs = [
    { id: 'All', label: 'All Reports' },
    { id: 'Recent', label: 'Recent (< 24h)' },
    { id: 'Nearby', label: 'Nearby (GPS)' },
    { id: 'Unverified', label: 'Unverified' },
    { id: 'Verified', label: 'Community Confirmed / Verified' },
    { id: 'Resolved', label: 'Resolved' }
  ];

  const filteredReports = useMemo(() => {
    let result = [...communityReports];

    if (selectedStatusTab === 'Recent') {
      const oneDayAgo = Date.now() - 24 * 3600000;
      result = result.filter((r) => new Date(r.reportedAt).getTime() >= oneDayAgo);
    } else if (selectedStatusTab === 'Nearby') {
      if (currentLocation) {
        result = result.map((r) => ({
          ...r,
          dist: calculateDistance(currentLocation.lat, currentLocation.lon, r.coordinates[0], r.coordinates[1])
        }));
        result.sort((a, b) => (a.dist || 0) - (b.dist || 0));
      }
    } else if (selectedStatusTab === 'Unverified') {
      result = result.filter((r) => r.status === 'Reported');
    } else if (selectedStatusTab === 'Verified') {
      result = result.filter((r) => r.status === 'Community Confirmed' || r.status === 'Verified');
    } else if (selectedStatusTab === 'Resolved') {
      result = result.filter((r) => r.status === 'Resolved');
    }

    if (selectedCategory !== 'All') {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.locationName?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'confirmations') {
      result.sort((a, b) => (b.confirmations || 0) - (a.confirmations || 0));
    } else if (sortBy === 'severity') {
      const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
    } else if (selectedStatusTab !== 'Nearby') {
      result.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
    }

    return result;
  }, [communityReports, selectedStatusTab, selectedCategory, searchQuery, sortBy, currentLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Community Hazard Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Community Reports & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Search, verify, and inspect real-time safety notices submitted by local travelers.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue</span>
        </Link>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E6DF] text-xs font-bold">
        {statusTabs.map((tab) => {
          const isActive = selectedStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl transition-colors ${
                isActive
                  ? 'bg-[#9F1239] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6DF] text-stone-700 hover:bg-[#F2F1EC]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input (6 cols) */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by street, keyword, or obstacle..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#E8E6DF] text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20 focus:border-[#9F1239]"
          />
        </div>

        {/* Category Dropdown (3 cols) */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl bg-white border border-[#E8E6DF] text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
          >
            <option value="All">All Categories</option>
            {REPORT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown (3 cols) */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl bg-white border border-[#E8E6DF] text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
          >
            <option value="recent">Sort by Most Recent</option>
            <option value="confirmations">Sort by Most Confirmations</option>
            <option value="severity">Sort by Highest Severity</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onViewOnMap={() => navigate('/safety-map')}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E6DF] max-w-md mx-auto shadow-soft">
          <AlertTriangle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">
            No Reports Matching Filter
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Try adjusting your search criteria or clear status filters to view other community notices.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusTab('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
