import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-2xl shadow-elevated border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-50/98 border-emerald-200 text-emerald-950'
                : isError
                ? 'bg-rose-50/98 border-rose-300 text-rose-950'
                : isWarning
                ? 'bg-amber-50/98 border-amber-200 text-amber-950'
                : 'bg-white/98 border-[#E8E6DF] text-stone-900'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#9F1239]" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-rose-700" />}
            </div>

            <div className="flex-1 text-xs sm:text-sm font-semibold pr-2">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
