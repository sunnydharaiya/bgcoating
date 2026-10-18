import React from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  FileText, 
  DollarSign, 
  RotateCcw, 
  ArrowRight 
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateProjectInfo({ 
  formData, 
  onUpdateField, 
  onNavigateNext, 
  onReset 
}) {
  const handleAddSpec = () => {
    onUpdateField('specs', [...(formData.specs || []), '']);
  };

  const handleUpdateSpec = (index, value) => {
    const updated = [...(formData.specs || [])];
    updated[index] = value;
    onUpdateField('specs', updated);
  };

  const handleRemoveSpec = (index) => {
    const updated = (formData.specs || []).filter((_, i) => i !== index);
    onUpdateField('specs', updated.length ? updated : ['']);
  };

  return (
    <div id="section-project-info" className="space-y-6">
      {/* Header Card (Clean Light Theme matching media_1792173809775_e8eaea16.png) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6E8EC] shadow-[0_2px_12px_rgba(20,24,32,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">01. Project Information &amp; Client Setup</h2>
              <p className="text-xs text-[#64748B]">Specify project identifiers, client credentials, and applicable specifications.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF5EA] text-[#D97706] font-bold border border-[#FDE3C7]">
            Section 01
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Estimation Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Estimation / BOQ No.</label>
            <input
              type="text"
              value={formData.estNo || ''}
              onChange={(e) => onUpdateField('estNo', e.target.value)}
              placeholder="e.g. EST-2026-PKG-001"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          {/* Customer / Client */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Client / Customer Name</label>
            <input
              type="text"
              value={formData.customer || ''}
              onChange={(e) => onUpdateField('customer', e.target.value)}
              placeholder="e.g. National Petroleum Refining Corp."
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Project Title</label>
            <input
              type="text"
              value={formData.projectName || ''}
              onChange={(e) => onUpdateField('projectName', e.target.value)}
              placeholder="e.g. Crude Distillation Unit (CDU) Piping"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Project Location / Yard</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => onUpdateField('location', e.target.value)}
              placeholder="e.g. Coastal Industrial Estate, Yard A"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          {/* Currency Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#D97706]" />
              Commercial Currency
            </label>
            <select
              value={formData.currency || 'INR'}
              onChange={(e) => onUpdateField('currency', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] focus:outline-none cursor-pointer transition"
            >
              {Object.entries(CURRENCY_CONFIG).map(([currKey, config]) => (
                <option key={currKey} value={currKey}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Date of Estimation</label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => onUpdateField('date', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] focus:outline-none transition"
            />
          </div>

          {/* Estimator */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Prepared By (Estimator)</label>
            <input
              type="text"
              value={formData.estimator || ''}
              onChange={(e) => onUpdateField('estimator', e.target.value)}
              placeholder="e.g. Lead Commercial Engineer"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          {/* Checked By */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569]">Checked / Verified By</label>
            <input
              type="text"
              value={formData.checkedBy || ''}
              onChange={(e) => onUpdateField('checkedBy', e.target.value)}
              placeholder="e.g. Estimation Manager / DGM"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Project Specifications Dynamic Table */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6E8EC] shadow-[0_2px_12px_rgba(20,24,32,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-sm font-bold text-[#1E293B]">Applicable Project Specifications &amp; Standards</h3>
          </div>
          <button
            onClick={handleAddSpec}
            className="px-2.5 py-1 rounded-lg bg-[#FFF5EA] hover:bg-[#FFEBD4] text-[#D97706] text-xs font-semibold flex items-center gap-1 transition border border-[#FDE3C7] shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Specification
          </button>
        </div>

        <div className="space-y-2.5">
          {(formData.specs || ['']).map((spec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 w-6 text-center">{idx + 1}.</span>
              <input
                type="text"
                value={spec}
                onChange={(e) => handleUpdateSpec(idx, e.target.value)}
                placeholder="e.g. DEP 30.48.00.31-Gen / ISO 12944 Category C5 Specification"
                className="flex-1 px-3 py-2 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
              />
              {(formData.specs || []).length > 1 && (
                <button
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Remove Specification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dual Action Bottom Toolbar */}
      {onNavigateNext && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Fields
          </button>

          <button
            onClick={onNavigateNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-105 transition cursor-pointer"
          >
            <span>Next: Company Scope</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
