// src/tools/painter/PainterTestCatalogModal.jsx
import React from 'react';
import { X, TestTube, Plus, Sparkles } from 'lucide-react';
import { COAT_TEST_CATALOG, COAT_STAGE_NAMES } from '../../data/painterDatabase';

export default function PainterTestCatalogModal({
  isOpen,
  onClose,
  onSelectTest,
  activeCoatSID = 's1'
}) {
  if (!isOpen) return null;

  const stageName = COAT_STAGE_NAMES[activeCoatSID] || activeCoatSID;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TestTube className="w-5 h-5 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider font-rajdhani">
                Add Coating Inspection Test — <span className="text-[#F8C078]">{stageName}</span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Select from 11 standard industry tests (SSPC, ASTM, ISO, NACE/AMPP) or add a custom row
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog Items List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {COAT_TEST_CATALOG.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectTest(item);
                onClose();
              }}
              className="pt-2 first:pt-0 p-2 rounded-xl hover:bg-amber-50/60 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#E87B1E]/10 group-hover:text-[#9E1B1E] flex items-center justify-center text-sm flex-shrink-0 transition">
                  {item.ic}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#9E1B1E] transition-colors">
                    {item.t}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-mono font-medium text-slate-700">{item.std}</span> · {item.req}
                  </p>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-[#E87B1E] group-hover:text-white text-slate-400 transition">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          ))}

          {/* Custom Blank Row Entry */}
          <div
            onClick={() => {
              onSelectTest({
                ic: '✎',
                t: 'Custom Coating Inspection Test',
                std: 'Project Spec',
                req: 'As per specification'
              });
              onClose();
            }}
            className="pt-2 p-2 rounded-xl hover:bg-amber-50/60 transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#E87B1E]/10 flex items-center justify-center text-sm flex-shrink-0 transition">
                ✎
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#9E1B1E] transition-colors">
                  Custom Inspection Test (Manual Entry)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Insert a blank row to type a custom test name, standard reference, and acceptance criteria.
                </p>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-[#E87B1E] group-hover:text-white text-slate-400 transition">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
