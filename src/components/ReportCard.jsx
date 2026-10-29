import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusTimeline from './StatusTimeline';
import {
  ThumbsUp,
  MapPin,
  Clock,
  Flag,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Moon,
  Eye,
  Construction,
  CarFront,
  Waves,
  Footprints,
  HelpCircle
} from 'lucide-react';

export default function ReportCard({
  report,
  onViewOnMap
}) {
  const { confirmReport, flagReportIncorrect, confirmedReportIds } = useApp();
  const [showTimeline, setShowTimeline] = useState(false);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const [incorrectReason, setIncorrectReason] = useState('Issue has been resolved');

  const isConfirmedByMe = confirmedReportIds.includes(report.id);

  const getCategoryIcon = (category) => {
    switch (category) {
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

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'High':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Verified':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Community Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  const handleIncorrectSubmit = (e) => {
    e.preventDefault();
    flagReportIncorrect(report.id, incorrectReason);
    setShowIncorrectModal(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6DF] shadow-soft transition-all duration-200 hover:shadow-elevated">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#E8E6DF]">
            {getCategoryIcon(report.category)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                {report.category}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {report.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{new Date(report.reportedAt).toLocaleDateString()} at {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(report.severity)}`}>
            {report.severity}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
            {report.status}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-3">
        <h4 className="text-sm font-bold text-stone-900 mb-1">
          {report.title || report.description}
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Image Preview if available */}
      {report.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden border border-[#E8E6DF] max-h-48 bg-stone-100">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Location Bar */}
      <div className="flex items-center justify-between text-xs text-stone-600 bg-[#FBFBF9] p-2.5 rounded-xl border border-[#E8E6DF] mb-3">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <MapPin className="w-3.5 h-3.5 text-[#9F1239] flex-shrink-0" />
          <span className="truncate">{report.locationName || `${report.coordinates[0].toFixed(4)}, ${report.coordinates[1].toFixed(4)}`}</span>
        </div>
        <span className="text-[11px] font-bold text-[#9F1239] whitespace-nowrap">
          {report.confirmations || 1} confirmation(s)
        </span>
      </div>

      {/* Timeline Accordion */}
      {showTimeline && (
        <div className="mb-3 pt-2 pb-1 border-t border-[#E8E6DF] animate-in fade-in duration-200">
          <StatusTimeline currentStatus={report.status} timeline={report.timeline} />
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#E8E6DF]">
        <button
          type="button"
          onClick={() => confirmReport(report.id)}
          disabled={isConfirmedByMe}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isConfirmedByMe
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-[#9F1239] hover:bg-rose-100 border border-rose-200 active:scale-95'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{isConfirmedByMe ? 'Confirmed' : 'Confirm (+1)'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <span>Timeline</span>
            {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onViewOnMap && (
            <button
              type="button"
              onClick={() => onViewOnMap(report)}
              className="px-2.5 py-1.5 text-xs font-bold text-[#9F1239] hover:bg-rose-50 rounded-lg transition-colors"
            >
              View on Map
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowIncorrectModal(true)}
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Report inaccurate info"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report Incorrect Modal Dialog */}
      {showIncorrectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-elevated border border-[#E8E6DF]">
            <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#9F1239]" />
              Report Inaccurate or Resolved Issue
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Community feedback helps maintain route reliability. Reports are not silently deleted; your submission will be recorded for audit.
            </p>

            <form onSubmit={handleIncorrectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Reason for flag
                </label>
                <select
                  value={incorrectReason}
                  onChange={(e) => setIncorrectReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E6DF] bg-[#FBFBF9] text-stone-900 focus:ring-2 focus:ring-[#9F1239]/20"
                >
                  <option value="Issue has been resolved">Hazard is already cleared / resolved</option>
                  <option value="Inaccurate location">Location is significantly inaccurate</option>
                  <option value="Duplicate report">Duplicate of existing report</option>
                  <option value="No longer observable">No longer present or observable</option>
                  <option value="Spam or inappropriate">Incorrect or spam submission</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIncorrectModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#9F1239] hover:bg-[#881337] text-white rounded-xl transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
