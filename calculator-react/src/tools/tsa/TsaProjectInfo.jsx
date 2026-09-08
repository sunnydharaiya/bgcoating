import React, { useState } from 'react';
import { 
  User, 
  Upload, 
  Trash2, 
  Clipboard, 
  Building2, 
  ShieldCheck, 
  Plus, 
  RotateCcw, 
  RefreshCw, 
  FileText, 
  Wrench,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  TSA_COATING_SYSTEM_DEFAULTS, 
  TSA_MAT_DEFAULTS 
} from '../../data/tsaDatabase';

export default function TsaProjectInfo({
  formData,
  onChange,
  onSyncCoatingSystem
}) {
  const [pasteActive, setPasteActive] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange?.('op-photo', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePastePhoto = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (ev) => {
              onChange?.('op-photo', ev.target.result);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      alert('No image found on clipboard. Copy an image first, then click Paste.');
    } catch (err) {
      alert('Clipboard read error or permission denied: ' + err.message);
    }
  };

  // Coating System table helpers
  const coatingSystem = formData?.coatingSystem || TSA_COATING_SYSTEM_DEFAULTS;

  const handleAddCoatingRow = () => {
    const nextNum = coatingSystem.length + 1;
    const newRow = {
      act: `${nextNum === 3 ? '2nd' : nextNum === 4 ? '3rd' : `${nextNum}th`} Coat`,
      generic: 'Polyurethane Topcoat',
      mfr: 'Jotun / AkzoNobel',
      brand: 'Hardtop AX',
      coats: '1',
      min: '50',
      max: '75',
      shade: 'RAL 7035 Light Grey'
    };
    const updated = [...coatingSystem, newRow];
    onChange?.('coatingSystem', updated);
  };

  const handleRemoveCoatingRow = (idx) => {
    if (coatingSystem.length <= 1) {
      alert('At least one coat activity row is required.');
      return;
    }
    const updated = coatingSystem.filter((_, i) => i !== idx);
    onChange?.('coatingSystem', updated);
  };

  const handleUpdateCoatingRow = (idx, field, value) => {
    const updated = coatingSystem.map((row, i) => {
      if (i === idx) return { ...row, [field]: value };
      return row;
    });
    onChange?.('coatingSystem', updated);
  };

  const handleResetCoatingSystem = () => {
    if (window.confirm('Reset Coating System table back to default 2-stage Thermal Spray specifications?')) {
      onChange?.('coatingSystem', JSON.parse(JSON.stringify(TSA_COATING_SYSTEM_DEFAULTS)));
    }
  };

  // Compute cumulative DFT totals
  let cumMin = 0, cumMax = 0, totalCoats = 0;
  const coatingRowsWithTotals = coatingSystem.map((row) => {
    const coats = parseInt(row.coats) || 1;
    const rMin = parseFloat(row.min) || 0;
    const rMax = parseFloat(row.max) || 0;
    totalCoats += coats;
    cumMin += rMin * coats;
    cumMax += rMax * coats;
    return {
      ...row,
      tmin: cumMin,
      tmax: cumMax
    };
  });

  // Thermal Spray Material Details (10 rows split into 2 tables)
  const tsaMaterials = formData?.tsaMaterials || TSA_MAT_DEFAULTS;
  const half = Math.ceil(tsaMaterials.length / 2);
  const leftMat = tsaMaterials.slice(0, half);
  const rightMat = tsaMaterials.slice(half);

  const handleUpdateMatRow = (idx, field, value) => {
    const updated = tsaMaterials.map((r, i) => {
      if (i === idx) return { ...r, [field]: value };
      return r;
    });
    onChange?.('tsaMaterials', updated);
  };

  const handleAddMatRow = (side) => {
    const newRow = { desc: 'Custom Wire Spec', detail: 'Actual Value' };
    let updated;
    if (side === 'left') {
      updated = [...tsaMaterials.slice(0, half), newRow, ...tsaMaterials.slice(half)];
    } else {
      updated = [...tsaMaterials, newRow];
    }
    onChange?.('tsaMaterials', updated);
  };

  const handleRemoveMatRow = (idx) => {
    if (tsaMaterials.length <= 1) {
      alert('At least one material specification row is required.');
      return;
    }
    const updated = tsaMaterials.filter((_, i) => i !== idx);
    onChange?.('tsaMaterials', updated);
  };

  const handleResetMaterials = () => {
    if (window.confirm('Reset Thermal Spray Material specifications to default 10 standard items?')) {
      onChange?.('tsaMaterials', JSON.parse(JSON.stringify(TSA_MAT_DEFAULTS)));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Operator Portrait Photo Upload Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
            📸 Operator Photograph
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FDF1E6] dark:bg-[#E87B1E]/20 text-[#E87B1E]">
            Required for ID Card & Printed Report Dossier
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Portrait Box */}
          <div className="relative w-32 h-40 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-2 group hover:border-[#E87B1E] transition-colors shrink-0">
            {formData?.['op-photo'] ? (
              <>
                <img
                  src={formData['op-photo']}
                  alt="Operator"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange?.('op-photo', '')}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md hover:bg-rose-700 transition"
                  title="Remove Photo"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <User className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-400">Tap to Upload</span>
                <span className="text-[8px] text-slate-400 leading-tight mt-0.5">JPG/PNG Passport Photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Guidelines & Actions */}
          <div className="flex-1 space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <p className="leading-relaxed">
              Upload a recent formal passport-style portrait photo of the operator. The photo will be permanently embedded in the printed multi-page PDF/Excel qualification dossier and certificate.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="px-3.5 py-1.5 rounded-xl bg-[#E87B1E] text-white font-bold text-xs shadow-xs hover:bg-[#9E1B1E] transition flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handlePastePhoto}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5 text-amber-500" />
                <span>Paste from Clipboard</span>
              </button>

              {formData?.['op-photo'] && (
                <button
                  type="button"
                  onClick={() => onChange?.('op-photo', '')}
                  className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project & General Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-5 h-5 text-[#E87B1E]" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Project & Contractual Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Report Number (Auto-Generated)
            </label>
            <input
              type="text"
              readOnly
              value={formData?.['f-rep-no'] || 'AUTO-GENERATED ON SAVE'}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#E87B1E] font-mono font-bold text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Report Date
            </label>
            <input
              type="date"
              value={formData?.['f-rep-date'] || ''}
              onChange={(e) => onChange?.('f-rep-date', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData?.['f-proj'] || ''}
              onChange={(e) => onChange?.('f-proj', e.target.value)}
              placeholder="e.g. NFS North Field South Offshore"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Project Number
            </label>
            <input
              type="text"
              value={formData?.['f-proj-no'] || ''}
              onChange={(e) => onChange?.('f-proj-no', e.target.value)}
              placeholder="e.g. NFS-QATAR-2026"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Client / Facility Owner
            </label>
            <input
              type="text"
              value={formData?.['f-client'] || ''}
              onChange={(e) => onChange?.('f-client', e.target.value)}
              placeholder="e.g. QatarEnergy LNG / TotalEnergies"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              EPC Contractor
            </label>
            <input
              type="text"
              value={formData?.['f-epc'] || ''}
              onChange={(e) => onChange?.('f-epc', e.target.value)}
              placeholder="e.g. McDermott / Technip"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Coating Contractor
            </label>
            <input
              type="text"
              value={formData?.['f-contractor'] || ''}
              onChange={(e) => onChange?.('f-contractor', e.target.value)}
              placeholder="e.g. BG Group Thermal Spray Division"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Work Location / Yard
            </label>
            <input
              type="text"
              value={formData?.['f-location'] || ''}
              onChange={(e) => onChange?.('f-location', e.target.value)}
              placeholder="e.g. Ras Laffan Yard / Offshore Topsides"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Reference Standards
            </label>
            <input
              type="text"
              value={formData?.['f-ref'] || ''}
              onChange={(e) => onChange?.('f-ref', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Operator Identification */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5 text-[#E87B1E]" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            TSA Applicator / Operator Identification
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData?.['f-name'] || ''}
              onChange={(e) => onChange?.('f-name', e.target.value)}
              placeholder="Operator full legal name"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={formData?.['f-category'] || 'TSA Operator'}
              onChange={(e) => onChange?.('f-category', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            >
              <option value="TSA Operator">TSA Operator</option>
              <option value="Thermal Spray Operator">Thermal Spray Operator</option>
              <option value="Twin Wire Arc Operator">Twin Wire Arc Operator</option>
              <option value="Metallizing Operator">Metallizing Operator</option>
              <option value="Thermal Spray Applicator">Thermal Spray Applicator</option>
              <option value="Coating Inspector">Coating Inspector</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Civil ID / Passport No *
            </label>
            <input
              type="text"
              value={formData?.['f-civil'] || ''}
              onChange={(e) => onChange?.('f-civil', e.target.value)}
              placeholder="e.g. QID-882910482"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-mono font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={formData?.['f-nationality'] || ''}
              onChange={(e) => onChange?.('f-nationality', e.target.value)}
              placeholder="e.g. INDIAN / FILIPINO / QATARI"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData?.['f-dob'] || ''}
              onChange={(e) => onChange?.('f-dob', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              step="0.5"
              value={formData?.['f-exp'] || ''}
              onChange={(e) => onChange?.('f-exp', e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Employer Organization
            </label>
            <input
              type="text"
              value={formData?.['f-employer'] || ''}
              onChange={(e) => onChange?.('f-employer', e.target.value)}
              placeholder="Employer company"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Qualification Date
            </label>
            <input
              type="date"
              value={formData?.['f-qual-date'] || ''}
              onChange={(e) => onChange?.('f-qual-date', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Next Assessment Due Date (12 Mo.)
            </label>
            <input
              type="date"
              value={formData?.['f-next-date'] || ''}
              onChange={(e) => onChange?.('f-next-date', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Coating System Specification Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E87B1E]" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Coating System Specification Scope
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines the qualified application scope. Products and DFT ranges entered here are mirrored to per-coat stage inspection sheets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncCoatingSystem}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Push generic names, brands, shades and cumulative DFT to coat stages"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>Auto-Sync to Coats</span>
            </button>
          </div>
        </div>

        {/* Surface Prep Spec */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Surface Preparation Standard & Anchor Profile Requirement
          </label>
          <input
            type="text"
            value={formData?.['cs-surf-prep'] || ''}
            onChange={(e) => onChange?.('cs-surf-prep', e.target.value)}
            placeholder="e.g. SSPC-SP5 / NACE No.1 · White Metal Blast Cleaning · Profile: 75–100 µm Angular"
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th rowSpan={2} className="p-3">Activity</th>
                <th rowSpan={2} className="p-3">Coating Generic Name</th>
                <th rowSpan={2} className="p-3">Manufacturer</th>
                <th rowSpan={2} className="p-3">Brand / Wire Spec</th>
                <th rowSpan={2} className="p-3 text-center w-16">Coats</th>
                <th colSpan={2} className="p-2 text-center border-l border-slate-200 dark:border-slate-700">Req. DFT (µm)</th>
                <th colSpan={2} className="p-2 text-center border-l border-slate-200 dark:border-slate-700 bg-amber-500/10 text-[#E87B1E]">Total Cum. (µm)</th>
                <th rowSpan={2} className="p-3 border-l border-slate-200 dark:border-slate-700">Color Shade / RAL</th>
                <th rowSpan={2} className="p-3 text-center w-12">✕</th>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="p-2 text-center border-l border-slate-200 dark:border-slate-700 w-16">Min</th>
                <th className="p-2 text-center w-16">Max</th>
                <th className="p-2 text-center border-l border-slate-200 dark:border-slate-700 w-16 bg-amber-500/10 text-[#E87B1E]">Min</th>
                <th className="p-2 text-center w-16 bg-amber-500/10 text-[#E87B1E]">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coatingRowsWithTotals.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-2 font-medium">
                    <input
                      type="text"
                      value={row.act}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'act', e.target.value)}
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2 font-semibold">
                    <input
                      type="text"
                      value={row.generic}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'generic', e.target.value)}
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.mfr}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'mfr', e.target.value)}
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.brand}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'brand', e.target.value)}
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={row.coats}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'coats', e.target.value)}
                      className="w-12 text-center bg-transparent px-1 py-1 rounded border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </td>
                  <td className="p-2 text-center border-l border-slate-200 dark:border-slate-700">
                    <input
                      type="number"
                      value={row.min}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'min', e.target.value)}
                      className="w-14 text-center bg-transparent px-1 py-1 rounded border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={row.max}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'max', e.target.value)}
                      className="w-14 text-center bg-transparent px-1 py-1 rounded border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </td>
                  <td className="p-2 text-center font-bold text-[#E87B1E] border-l border-slate-200 dark:border-slate-700 bg-amber-500/5 font-mono">
                    {row.tmin}
                  </td>
                  <td className="p-2 text-center font-bold text-[#E87B1E] bg-amber-500/5 font-mono">
                    {row.tmax}
                  </td>
                  <td className="p-2 border-l border-slate-200 dark:border-slate-700">
                    <input
                      type="text"
                      value={row.shade}
                      onChange={(e) => handleUpdateCoatingRow(idx, 'shade', e.target.value)}
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveCoatingRow(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Remove Row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FDF1E6] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-t-2 border-[#E87B1E]/40">
                <td colSpan={4} className="p-3 text-right text-[#E87B1E] uppercase tracking-wider">
                  Total Nos of Coat & Total Cumulative System DFT:
                </td>
                <td className="p-3 text-center font-mono text-base">{totalCoats}</td>
                <td colSpan={2} className="p-3 text-center text-slate-400">—</td>
                <td className="p-3 text-center font-mono text-base text-[#E87B1E] border-l border-slate-200 dark:border-slate-700">
                  {cumMin}
                </td>
                <td className="p-3 text-center font-mono text-base text-[#E87B1E]">
                  {cumMax}
                </td>
                <td colSpan={2} className="p-3 text-right text-xs font-normal text-slate-500">
                  µm System Target
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleAddCoatingRow}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Add Coat Activity Row</span>
          </button>
          <button
            type="button"
            onClick={handleResetCoatingSystem}
            className="px-3.5 py-2 rounded-xl text-slate-500 hover:text-rose-600 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard 2-Coat System</span>
          </button>
        </div>
      </div>

      {/* Thermal Spray Material Details (2 Side-by-Side Tables) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#E87B1E]" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Thermal Spray Material Details
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              10 Standard wire & metallurgical parameters. Editable values automatically populate to all per-coat inspection sheets and printed reports.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetMaterials}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset to Default 10 Rows</span>
          </button>
        </div>

        {/* 2 Side-by-Side Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5 w-5/12">Description</th>
                  <th className="p-2.5">Details</th>
                  <th className="p-2.5 text-center w-8">✕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leftMat.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                    <td className="p-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20">
                      {i < 5 ? (
                        r.desc
                      ) : (
                        <input
                          type="text"
                          value={r.desc}
                          onChange={(e) => handleUpdateMatRow(i, 'desc', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-300 outline-none"
                        />
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={r.detail}
                        onChange={(e) => handleUpdateMatRow(i, 'detail', e.target.value)}
                        className="w-full bg-transparent px-2 py-1 rounded border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none font-semibold text-slate-800 dark:text-slate-100"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMatRow(i)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleAddMatRow('left')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#E87B1E] text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-500" />
                <span>Add Row</span>
              </button>
            </div>
          </div>

          {/* Right Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5 w-5/12">Description</th>
                  <th className="p-2.5">Details</th>
                  <th className="p-2.5 text-center w-8">✕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rightMat.map((r, j) => {
                  const actualIdx = half + j;
                  return (
                    <tr key={j} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2 text-center font-mono font-bold text-slate-400">{actualIdx + 1}</td>
                      <td className="p-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20">
                        {actualIdx < 10 ? (
                          r.desc
                        ) : (
                          <input
                            type="text"
                            value={r.desc}
                            onChange={(e) => handleUpdateMatRow(actualIdx, 'desc', e.target.value)}
                            className="w-full bg-transparent border-b border-dashed border-slate-300 outline-none"
                          />
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={r.detail}
                          onChange={(e) => handleUpdateMatRow(actualIdx, 'detail', e.target.value)}
                          className="w-full bg-transparent px-2 py-1 rounded border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none font-semibold text-slate-800 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMatRow(actualIdx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleAddMatRow('right')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#E87B1E] text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-500" />
                <span>Add Row</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
