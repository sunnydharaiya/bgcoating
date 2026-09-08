import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white border border-[#F3D2A0] rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="p-1 rounded-lg bg-amber-50 text-[#F7941D] shrink-0 mt-0.5">
              {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
               isError ? <AlertCircle className="w-4 h-4 text-rose-600" /> :
               <Info className="w-4 h-4 text-[#F7941D]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
