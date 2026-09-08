import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Flame, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  TSA_TEST_CATALOG, 
  TSA_STAGE_NAMES 
} from '../../data/tsaDatabase';

export default function TsaTestCatalogModal({
  isOpen,
  onClose,
  onSelectTest,
  activeCoatSID = 's1'
}) {
  const [search, setSearch] = useState('');
  const [customTest, setCustomTest] = useState({ t: '', std: '', req: '', act: '' });

  if (!isOpen) return null;

  const stageLabel = TSA_STAGE_NAMES[activeCoatSID] || activeCoatSID.toUpperCase();

  const filteredTests = TSA_TEST_CATALOG.filter(it => 
    it.t.toLowerCase().includes(search.toLowerCase()) ||
    it.std.toLowerCase().includes(search.toLowerCase()) ||
    it.req.toLowerCase().includes(search.toLowerCase())
  );

  const handleCustomAdd = () => {
    if (!customTest.t.trim()) {
      alert('Please enter a test parameter name.');
      return;
    }
    onSelectTest?.({
      t: customTest.t,
      std: customTest.std || 'Project Spec',
      req: customTest.req || 'As specified',
      act: customTest.act || '',
      res: 'Pass'
    });
    setCustomTest({ t: '', std: '', req: '', act: '' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E87B1E]" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Coating Test Catalog Library
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adding inspection test row to: <b>{stageLabel}</b>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests (e.g. Bend Test, Adhesion, WFT, Porosity, Salt)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:border-[#E87B1E]"
            />
          </div>
        </div>

        {/* Test Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredTests.map((test, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTest?.({ ...test, act: '', res: 'Pass' })}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#E87B1E] hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-base flex items-center justify-center shrink-0">
                  {test.ic || '🧪'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs group-hover:text-[#E87B1E] transition-colors">
                    {test.t}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <b>{test.std}</b> · {test.req}
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#E87B1E] group-hover:text-white text-slate-500 flex items-center justify-center transition shrink-0">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Test Manual Row Form */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Or Add Custom Manual Test Parameter:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={customTest.t}
              onChange={(e) => setCustomTest({ ...customTest, t: e.target.value })}
              placeholder="Test Parameter Name"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
            />
            <input
              type="text"
              value={customTest.std}
              onChange={(e) => setCustomTest({ ...customTest, std: e.target.value })}
              placeholder="Standard Ref (e.g. ASTM D4541)"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
            />
            <input
              type="text"
              value={customTest.req}
              onChange={(e) => setCustomTest({ ...customTest, req: e.target.value })}
              placeholder="Requirement Specification"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleCustomAdd}
              className="px-4 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs hover:bg-[#E87B1E] transition cursor-pointer"
            >
              Add Custom Test Row
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
