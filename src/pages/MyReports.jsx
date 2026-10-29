import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ReportCard from '../components/ReportCard';
import {
  FileText,
  Plus,
  Info
} from 'lucide-react';

export default function MyReports() {
  const navigate = useNavigate();
  const { communityReports, myReportIds } = useApp();

  const myReports = communityReports.filter((r) => myReportIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#9F1239] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Browser Session Submissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            My Hazard Submissions
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track verification progress and community confirmations for issues you reported.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report Another Issue</span>
        </Link>
      </div>

      {/* Explanation of Status Timeline Lifecycle */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft">
        <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#9F1239]" />
          <span>Report Status Progression Stages</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FBFBF9] rounded-2xl border border-[#E8E6DF]">
            <span className="font-extrabold text-[#9F1239] block mb-0.5">1. Reported</span>
            <span className="text-stone-500 text-[11px]">Submitted by you in the web client.</span>
          </div>

          <div className="p-3 bg-[#FBFBF9] rounded-2xl border border-[#E8E6DF]">
            <span className="font-extrabold text-emerald-700 block mb-0.5">2. Community Confirmed</span>
            <span className="text-stone-500 text-[11px]">Validated by 5+ independent neighbors.</span>
          </div>

          <div className="p-3 bg-[#FBFBF9] rounded-2xl border border-[#E8E6DF]">
            <span className="font-extrabold text-blue-700 block mb-0.5">3. Verified</span>
            <span className="text-stone-500 text-[11px]">Confirmed via municipal notices or audit.</span>
          </div>

          <div className="p-3 bg-[#FBFBF9] rounded-2xl border border-[#E8E6DF]">
            <span className="font-extrabold text-stone-600 block mb-0.5">4. Resolved</span>
            <span className="text-stone-500 text-[11px]">Marked as cleared or road reopened.</span>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {myReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myReports.map((report) => (
            <div key={report.id} className="space-y-3">
              <ReportCard
                report={report}
                onViewOnMap={() => navigate('/safety-map')}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E6DF] max-w-md mx-auto shadow-soft">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">
            No Reports Submitted Yet
          </h3>
          <p className="text-xs text-stone-500 mb-5">
            You haven't submitted any hazard reports from this browser session. If you encounter an obstruction, report it to help others.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#881337] to-[#BE123C] hover:from-[#700D2B] hover:to-[#A21033] text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Your First Report</span>
          </Link>
        </div>
      )}
    </div>
  );
}
