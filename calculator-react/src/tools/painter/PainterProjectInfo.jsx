// src/tools/painter/PainterProjectInfo.jsx
import React, { useRef } from 'react';
import { 
  User, 
  Upload, 
  Trash2, 
  Layers, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Info,
  ArrowRight
} from 'lucide-react';
import { 
  PAINT_GENERIC_OPTIONS, 
  PAINT_MFR_OPTIONS, 
  COATING_SYSTEM_DEFAULTS, 
  COAT_SIDS 
} from '../../data/painterDatabase';

export default function PainterProjectInfo({
  formData,
  onChange,
  onPhotoUpload,
  onPhotoRemove,
  onSyncCoatingSystem
}) {
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  // Coating system table rows
  const csRows = formData?._coatingSystem || COATING_SYSTEM_DEFAULTS;

  const handleCSRowChange = (index, field, value) => {
    const updated = [...csRows];
    updated[index] = { ...updated[index], [field]: value };
    onChange('_coatingSystem', updated);
  };

  const handleAddCSRow = () => {
    const nextAct = `Intermediate Coat ${csRows.length}`;
    const newRow = {
      act: nextAct,
      generic: "Epoxy High Build",
      mfr: "Jotun",
      brand: "Jotamastic 90",
      coats: "1",
      min: "100",
      max: "125",
      shade: "Grey"
    };
    onChange('_coatingSystem', [...csRows, newRow]);
  };

  const handleRemoveCSRow = (index) => {
    if (csRows.length <= 1) return;
    const updated = csRows.filter((_, i) => i !== index);
    onChange('_coatingSystem', updated);
  };

  const handleResetCS = () => {
    if (window.confirm('Reset Coating System specification to default 2-coat starter system?')) {
      onChange('_coatingSystem', COATING_SYSTEM_DEFAULTS);
    }
  };

  // Cumulative DFT totals
  let totalCoats = 0;
  let cumMin = 0;
  let cumMax = 0;
  const computedRows = csRows.map(row => {
    const coats = parseInt(row.coats) || 1;
    const mn = parseFloat(row.min);
    const mx = parseFloat(row.max);
    totalCoats += coats;
    if (!isNaN(mn)) cumMin += mn * coats;
    if (!isNaN(mx)) cumMax += mx * coats;
    return {
      ...row,
      tmin: isNaN(cumMin) ? '—' : cumMin.toFixed(0),
      tmax: isNaN(cumMax) ? '—' : cumMax.toFixed(0)
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Operator Passport Photo Upload + Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Photo Slot */}
          <div className="relative w-28 h-32 rounded-xl border-2 border-dashed border-[#E87B1E]/50 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 group shadow-xs">
            {formData?._opPhoto ? (
              <>
                <img
                  src={formData._opPhoto}
                  alt="Operator Portrait"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onPhotoRemove}
                  className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md text-xs opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-slate-400 p-2 text-center cursor-pointer hover:text-[#E87B1E] transition"
              >
                <User className="w-8 h-8 text-slate-300 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Tap to Upload
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5">Passport Photo</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoUpload}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 font-rajdhani uppercase tracking-wider">
              Operator Photographic Identification
            </h3>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Upload a clear, front-facing portrait photograph of the spray painter. Image will be embedded into the official 3-page A4 qualification dossier and qualification card.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{formData?._opPhoto ? 'Change Photo' : 'Upload Image'}</span>
              </button>
              {formData?._opPhoto && (
                <button
                  type="button"
                  onClick={onPhotoRemove}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 max-w-sm space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Info className="w-4 h-4 text-amber-600" />
            <span>ASTM D 4228 Qualification Standard</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-snug">
            Painter qualification is valid for the specific coating system, substrate configuration, and spray application equipment evaluated during this assessment.
          </p>
        </div>
      </div>

      {/* Section A: Project & Client Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Section A: Project &amp; Client Details
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Report Number *
            </label>
            <input
              type="text"
              value={formData?.['f-rep-no'] || ''}
              onChange={(e) => handleInputChange('f-rep-no', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. SP-QR-20260830-OP-001"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Report Date
            </label>
            <input
              type="date"
              value={formData?.['f-rep-date'] || ''}
              onChange={(e) => handleInputChange('f-rep-date', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Project Number
            </label>
            <input
              type="text"
              value={formData?.['f-proj-no'] || ''}
              onChange={(e) => handleInputChange('f-proj-no', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. PRJ-2026-FLARE-09"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData?.['f-proj'] || ''}
              onChange={(e) => handleInputChange('f-proj', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-medium"
              placeholder="e.g. Offshore Topsides Gas Flare Platform Project"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Client / Asset Owner
            </label>
            <input
              type="text"
              value={formData?.['f-client'] || ''}
              onChange={(e) => handleInputChange('f-client', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Aramco / Offshore Energy Corp"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Contractor Name
            </label>
            <input
              type="text"
              value={formData?.['f-contractor'] || ''}
              onChange={(e) => handleInputChange('f-contractor', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. BG Engineering & Contracting Ltd"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Applicator / Employer
            </label>
            <input
              type="text"
              value={formData?.['f-employer'] || ''}
              onChange={(e) => handleInputChange('f-employer', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Industrial Coatings Marine Div"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Evaluation Location
            </label>
            <input
              type="text"
              value={formData?.['f-location'] || ''}
              onChange={(e) => handleInputChange('f-location', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Fabrication Yard 4 · Paint Bay"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Reference Standards &amp; Codes
            </label>
            <input
              type="text"
              value={formData?.['f-ref'] || ''}
              onChange={(e) => handleInputChange('f-ref', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. ASTM D 4228, SSPC PA-2, ASTM D7091, ASTM D3359, ASTM D4541, NACE / AMPP"
            />
          </div>
        </div>
      </div>

      {/* Section B: Operator Biographical Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Section B: Operator Identification &amp; Credentials
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Personnel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Name of Operator *
            </label>
            <input
              type="text"
              value={formData?.['f-name'] || ''}
              onChange={(e) => handleInputChange('f-name', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-bold"
              placeholder="e.g. Mohammad Tariq"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Operator Category *
            </label>
            <select
              value={formData?.['f-category'] || 'Airless Spray Painter'}
              onChange={(e) => handleInputChange('f-category', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-medium"
            >
              <option value="Airless Spray Painter">Airless Spray Painter</option>
              <option value="Conventional Air Spray Painter">Conventional Air Spray Painter</option>
              <option value="Plural Component Spray Painter">Plural Component Spray Painter</option>
              <option value="Industrial Painter / Applicator">Industrial Painter / Applicator</option>
              <option value="Coating Blaster & Painter">Coating Blaster & Painter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Civil ID / Passport No. *
            </label>
            <input
              type="text"
              value={formData?.['f-civil'] || ''}
              onChange={(e) => handleInputChange('f-civil', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. CID-8829471"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={formData?.['f-nationality'] || ''}
              onChange={(e) => handleInputChange('f-nationality', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Indian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData?.['f-dob'] || ''}
              onChange={(e) => handleInputChange('f-dob', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              value={formData?.['f-exp'] || ''}
              onChange={(e) => handleInputChange('f-exp', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-mono"
              placeholder="e.g. 6"
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Qualification Date
            </label>
            <input
              type="date"
              value={formData?.['f-qual-date'] || ''}
              onChange={(e) => handleInputChange('f-qual-date', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Next Assessment Due / Expiry Date
            </label>
            <input
              type="date"
              value={formData?.['f-next-date'] || ''}
              onChange={(e) => handleInputChange('f-next-date', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Section C: Coating System Specification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Section C: Coating System Specification (Scope of Qualification)
              </h3>
              <p className="text-xs text-slate-500">Defines the full multi-coat paint system for qualification stages (s1 to s4)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncCoatingSystem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#E87B1E] hover:bg-[#F39322] transition shadow-xs cursor-pointer"
              title="Push generic name, manufacturer, brand, shade and cumulative DFT into s1..s4 coat sheets"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Sync to Coat Stages (s1–s4)</span>
            </button>
            <button
              type="button"
              onClick={handleResetCS}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Reset to default system"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Substrate Preparation Spec */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Substrate Surface Preparation Requirement
          </label>
          <input
            type="text"
            value={formData?.['cs-surf-prep'] || ''}
            onChange={(e) => handleInputChange('cs-surf-prep', e.target.value)}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-medium"
            placeholder="e.g. Abrasive Blast Cleaning Sa 2.5 (Near White Metal Finish) · Surface Profile 50–75 µm"
          />
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white font-rajdhani uppercase text-[11px] tracking-wider">
                <th className="p-2.5">Activity</th>
                <th className="p-2.5">Paint Generic Name</th>
                <th className="p-2.5">Manufacturer</th>
                <th className="p-2.5">Brand / Product</th>
                <th className="p-2.5 text-center w-16">Coats</th>
                <th className="p-2.5 text-center w-18">Min DFT (µm)</th>
                <th className="p-2.5 text-center w-18">Max DFT (µm)</th>
                <th className="p-2.5 text-center w-20 bg-[#9E1B1E]/40">Cum. Min</th>
                <th className="p-2.5 text-center w-20 bg-[#9E1B1E]/40">Cum. Max</th>
                <th className="p-2.5">Color Shade / RAL</th>
                <th className="p-2.5 text-center w-12">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {computedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40 transition">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.act || ''}
                      onChange={(e) => handleCSRowChange(idx, 'act', e.target.value)}
                      className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none font-medium"
                      placeholder="e.g. Primer Coat"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      list="paint-generic-options"
                      value={row.generic || ''}
                      onChange={(e) => handleCSRowChange(idx, 'generic', e.target.value)}
                      className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      placeholder="Select / Type Generic"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      list="paint-mfr-options"
                      value={row.mfr || ''}
                      onChange={(e) => handleCSRowChange(idx, 'mfr', e.target.value)}
                      className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      placeholder="e.g. Jotun"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.brand || ''}
                      onChange={(e) => handleCSRowChange(idx, 'brand', e.target.value)}
                      className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      placeholder="e.g. Resist 86"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={row.coats || '1'}
                      onChange={(e) => handleCSRowChange(idx, 'coats', e.target.value)}
                      className="w-12 text-center text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded p-1"
                      min="1"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={row.min || ''}
                      onChange={(e) => handleCSRowChange(idx, 'min', e.target.value)}
                      className="w-14 text-center text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded p-1"
                      placeholder="65"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={row.max || ''}
                      onChange={(e) => handleCSRowChange(idx, 'max', e.target.value)}
                      className="w-14 text-center text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded p-1"
                      placeholder="75"
                    />
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-[#9E1B1E] bg-[#9E1B1E]/5">
                    {row.tmin} µm
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-[#9E1B1E] bg-[#9E1B1E]/5">
                    {row.tmax} µm
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.shade || ''}
                      onChange={(e) => handleCSRowChange(idx, 'shade', e.target.value)}
                      className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      placeholder="e.g. RAL 9010"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveCSRow(idx)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                      title="Remove Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-800 font-rajdhani text-xs">
                <td colSpan="4" className="p-2.5 text-right uppercase">
                  Total System DFT Range:
                </td>
                <td className="p-2.5 text-center font-mono">{totalCoats}</td>
                <td colSpan="2" className="p-2.5 text-center text-slate-500">—</td>
                <td className="p-2.5 text-center font-mono text-[#9E1B1E] bg-[#9E1B1E]/10">
                  {cumMin.toFixed(0)} µm
                </td>
                <td className="p-2.5 text-center font-mono text-[#9E1B1E] bg-[#9E1B1E]/10">
                  {cumMax.toFixed(0)} µm
                </td>
                <td colSpan="2" className="p-2.5 text-slate-500 text-[11px] font-normal">
                  (Cumulative Target Band)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Button: Add Row */}
        <button
          type="button"
          onClick={handleAddCSRow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E87B1E]" />
          <span>Add Coat Stage Row</span>
        </button>

        {/* HTML5 Datalists */}
        <datalist id="paint-generic-options">
          {PAINT_GENERIC_OPTIONS.map((opt, i) => (
            <option key={i} value={opt} />
          ))}
        </datalist>
        <datalist id="paint-mfr-options">
          {PAINT_MFR_OPTIONS.map((opt, i) => (
            <option key={i} value={opt} />
          ))}
        </datalist>
      </div>

    </div>
  );
}
