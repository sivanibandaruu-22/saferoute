import React from 'react';
import { Check } from 'lucide-react';

const STAGES = [
  { key: 'Reported', label: 'Reported', desc: 'Submitted by community member' },
  { key: 'Community Confirmed', label: 'Community Confirmed', desc: '5+ neighbor confirmations' },
  { key: 'Verified', label: 'Verified', desc: 'Checked through review process' },
  { key: 'Resolved', label: 'Resolved', desc: 'Hazard cleared or addressed' }
];

export default function StatusTimeline({ currentStatus = 'Reported', timeline = [] }) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative mb-2">
        {/* Background track line */}
        <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-[#E8E6DF] -z-0" />

        {STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10 text-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-[#15803D] text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-[#9F1239] text-white ring-4 ring-rose-100 shadow-sm'
                    : 'bg-[#E8E6DF] text-stone-500'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>

              <span
                className={`text-[11px] font-bold mt-1.5 ${
                  isCurrent
                    ? 'text-[#9F1239]'
                    : isDone
                    ? 'text-stone-800'
                    : 'text-stone-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-[#FBFBF9] rounded-xl text-[10px] text-stone-500 border border-[#E8E6DF] text-center">
        <span>Status progression: <strong className="text-stone-700">{currentStatus}</strong> &bull; Community-verified prototype rules apply.</span>
      </div>
    </div>
  );
}
