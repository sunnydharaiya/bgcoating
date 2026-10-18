import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Scale,
  ArrowRight,
  Save,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  CURRENCY_CONFIG,
  MOC_OPTIONS,
  SURFACE_PREP_OPTIONS,
  STRUCTURE_OPTIONS
} from '../../data/manpowerDatabase';

export default function ManpowerProjectInfo({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    totalDays,
    reqBlastDays,
    blastingSetups,
    dailyTarget,
    formatNum
  } = metrics;

  // Accordion toggle states (all open by default as in 1.png)
  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);
  const [openC, setOpenC] = useState(true);

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      
      {/* MODULE 1 BANNER (Matches 1.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 1
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Project Information &amp; Basic Requirements
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          Master project details — customer, contact, specifications, environment, project duration. These values drive ALL downstream cost calculations.
        </p>
      </div>

      {/* SECTION A: Project Details */}
      <div id="section-project-details" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        {/* Accordion Header Bar */}
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907] flex items-center gap-2">
                <span>Project Details</span>
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Customer, contact, specifications
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION A
            </span>
            {openA ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {/* Section Body */}
        {openA && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Estimation Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ESTIMATION NUMBER
                </label>
                <input
                  type="text"
                  value={state.estNo || ''}
                  onChange={(e) => handleFieldChange('estNo', e.target.value)}
                  placeholder="e.g. EST-2026-001"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PROJECT NAME <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={state.projectName || ''}
                  onChange={(e) => handleFieldChange('projectName', e.target.value)}
                  placeholder="e.g. Refinery Storage Tank"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Project Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PROJECT NUMBER
                </label>
                <input
                  type="text"
                  value={state.projectNo || ''}
                  onChange={(e) => handleFieldChange('projectNo', e.target.value)}
                  placeholder="e.g. SG-2025-001"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Specification & Rev */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SPECIFICATION &amp; REV
                </label>
                <input
                  type="text"
                  value={state.spec || ''}
                  onChange={(e) => handleFieldChange('spec', e.target.value)}
                  placeholder="e.g. SPEC-001 Rev 02"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  CUSTOMER NAME
                </label>
                <input
                  type="text"
                  value={state.customer || ''}
                  onChange={(e) => handleFieldChange('customer', e.target.value)}
                  placeholder="e.g. ABC Refinery Ltd."
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  CONTACT PERSON
                </label>
                <input
                  type="text"
                  value={state.contactPerson || ''}
                  onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  placeholder="Person name"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

              {/* Project Location (Full Width on single/mobile) */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PROJECT LOCATION
                </label>
                <input
                  type="text"
                  value={state.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g. Surat, Gujarat"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION B: Basic Requirements */}
      <div id="section-basic-requirements" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        {/* Accordion Header Bar */}
        <button
          type="button"
          onClick={() => setOpenB(!openB)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Basic Requirements
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Environment, MOC, surface preparation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION B
            </span>
            {openB ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {/* Section Body */}
        {openB && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Environment Condition */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ENVIRONMENT CONDITION
                </label>
                <select
                  value={state.envCondition || 'C1'}
                  onChange={(e) => handleFieldChange('envCondition', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  <option value="C1">C1 — Very Low Corrosivity</option>
                  <option value="C2">C2 — Low Corrosivity</option>
                  <option value="C3">C3 — Medium Corrosivity</option>
                  <option value="C4">C4 — High Corrosivity</option>
                  <option value="C5">C5 — Very High Corrosivity</option>
                  <option value="CX">CX — Extreme Offshore</option>
                </select>
              </div>

              {/* Transportation Mode */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  TRANSPORTATION MODE
                </label>
                <select
                  value={state.transportMode || 'By Road'}
                  onChange={(e) => handleFieldChange('transportMode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  <option value="By Road">By Road</option>
                  <option value="By Rail">By Rail</option>
                  <option value="By Sea / Vessel">By Sea / Vessel</option>
                  <option value="On-Site / Yard Fabrication">On-Site / Yard Fabrication</option>
                </select>
              </div>

              {/* Painting Warranty (Years) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PAINTING WARRANTY (YEARS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={state.warranty ?? 5}
                    onChange={(e) => handleFieldChange('warranty', e.target.value)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    yrs
                  </span>
                </div>
              </div>

              {/* MOC / Substrate */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MOC / SUBSTRATE
                </label>
                <select
                  value={state.moc || 'CS'}
                  onChange={(e) => handleFieldChange('moc', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  {MOC_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Surface Preparation */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SURFACE PREPARATION
                </label>
                <select
                  value={state.surfacePrep || 'Sa2.5'}
                  onChange={(e) => handleFieldChange('surfacePrep', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  {SURFACE_PREP_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Cyclic Service? */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  CYCLIC SERVICE?
                </label>
                <select
                  value={state.cyclic || 'No'}
                  onChange={(e) => handleFieldChange('cyclic', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (&gt;60°C Severe Thermal Cycling)</option>
                </select>
              </div>

              {/* Fire Proofing? */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  FIRE PROOFING?
                </label>
                <select
                  value={state.fireproof || 'No'}
                  onChange={(e) => handleFieldChange('fireproof', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  <option value="No">NO</option>
                  <option value="Yes">YES — Intumescent / Cementitious</option>
                </select>
              </div>

              {/* Structure Item S */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  STRUCTURE ITEM S
                </label>
                <select
                  value={state.structure || 'Light'}
                  onChange={(e) => handleFieldChange('structure', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  {STRUCTURE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION C: Project Scale & Schedule */}
      <div id="section-scale-schedule" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        {/* Accordion Header Bar */}
        <button
          type="button"
          onClick={() => setOpenC(!openC)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Project Scale &amp; Schedule
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Surface area, duration, output (drives all calculations)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION C
            </span>
            {openC ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {/* Section Body */}
        {openC && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            {/* Row 1: Scale Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Total Tonnage */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  TOTAL TONNAGE <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={state.tonnage ?? ''}
                    onChange={(e) => handleFieldChange('tonnage', e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    MT
                  </span>
                </div>
              </div>

              {/* Surface Area */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SURFACE AREA <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={state.area ?? ''}
                    onChange={(e) => handleFieldChange('area', parseFloat(e.target.value) || 0)}
                    placeholder="25000"
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    m²
                  </span>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  CURRENCY
                </label>
                <select
                  value={state.currency || 'INR'}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                >
                  {Object.entries(CURRENCY_CONFIG).map(([code, cur]) => (
                    <option key={code} value={code}>{cur.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Row 2: Schedule & Shifts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              
              {/* Project Schedule (Months) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PROJECT SCHEDULE (MONTHS) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={state.months ?? 1}
                    onChange={(e) => handleFieldChange('months', parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    mos
                  </span>
                </div>
              </div>

              {/* Working Days Per Month */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  WORKING DAYS PER MONTH
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={state.wdays ?? 26}
                    onChange={(e) => handleFieldChange('wdays', parseFloat(e.target.value) || 26)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    days
                  </span>
                </div>
              </div>

              {/* Holiday Per Month */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  HOLIDAY PER MONTH
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={state.hdays ?? 0}
                    onChange={(e) => handleFieldChange('hdays', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    days
                  </span>
                </div>
              </div>

              {/* Working Shifts / Day */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  WORKING SHIFTS / DAY
                </label>
                <div className="relative">
                  <select
                    value={state.shifts ?? 1}
                    onChange={(e) => handleFieldChange('shifts', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs cursor-pointer"
                  >
                    <option value="1">1 Shift (8-10 Hours)</option>
                    <option value="2">2 Shifts (16 Hours)</option>
                    <option value="3">3 Shifts (24 Hours)</option>
                  </select>
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    shift
                  </span>
                </div>
              </div>

            </div>

            {/* Row 3: Productivities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              
              {/* Blasting Output / Shift */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  BLASTING OUTPUT / SHIFT
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={state.blastOutput ?? 50}
                    onChange={(e) => handleFieldChange('blastOutput', parseFloat(e.target.value) || 50)}
                    className="w-full px-3 py-2 pr-16 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    m²/shift
                  </span>
                </div>
              </div>

              {/* Painting Output / Shift */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PAINTING OUTPUT / SHIFT
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={state.paintOutput ?? 30}
                    onChange={(e) => handleFieldChange('paintOutput', parseFloat(e.target.value) || 30)}
                    className="w-full px-3 py-2 pr-16 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    m²/shift
                  </span>
                </div>
              </div>

              {/* Re-use Abrasive (Times) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  RE-USE ABRASIVE (TIMES)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={state.reuse ?? 1}
                    onChange={(e) => handleFieldChange('reuse', parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] focus:border-transparent transition shadow-2xs"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 pointer-events-none">
                    x
                  </span>
                </div>
              </div>

            </div>

            {/* 4 Calculated KPI Output Cards matching 1.png */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-orange-200/60">
              
              {/* Card 1: Required Days */}
              <div className="bg-[#F6FBFD] border border-[#BFDFEE] rounded-lg p-2.5 sm:p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  REQUIRED DAYS
                </span>
                <div className="text-sm sm:text-base font-mono font-black text-slate-800 my-1">
                  {reqBlastDays > 0 ? `${formatNum(reqBlastDays, 0)} days` : '— days'}
                </div>
                <span className="text-[8px] text-slate-400 leading-tight">
                  Area ÷ Output ÷ Shifts + Holidays
                </span>
              </div>

              {/* Card 2: Blasting Shifts */}
              <div className="bg-[#F6FBFD] border border-[#BFDFEE] rounded-lg p-2.5 sm:p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  BLASTING SHIFTS
                </span>
                <div className="text-sm sm:text-base font-mono font-black text-slate-800 my-1">
                  {blastingSetups ? `${blastingSetups} setups` : (totalDays > 0 ? `${(reqBlastDays / totalDays).toFixed(1)} mos` : 'NaN mos')}
                </div>
                <span className="text-[8px] text-slate-400 leading-tight">
                  Required for schedule
                </span>
              </div>

              {/* Card 3: Daily Output Target */}
              <div className="bg-[#F6FBFD] border border-[#BFDFEE] rounded-lg p-2.5 sm:p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  DAILY OUTPUT TARGET
                </span>
                <div className="text-sm sm:text-base font-mono font-black text-blue-600 my-1">
                  {formatNum(dailyTarget, 1)} <span className="text-[10px] font-normal text-slate-400">m²/day</span>
                </div>
                <span className="text-[8px] text-slate-400 leading-tight">
                  Target daily velocity
                </span>
              </div>

              {/* Card 4: Total Project Days */}
              <div className="bg-[#F6FBFD] border border-[#BFDFEE] rounded-lg p-2.5 sm:p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  TOTAL PROJECT DAYS
                </span>
                <div className="text-sm sm:text-base font-mono font-black text-slate-800 my-1">
                  {formatNum(totalDays, 0)} <span className="text-[10px] font-normal text-slate-400">days</span>
                </div>
                <span className="text-[8px] text-slate-400 leading-tight">
                  Months × WDays + Holidays
                </span>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR matching 1.png */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onSaveDraft) onSaveDraft();
              else window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'save-draft' } }));
            }}
            className="px-4 py-2 rounded-lg bg-[#3A2D5C] hover:bg-[#493974] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onValidate) onValidate();
              else window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'validate' } }));
            }}
            className="px-4 py-2 rounded-lg bg-[#1F7A4D] hover:bg-[#27945E] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>VALIDATE / APPROVAL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onReset) onReset();
              else window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'reset' } }));
            }}
            className="px-3.5 py-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FEECEC] border border-rose-300 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('blasting')}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-sm cursor-pointer uppercase font-mono"
        >
          <span>NEXT : BLASTING COST →</span>
        </button>
      </div>

      {/* BRANDED FOOTER matching 1.png */}
      <div className="bg-[#2B0E10] text-[#D8BDBE] rounded-xl p-4 sm:p-5 border-t-2 border-[#5C1E23] flex flex-col items-center justify-center text-center space-y-1.5 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide font-mono">
            BG GROUP <span className="text-xs font-normal text-rose-200">of Paint and Coating Consultant</span>
          </span>
        </div>
        <div className="text-[11px] text-rose-200/90 font-medium">
          Industrial Cost Estimation · Surface Protection · Coating Engineering
        </div>
        <div className="text-[10px] text-rose-300/60 font-mono flex flex-wrap justify-center gap-x-2">
          <span>E 103, Akash Echo Point, Bhimrad, Surat - 395007, Gujarat, India</span>
          <span>|</span>
          <span>+91 98258 10408</span>
          <span>|</span>
          <span>support@bgcoating.com</span>
          <span>|</span>
          <span>www.bgcoating.com</span>
        </div>
      </div>

    </div>
  );
}
