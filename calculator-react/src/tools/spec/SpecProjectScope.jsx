import React from 'react';
import { 
  Plus, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  Printer, 
  Copy, 
  Check 
} from 'lucide-react';
import { SCOPE_ITEMS } from '../../data/specDatabase';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecProjectScope({ 
  projectData, 
  setProjectData, 
  scope, 
  setScope, 
  specs, 
  setSpecs, 
  onNext 
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleAddSpec = () => {
    setSpecs([...specs, '']);
  };

  const handleUpdateSpec = (index, value) => {
    const updated = [...specs];
    updated[index] = value;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index) => {
    if (specs.length <= 1) {
      setSpecs(['']);
      return;
    }
    const updated = specs.filter((_, i) => i !== index);
    setSpecs(updated);
  };

  const handleScopeToggle = (key, value) => {
    setScope({
      ...scope,
      [key]: value
    });
  };

  const handleValidate = () => {
    if (!projectData.projNo && !projectData.projDesc) {
      addToast('Missing Required Fields', 'Please enter at least Project No. or Project Description.', 'warning');
      return;
    }
    addToast('Scope Validated', 'Project Information & Company Scope saved successfully.', 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setProjectData({
      projNo: '',
      dinNo: '',
      projDesc: '',
      custName: '',
      preparedBy: '',
      scopeDesc: ''
    });
    setSpecs(['']);
    setScope({
      painting: 'YES',
      insulation: 'NO',
      fireproof: 'NO',
      tsa: 'NA',
      galv: 'NO',
      pickling: 'NO'
    });
    addToast('Section Reset', 'Project details and scope have been cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section A · B
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Project Information &amp; Scope of Work
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Project identification, DIN number, client details, applicable specifications list, and company multi-discipline scope matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('spec_reading')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F7941D]" />
            <span>General Project Information</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">* Mandatory</span>
        </div>

        {/* 3-Col Grid: Project No, DIN, Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Project No. <span className="text-rose-500 font-mono">*</span>
            </label>
            <input
              type="text"
              value={projectData.projNo}
              onChange={e => setProjectData({ ...projectData, projNo: e.target.value })}
              placeholder="e.g. S041515"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Design Input No. (DIN)
            </label>
            <input
              type="text"
              value={projectData.dinNo}
              onChange={e => setProjectData({ ...projectData, dinNo: e.target.value })}
              placeholder="e.g. DIN-2026-001"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Project Description <span className="text-rose-500 font-mono">*</span>
            </label>
            <input
              type="text"
              value={projectData.projDesc}
              onChange={e => setProjectData({ ...projectData, projDesc: e.target.value })}
              placeholder="e.g. FPSO Topside Module Piping & Structural Coating"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>
        </div>

        {/* 2-Col Grid: Customer & Prepared By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Details of Customer / Client
            </label>
            <input
              type="text"
              value={projectData.custName}
              onChange={e => setProjectData({ ...projectData, custName: e.target.value })}
              placeholder="e.g. TECNICAS REUNIDAS / SAUDI ARAMCO"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Prepared By <span className="text-slate-400 font-mono text-[10px] ml-1">(auto-fills report dossier)</span>
            </label>
            <input
              type="text"
              value={projectData.preparedBy}
              onChange={e => setProjectData({ ...projectData, preparedBy: e.target.value })}
              placeholder="e.g. S. Dharaiya — NACE Level 3 #42180"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>
        </div>

        {/* Applicable Specifications Dynamic List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Applicable Specification No. <span className="text-slate-400 font-normal text-[11px]">(add multiple as needed)</span>
            </label>
            <button
              type="button"
              onClick={handleAddSpec}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Specification</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec}
                  onChange={e => handleUpdateSpec(index, e.target.value)}
                  placeholder="e.g. 80080-GEN-TCH-0000-SPE-002_Rev02 / SAES-H-001"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                />
                {specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                    title="Remove specification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scope Description Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Scope Description
          </label>
          <textarea
            rows={3}
            value={projectData.scopeDesc}
            onChange={e => setProjectData({ ...projectData, scopeDesc: e.target.value })}
            placeholder="Paint coating system recommendation and confirmation based on operation and design parameter of equipment, environmental corrosivity, and client standards..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
          />
        </div>

        {/* Company Scope YES / NO / NA Grid */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Company Scope Matrix
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Select YES, NO, or NA for each service</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SCOPE_ITEMS.map((item) => {
              const currentVal = scope[item.key] || item.def;
              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    currentVal === 'YES'
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : currentVal === 'NO'
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                  </div>

                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shrink-0 shadow-2xs">
                    {['YES', 'NO', 'NA'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleScopeToggle(item.key, v)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                          currentVal === v
                            ? v === 'YES'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : v === 'NO'
                              ? 'bg-slate-700 text-white shadow-2xs'
                              : 'bg-amber-500 text-white shadow-2xs'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions Bar */}
        <div className="flex gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Validate Project Scope</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Section</span>
          </button>
        </div>

      </div>

    </div>
  );
}
