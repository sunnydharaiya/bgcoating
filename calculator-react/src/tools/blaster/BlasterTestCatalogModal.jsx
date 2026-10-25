import React from 'react';
import { X, Plus, Sparkles, TestTube } from 'lucide-react';
import { INSP_CATALOG } from '../../data/blasterDatabase';

export default function BlasterTestCatalogModal({
  isOpen,
  onClose,
  onSelectTest
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#E8700A]/10 text-[#E8700A]">
              <TestTube className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Surface Preparation Inspection Test Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Select an inspection test parameter to insert into the qualification process table.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Catalog Items */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2.5">
          {INSP_CATALOG.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectTest(item);
                onClose();
              }}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#E8700A] hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#E8700A]/10">
                  {item.ic}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#E8700A] transition">
                    {item.t}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Standard: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{item.std}</span> &nbsp;·&nbsp; Req: <span>{item.req}</span>
                  </p>
                </div>
              </div>

              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-[#E8700A] group-hover:text-white transition">
                <Plus className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <span>Standards: ISO 8501, ISO 8502, ASTM D4417, ASTM D4285, SSPC VIS 1</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
