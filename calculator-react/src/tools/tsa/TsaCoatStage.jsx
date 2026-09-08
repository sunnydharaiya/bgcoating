import React from 'react';
import { 
  Flame, 
  Layers, 
  Clock, 
  Calendar, 
  Wrench, 
  Thermometer, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Trash2,
  Sparkles,
  Search,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { 
  TSA_STAGE_NAMES, 
  TSA_DFT_SUBSTRATES, 
  TSA_DFT_MINI_TYPES, 
  calcEnvRow, 
  calcCoatDFT, 
  TSA_APP_DEFAULTS, 
  TSA_DEFAULT_STAGE_TEST_INDICES, 
  TSA_TEST_CATALOG 
} from '../../data/tsaDatabase';

export default function TsaCoatStage({
  sid = 's1',
  formData,
  onChange,
  onOpenTestCatalog,
  onSyncCoatingSystem
}) {
  const stageName = TSA_STAGE_NAMES[sid] || `Stage ${sid.toUpperCase()}`;
  const isTSAStage = sid === 's1';
  const stageData = formData?.coatStages?.[sid] || {};
  const tsaMaterials = formData?.tsaMaterials || [];

  // Helper to update field in current coat stage
  const handleStageFieldChange = (field, value) => {
    const coatStages = formData?.coatStages || {};
    const currStage = coatStages[sid] || {};
    const updatedStage = { ...currStage, [field]: value };
    onChange?.('coatStages', {
      ...coatStages,
      [sid]: updatedStage
    });
  };

  // Environmental Multi-Hour Readings
  const envReadings = stageData.envReadings || [];

  const handleAddEnvReading = () => {
    const newReading = {
      time: new Date().toTimeString().slice(0, 5),
      db: '',
      wb: '',
      mt: ''
    };
    handleStageFieldChange('envReadings', [...envReadings, newReading]);
  };

  const handleUpdateEnvReading = (idx, field, value) => {
    const updated = envReadings.map((r, i) => {
      if (i === idx) return { ...r, [field]: value };
      return r;
    });
    handleStageFieldChange('envReadings', updated);
  };

  const handleRemoveEnvReading = (idx) => {
    const updated = envReadings.filter((_, i) => i !== idx);
    handleStageFieldChange('envReadings', updated);
  };

  // Application Parameters (9 items)
  const appParams = stageData.appParams || TSA_APP_DEFAULTS;
  const halfApp = Math.ceil(appParams.length / 2);
  const leftApp = appParams.slice(0, halfApp);
  const rightApp = appParams.slice(halfApp);

  const handleUpdateAppParam = (idx, field, value) => {
    const updated = appParams.map((p, i) => {
      if (i === idx) return { ...p, [field]: value };
      return p;
    });
    handleStageFieldChange('appParams', updated);
  };

  const handleResetAppParams = () => {
    if (window.confirm('Reset Thermal Spray Application Parameters to standard 9 items?')) {
      handleStageFieldChange('appParams', JSON.parse(JSON.stringify(TSA_APP_DEFAULTS)));
    }
  };

  // Tests
  const tests = stageData.tests || [];

  const handleUpdateTest = (idx, field, value) => {
    const updated = tests.map((t, i) => {
      if (i === idx) return { ...t, [field]: value };
      return t;
    });
    handleStageFieldChange('tests', updated);
  };

  const handleRemoveTest = (idx) => {
    const updated = tests.filter((_, i) => i !== idx);
    handleStageFieldChange('tests', updated);
  };

  const handleResetDefaultTests = () => {
    if (window.confirm(`Reset coating test parameters to standard template for ${stageName}?`)) {
      const defaultIndices = TSA_DEFAULT_STAGE_TEST_INDICES[sid] || [0, 7, 8, 9];
      const standardTests = defaultIndices.map(idx => {
        const item = TSA_TEST_CATALOG[idx];
        return {
          t: item.t,
          std: item.std,
          req: item.req,
          act: '',
          res: 'Pass'
        };
      });
      handleStageFieldChange('tests', standardTests);
    }
  };

  // 4-Mini-Table DFT Matrix
  const dftMini = stageData.dftMini || { plane: [], pipe: [], tbeam: [], flange: [] };
  const dftStats = calcCoatDFT(stageData);

  const handleUpdateDftSpot = (tableType, rowIdx, spotIdx, value) => {
    const tableRows = dftMini[tableType] || [];
    const updatedRows = tableRows.map((r, i) => {
      if (i === rowIdx) {
        const spots = [...(r.spots || [])];
        spots[spotIdx] = value;
        return { ...r, spots };
      }
      return r;
    });
    handleStageFieldChange('dftMini', {
      ...dftMini,
      [tableType]: updatedRows
    });
  };

  const handleLoadStandardDFT = () => {
    if (window.confirm(`Seed standard 4-mini-table DFT matrix (Plane 4, Pipe 4, T-Beam 8, Flange 8) for ${stageName}?`)) {
      const standardMini = {
        plane: TSA_DFT_SUBSTRATES.plane.labels.map(lbl => ({ label: lbl, spots: ['', '', '', ''] })),
        pipe: TSA_DFT_SUBSTRATES.pipe.labels.map(lbl => ({ label: lbl, spots: ['', '', '', ''] })),
        tbeam: TSA_DFT_SUBSTRATES.tbeam.labels.map(lbl => ({ label: lbl, spots: ['', '', '', ''] })),
        flange: TSA_DFT_SUBSTRATES.flange.labels.map(lbl => ({ label: lbl, spots: ['', '', '', ''] }))
      };
      handleStageFieldChange('dftMini', standardMini);
    }
  };

  // Spot color styling per SSPC PA-2 80%-120% rule
  const getSpotColorClass = (val) => {
    const v = parseFloat(val);
    if (isNaN(v)) return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    const minV = dftStats.minV;
    const maxV = dftStats.maxV;
    const low80 = dftStats.low80;
    const high120 = dftStats.high120;

    if (!isNaN(low80) && !isNaN(high120)) {
      if (v < low80 || v > high120) {
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 font-bold border-rose-300';
      }
      if (!isNaN(minV) && !isNaN(maxV) && v >= minV && v <= maxV) {
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold border-emerald-300';
      }
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300';
    }
    return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';
  };

  // Batch expiry status badge
  const renderBatchBadge = (batch, exp) => {
    if (!batch && !exp) return <span className="text-slate-400 text-[10px]">—</span>;
    if (batch?.toLowerCase() === 'n/a') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">N/A</span>;
    }
    if (!exp) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">DATE?</span>;
    }
    const expDate = new Date(exp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expDate < today) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">EXPIRED</span>;
    }
    const daysLeft = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">{daysLeft}d LEFT</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">VALID</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9E1B1E] via-[#E87B1E] to-[#F39322] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {sid.toUpperCase()}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {stageName} · Stage Inspection & Record
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section Record · AWS C2.23M application parameters, psychrometrics, inspection tests, and 4-mini-table DFT matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSyncCoatingSystem}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Push Coating System generics and cumulative DFT spec to this stage"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Sync Specs from Section 01</span>
          </button>
        </div>
      </div>

      {/* 01. Application Parameters & Paint / Wire Specifications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-5 h-5 text-[#E87B1E]" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Coating Application & Material Specification
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Application Method
            </label>
            <input
              type="text"
              value={stageData.method || ''}
              onChange={(e) => handleStageFieldChange('method', e.target.value)}
              placeholder="e.g. Twin Wire Arc Spray (ARC 140)"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Stripe Coating / Overlap
            </label>
            <input
              type="text"
              value={stageData.stripe || ''}
              onChange={(e) => handleStageFieldChange('stripe', e.target.value)}
              placeholder="e.g. 50% Overlap Crossing Passes"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Substrate / Base Rust Condition
            </label>
            <input
              type="text"
              value={stageData.rust || ''}
              onChange={(e) => handleStageFieldChange('rust', e.target.value)}
              placeholder="e.g. No Flash Rust / Sa 3.0 Clean"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Application Date
            </label>
            <input
              type="date"
              value={stageData.date || ''}
              onChange={(e) => handleStageFieldChange('date', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={stageData.start || ''}
              onChange={(e) => handleStageFieldChange('start', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              End Time
            </label>
            <input
              type="time"
              value={stageData.end || ''}
              onChange={(e) => handleStageFieldChange('end', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Overcoating / Sealing Interval
            </label>
            <input
              type="text"
              value={stageData.recoat || ''}
              onChange={(e) => handleStageFieldChange('recoat', e.target.value)}
              placeholder="e.g. Within 4 Hours"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Target Specified DFT Range (µm)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={stageData.dftSpecMin || ''}
                onChange={(e) => handleStageFieldChange('dftSpecMin', e.target.value)}
                placeholder="Min"
                className="w-1/2 px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs text-center font-bold focus:border-[#E87B1E] outline-none"
              />
              <span className="text-slate-400">–</span>
              <input
                type="number"
                value={stageData.dftSpecMax || ''}
                onChange={(e) => handleStageFieldChange('dftSpecMax', e.target.value)}
                placeholder="Max"
                className="w-1/2 px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs text-center font-bold focus:border-[#E87B1E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Material Specs Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Coating Generic Type
            </label>
            <input
              type="text"
              value={stageData.generic || ''}
              onChange={(e) => handleStageFieldChange('generic', e.target.value)}
              placeholder="e.g. Thermal Spray Aluminium"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Manufacturer Name
            </label>
            <input
              type="text"
              value={stageData.mfr || ''}
              onChange={(e) => handleStageFieldChange('mfr', e.target.value)}
              placeholder="e.g. Castolin / AkzoNobel"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Product Brand Name / Wire Spec
            </label>
            <input
              type="text"
              value={stageData.product || ''}
              onChange={(e) => handleStageFieldChange('product', e.target.value)}
              placeholder="e.g. 99.5% Pure Al Wire (2.3 mm)"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Final Color Shade / RAL
            </label>
            <input
              type="text"
              value={stageData.shade || ''}
              onChange={(e) => handleStageFieldChange('shade', e.target.value)}
              placeholder="e.g. Metallic Silver / Aluminum"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:border-[#E87B1E] outline-none"
            />
          </div>
        </div>

        {/* Conditional: For s1 show Material Details Mirror; For s2..s4 show 2-Component Batch Traceability */}
        {isTSAStage ? (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Thermal Spray Wire Material Details (Mirrored from Section 01)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">10 Standard Parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="space-y-1.5 text-xs">
                {tsaMaterials.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-slate-500 font-semibold">{r.desc}:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{r.detail || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-xs">
                {tsaMaterials.slice(5).map((r, j) => (
                  <div key={j} className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-slate-500 font-semibold">{r.desc}:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{r.detail || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Paint Material Traceability (2-Component / Batch Expiry Verification)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Part A */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Part A (Base)</span>
                  {renderBatchBadge(stageData.batchA, stageData.expA)}
                </div>
                <input
                  type="text"
                  value={stageData.batchA || ''}
                  onChange={(e) => handleStageFieldChange('batchA', e.target.value)}
                  placeholder="Batch / Lot No."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold outline-none"
                />
                <input
                  type="date"
                  value={stageData.expA || ''}
                  onChange={(e) => handleStageFieldChange('expA', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                />
              </div>

              {/* Part B */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Part B (Hardener)</span>
                  {renderBatchBadge(stageData.batchB, stageData.expB)}
                </div>
                <input
                  type="text"
                  value={stageData.batchB || ''}
                  onChange={(e) => handleStageFieldChange('batchB', e.target.value)}
                  placeholder="Batch / Lot No. (or N/A)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold outline-none"
                />
                <input
                  type="date"
                  value={stageData.expB || ''}
                  onChange={(e) => handleStageFieldChange('expB', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                />
              </div>

              {/* Part C */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Part C (Thinner / Reducer)</span>
                  {renderBatchBadge(stageData.batchC, stageData.expC)}
                </div>
                <input
                  type="text"
                  value={stageData.batchC || ''}
                  onChange={(e) => handleStageFieldChange('batchC', e.target.value)}
                  placeholder="Batch / Lot No. (or N/A)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold outline-none"
                />
                <input
                  type="date"
                  value={stageData.expC || ''}
                  onChange={(e) => handleStageFieldChange('expC', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 02. Multi-Hour Environmental Snapshot (PDF Page 9) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#E87B1E]" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Multi-Hour Environmental Snapshot (Session Log)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Psychrometric conditions logged per hour of spraying. RH ≤ 85% and Steel Temp (MT) − Dew Point (DP) ≥ 3°C required.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddEnvReading}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Hourly Reading</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 text-center w-10">#</th>
                <th className="p-3 w-28">Time</th>
                <th className="p-3 text-center">Dry Bulb (°C)</th>
                <th className="p-3 text-center">Wet Bulb (°C)</th>
                <th className="p-3 text-center">Steel Temp (°C)</th>
                <th className="p-3 text-center text-[#E87B1E]">RH (%)</th>
                <th className="p-3 text-center text-[#E87B1E]">Dew Pt (°C)</th>
                <th className="p-3 text-center text-[#E87B1E]">MT − DP (°C)</th>
                <th className="p-3 text-center w-28">Verdict</th>
                <th className="p-3 text-center w-10">✕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {envReadings.map((r, i) => {
                const res = calcEnvRow(r.db, r.wb, r.mt);
                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                    <td className="p-2">
                      <input
                        type="time"
                        value={r.time || ''}
                        onChange={(e) => handleUpdateEnvReading(i, 'time', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={r.db}
                        onChange={(e) => handleUpdateEnvReading(i, 'db', e.target.value)}
                        placeholder="28.5"
                        className="w-16 text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={r.wb}
                        onChange={(e) => handleUpdateEnvReading(i, 'wb', e.target.value)}
                        placeholder="22.0"
                        className="w-16 text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={r.mt}
                        onChange={(e) => handleUpdateEnvReading(i, 'mt', e.target.value)}
                        placeholder="32.0"
                        className="w-16 text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                      />
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-[#E87B1E]">
                      {!isNaN(res.rh) ? `${res.rh.toFixed(1)}%` : '—'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-[#E87B1E]">
                      {!isNaN(res.dp) ? `${res.dp.toFixed(1)}°C` : '—'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-[#E87B1E]">
                      {!isNaN(res.diff) ? `${res.diff.toFixed(1)}°C` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      {res.valid ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          res.ok
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                        }`}>
                          {res.ok ? 'OK · APPLY' : 'NOK · HOLD'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">ENTER DATA</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveEnvReading(i)}
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
        </div>
      </div>

      {/* 03. Thermal Spray Application Parameters (PDF Page 7) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#E87B1E]" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Thermal Spray Application Parameters (AWS C2.23M)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              9 Verified application parameters including arc voltage, atomizing air pressure, standoff distance, and visual continuity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAppParams}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset 9 Standard Parameters</span>
          </button>
        </div>

        {/* 2 Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5 w-5/12">Parameter</th>
                  <th className="p-2.5">Record / Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leftApp.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                    <td className="p-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20">
                      {r.param}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={r.record}
                        onChange={(e) => handleUpdateAppParam(i, 'record', e.target.value)}
                        className="w-full bg-transparent px-2 py-1 rounded border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none text-slate-800 dark:text-slate-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5 w-5/12">Parameter</th>
                  <th className="p-2.5">Record / Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rightApp.map((r, j) => {
                  const actualIdx = halfApp + j;
                  return (
                    <tr key={j} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2 text-center font-mono font-bold text-slate-400">{actualIdx + 1}</td>
                      <td className="p-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20">
                        {r.param}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={r.record}
                          onChange={(e) => handleUpdateAppParam(actualIdx, 'record', e.target.value)}
                          className="w-full bg-transparent px-2 py-1 rounded border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none text-slate-800 dark:text-slate-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 04. Coating Test Parameters & Inspection Results (PDF Page 11) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#E87B1E]" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Coating Test Parameters & Inspection Results
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              19-Test inspection library including Bend test coupons, Pull-Off adhesion (ASTM D4541), WFT, and porosity verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTestCatalog?.(sid)}
              className="px-3 py-1.5 rounded-xl bg-[#E87B1E] text-white font-bold text-xs shadow-xs hover:bg-[#9E1B1E] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Test from Catalog</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefaultTests}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Standard Tests</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 text-center w-10">#</th>
                <th className="p-3 w-4/12">Test Parameter</th>
                <th className="p-3 w-2/12">Standard Ref.</th>
                <th className="p-3 w-3/12">Requirement</th>
                <th className="p-3 w-2/12">Actual Result</th>
                <th className="p-3 text-center w-28">Result</th>
                <th className="p-3 text-center w-10">✕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tests.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-2 font-semibold">
                    <input
                      type="text"
                      value={t.t || ''}
                      onChange={(e) => handleUpdateTest(idx, 't', e.target.value)}
                      placeholder="Test parameter name"
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.std || ''}
                      onChange={(e) => handleUpdateTest(idx, 'std', e.target.value)}
                      placeholder="Standard"
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.req || ''}
                      onChange={(e) => handleUpdateTest(idx, 'req', e.target.value)}
                      placeholder="Requirement"
                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-[#E87B1E] outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.act || ''}
                      onChange={(e) => handleUpdateTest(idx, 'act', e.target.value)}
                      placeholder="Actual measured"
                      className="w-full bg-transparent px-2 py-1 rounded border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none font-semibold text-slate-800 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <select
                      value={t.res || ''}
                      onChange={(e) => handleUpdateTest(idx, 'res', e.target.value)}
                      className={`w-full px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                        t.res === 'Pass'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : t.res === 'Fail'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      <option value="">⌛ Pending</option>
                      <option value="Pass">Pass ✓</option>
                      <option value="Fail">Fail ✕</option>
                      <option value="NA">N.A. —</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTest(idx)}
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 05. SSPC PA-2 4-Mini-Table DFT Record Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E87B1E]" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                SSPC PA-2 4-Substrate DFT Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specified: <b>{stageData.dftSpecMin || '300'}–{stageData.dftSpecMax || '500'} µm</b> (80%–120% Bound: <b>{dftStats.low80 ? dftStats.low80.toFixed(0) : '240'}–{dftStats.high120 ? dftStats.high120.toFixed(0) : '600'} µm</b>).
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadStandardDFT}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Standard 4-Table Layout</span>
          </button>
        </div>

        {/* 4 Mini Tables Grid (2x2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {TSA_DFT_MINI_TYPES.map((type) => {
            const meta = TSA_DFT_SUBSTRATES[type];
            const rows = dftMini[type] || [];
            let allSpots = [];
            rows.forEach(r => (r.spots || []).forEach(v => {
              const num = parseFloat(v);
              if (!isNaN(num)) allSpots.push(num);
            }));
            const avg = allSpots.length ? (allSpots.reduce((a, b) => a + b, 0) / allSpots.length).toFixed(1) : '—';

            return (
              <div key={type} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-[#9E1B1E] to-[#E87B1E] text-white px-3 py-1.5 font-bold text-xs flex justify-between">
                  <span>{meta.num}. {meta.title}</span>
                  <span className="font-mono text-[11px] opacity-90">{rows.length} Positions</span>
                </div>

                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2 w-36">Position</th>
                      <th className="p-2 text-center">R1</th>
                      <th className="p-2 text-center">R2</th>
                      <th className="p-2 text-center">R3</th>
                      <th className="p-2 text-center">R4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2 font-semibold text-slate-700 dark:text-slate-300">
                          {row.label}
                        </td>
                        {[0, 1, 2, 3].map((sIdx) => {
                          const val = row.spots?.[sIdx] ?? '';
                          return (
                            <td key={sIdx} className="p-1 text-center">
                              <input
                                type="number"
                                value={val}
                                onChange={(e) => handleUpdateDftSpot(type, rIdx, sIdx, e.target.value)}
                                placeholder="µm"
                                className={`w-14 text-center px-1 py-1 rounded border text-xs font-mono transition ${getSpotColorClass(val)}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#FDF1E6] dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <td className="p-2 text-right text-[#E87B1E]">Substrate Average:</td>
                      <td colSpan={4} className="p-2 font-mono text-center font-extrabold text-[#E87B1E]">
                        {avg} µm <span className="text-[10px] font-normal text-slate-400">({allSpots.length} readings)</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })}
        </div>

        {/* DFT Summary Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-[#E87B1E]/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Grand Avg DFT</span>
              <span className="text-xl font-black text-[#E87B1E] font-mono">
                {!isNaN(dftStats.grandAvg) ? `${dftStats.grandAvg.toFixed(1)} µm` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Spots</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {dftStats.totalReadings}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Out of Range</span>
              <span className={`text-xl font-black font-mono ${dftStats.outOfRange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {dftStats.outOfRange}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Stage Verdict:</span>
            <select
              value={stageData.userVerdict || ''}
              onChange={(e) => handleStageFieldChange('userVerdict', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="">Auto ({dftStats.autoVerdict})</option>
              <option value="Pass">Pass ✓</option>
              <option value="Rework">Rework ⚠</option>
              <option value="Fail">Fail ✕</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
