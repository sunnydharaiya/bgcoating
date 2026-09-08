// src/tools/inspection/InspectionStage.jsx
import React, { useState } from 'react';
import { 
  FileCheck2, 
  Layers, 
  Thermometer, 
  Hammer, 
  Camera, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Maximize2, 
  Eye, 
  X,
  UploadCloud,
  ChevronDown
} from 'lucide-react';
import { 
  SELECT_OPTIONS, 
  calculatePsychrometrics 
} from '../../data/inspectionDatabase';
import { formatNum } from '../../utils/calculations';
import { useToast } from '../../context/ToastContext';

export default function InspectionStage({
  stageId = 's1',
  state,
  onChangeStageState,
  onNavigateStage
}) {
  const { addToast } = useToast();
  const stage = state.stages?.[stageId] || {};

  // Image Lightbox Modal State
  const [lightboxImg, setLightboxImg] = useState(null);

  // Helper to update specific fields in current stage
  const updateStage = (patch) => {
    onChangeStageState(stageId, { ...stage, ...patch });
  };

  const updateNested = (parentKey, patch) => {
    updateStage({
      [parentKey]: {
        ...(stage[parentKey] || {}),
        ...patch
      }
    });
  };

  // Weather slots updater
  const handleWeatherChange = (hourIdx, field, val) => {
    const slots = [...(stage.weatherSlots || [])];
    slots[hourIdx] = {
      ...slots[hourIdx],
      [field]: val
    };
    updateStage({ weatherSlots: slots });
  };

  // Quick fill monitored daytime weather (09:00 - 17:00)
  const handleQuickFillWeather = () => {
    const slots = (stage.weatherSlots || []).map((slot, idx) => {
      if (idx >= 9 && idx <= 17) {
        const dry = (29 + (idx % 3) * 0.5).toFixed(1);
        const wet = (21 + (idx % 2) * 0.4).toFixed(1);
        const metal = (32 + (idx % 4) * 0.6).toFixed(1);
        return {
          ...slot,
          dryC: dry,
          wetC: wet,
          metalC: metal
        };
      }
      return slot;
    });
    updateStage({ weatherSlots: slots });
    addToast('Weather Data Auto-Filled', 'Monitored daytime psychrometric slots populated with compliant values.', 'success');
  };

  // Surface Prep Test Table Actions
  const handleAddPrepTest = () => {
    const tests = [...(stage.surfacePrepTests || [])];
    tests.push({
      id: `sp_custom_${Date.now()}`,
      testName: 'Custom Surface Check',
      stdRef: 'ISO 8501-1',
      req: 'As per spec',
      actual: 'Satisfactory',
      verdict: 'PASS'
    });
    updateStage({ surfacePrepTests: tests });
  };

  const handleUpdatePrepTest = (idx, field, val) => {
    const tests = [...(stage.surfacePrepTests || [])];
    tests[idx] = { ...tests[idx], [field]: val };
    updateStage({ surfacePrepTests: tests });
  };

  const handleDeletePrepTest = (idx) => {
    const tests = (stage.surfacePrepTests || []).filter((_, i) => i !== idx);
    updateStage({ surfacePrepTests: tests });
  };

  // Coating Test Table Actions
  const handleAddCoatingTest = () => {
    const tests = [...(stage.coatingTests || [])];
    tests.push({
      id: `ct_custom_${Date.now()}`,
      testName: 'Custom Coating Check',
      stdRef: 'SSPC-PA 2',
      req: 'As per spec',
      actual: 'Compliant',
      verdict: 'PASS'
    });
    updateStage({ coatingTests: tests });
  };

  const handleUpdateCoatingTest = (idx, field, val) => {
    const tests = [...(stage.coatingTests || [])];
    tests[idx] = { ...tests[idx], [field]: val };
    updateStage({ coatingTests: tests });
  };

  const handleDeleteCoatingTest = (idx) => {
    const tests = (stage.coatingTests || []).filter((_, i) => i !== idx);
    updateStage({ coatingTests: tests });
  };

  // DFT Matrix Location Rows
  const handleAddDftLocation = () => {
    const dft = stage.dftRecord || { locations: [] };
    const locs = [...(dft.locations || [])];
    locs.push({
      id: `loc_${Date.now()}`,
      name: `Inspection Area #${locs.length + 1}`,
      spots: ['', '', '', '', '', '', '', '', '', '']
    });
    updateStage({ dftRecord: { ...dft, locations: locs } });
  };

  const handleUpdateDftLocationName = (idx, name) => {
    const dft = stage.dftRecord || { locations: [] };
    const locs = [...(dft.locations || [])];
    locs[idx] = { ...locs[idx], name };
    updateStage({ dftRecord: { ...dft, locations: locs } });
  };

  const handleUpdateDftSpot = (locIdx, spotIdx, val) => {
    const dft = stage.dftRecord || { locations: [] };
    const locs = [...(dft.locations || [])];
    const spots = [...(locs[locIdx].spots || [])];
    spots[spotIdx] = val;
    locs[locIdx] = { ...locs[locIdx], spots };
    updateStage({ dftRecord: { ...dft, locations: locs } });
  };

  const handleDeleteDftLocation = (locIdx) => {
    const dft = stage.dftRecord || { locations: [] };
    const locs = (dft.locations || []).filter((_, i) => i !== locIdx);
    updateStage({ dftRecord: { ...dft, locations: locs } });
  };

  // Generic Base64 Photo Upload Handler
  const handlePhotoUpload = (e, targetArrayKey) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        addToast('File Too Large', 'Please upload images smaller than 2MB for optimal performance.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const currentPhotos = [...(stage[targetArrayKey] || [])];
        if (currentPhotos.length >= 6) {
          addToast('Photo Limit', 'Maximum 6 photos allowed per section.', 'info');
          return;
        }
        currentPhotos.push({
          id: `ph_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          url: uploadEvent.target.result,
          name: file.name,
          date: new Date().toISOString().split('T')[0]
        });
        updateStage({ [targetArrayKey]: currentPhotos });
        addToast('Photo Uploaded', `${file.name} added to inspection record.`, 'success');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (targetArrayKey, photoId) => {
    const currentPhotos = (stage[targetArrayKey] || []).filter(p => p.id !== photoId);
    updateStage({ [targetArrayKey]: currentPhotos });
  };

  // Compute DFT bounds and spot rule
  const minDft = parseFloat(stage.dftRecord?.minDft) || 0;
  const maxDft = parseFloat(stage.dftRecord?.maxDft) || 0;
  const lower80 = minDft > 0 ? (minDft * 0.8).toFixed(1) : 0;
  const upper120 = maxDft > 0 ? (maxDft * 1.2).toFixed(1) : 0;
  const areaM2 = parseFloat(stage.dftRecord?.inspectionAreaM2) || 0;

  // Spot rule recommendation
  let spotRuleText = '5 spots per 10 m²';
  if (areaM2 > 100) spotRuleText = `${Math.ceil(15 + ((areaM2 - 100) / 100) * 10)} spots recommended`;
  else if (areaM2 > 30) spotRuleText = '15 spots per 100 m²';
  else if (areaM2 > 10) spotRuleText = '10 spots (10–30 m²)';

  // Overall Stage DFT Average
  let totalDftSum = 0;
  let totalDftCount = 0;
  (stage.dftRecord?.locations || []).forEach(loc => {
    (loc.spots || []).forEach(s => {
      const val = parseFloat(s);
      if (!isNaN(val) && val > 0) {
        totalDftSum += val;
        totalDftCount++;
      }
    });
  });
  const overallDftAvg = totalDftCount > 0 ? (totalDftSum / totalDftCount).toFixed(1) : '0.0';

  const isDftAvgCompliant = minDft > 0 && parseFloat(overallDftAvg) >= minDft && (maxDft === 0 || parseFloat(overallDftAvg) <= maxDft);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Stage Selector Top Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[11px] font-mono font-bold uppercase">
              Inspection Stage {stageId.toUpperCase()}
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              {stage.stageTitle || stage.stageName || `Stage ${stageId}`}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log psychrometric weather conditions, surface preparation parameters, paint batches, and SSPC-PA 2 DFT spot readings.
          </p>
        </div>

        {/* Stage Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto">
          {[
            { id: 's1', label: 's1 · Blasting & Primer' },
            { id: 's2', label: 's2 · 1st Intermediate' },
            { id: 's3', label: 's3 · 2nd Intermediate' },
            { id: 's4', label: 's4 · 3rd Topcoat' }
          ].map(stg => (
            <button
              key={stg.id}
              onClick={() => onNavigateStage(stg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                stageId === stg.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {stg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Report Information Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-amber-500" />
          General Inspection &amp; Project Identification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Report Number
            </label>
            <input
              type="text"
              value={stage.reportNo || ''}
              onChange={(e) => updateStage({ reportNo: e.target.value })}
              placeholder="e.g. CIR-BG-2026-0841"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Inspection Date
            </label>
            <input
              type="date"
              value={stage.date || ''}
              onChange={(e) => updateStage({ date: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Project No / Code
            </label>
            <input
              type="text"
              value={stage.projectNo || ''}
              onChange={(e) => updateStage({ projectNo: e.target.value })}
              placeholder="e.g. PRJ-2026-MUNDRA-T104"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Client / Customer
            </label>
            <input
              type="text"
              value={stage.customer || ''}
              onChange={(e) => updateStage({ customer: e.target.value })}
              placeholder="e.g. Adani Total LNG / IOCL"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Project Description / Title
            </label>
            <input
              type="text"
              value={stage.projectName || ''}
              onChange={(e) => updateStage({ projectName: e.target.value })}
              placeholder="e.g. Mundra LNG Storage Tank T-104 External Coating"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Item Details / Structure
            </label>
            <input
              type="text"
              value={stage.itemDetails || ''}
              onChange={(e) => updateStage({ itemDetails: e.target.value })}
              placeholder="e.g. Shell Course #1 (Plates A1-A6)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Work Location
            </label>
            <input
              type="text"
              value={stage.workLocation || ''}
              onChange={(e) => updateStage({ workLocation: e.target.value })}
              placeholder="e.g. Site Yard Sector-4"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* 3. 24-Hour Psychrometric Weather Monitoring Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                24-Hour Ambient &amp; Climatic Condition Record (ISO 8502-4)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Steel temperature must be ≥ 3.0°C above Dew Point (ΔT ≥ 3.0°C) and Relative Humidity ≤ 85% at all times.
            </p>
          </div>

          <button
            onClick={handleQuickFillWeather}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Quick Auto-Fill (09:00 - 17:00)
          </button>
        </div>

        {/* Scrollable Weather Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-20">Time Slot</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-28">Dry Bulb (°C)</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-28">Wet Bulb (°C)</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-28">Steel Temp (°C)</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-24">RH (%)</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-28">Dew Point (°C)</th>
                <th className="py-2.5 px-3 border-r border-slate-800 text-center w-24">ΔT (°C)</th>
                <th className="py-2.5 px-3 text-center">Climatic Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(stage.weatherSlots || []).map((slot, idx) => {
                const psychro = calculatePsychrometrics(slot.dryC, slot.wetC, slot.metalC);
                const hasData = slot.dryC !== '' && slot.wetC !== '';
                const isHighlight = idx >= 8 && idx <= 18;

                return (
                  <tr key={idx} className={`hover:bg-slate-50/80 transition ${isHighlight ? 'bg-amber-50/15' : ''}`}>
                    <td className="py-1.5 px-3 text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                      {slot.hour}
                    </td>
                    <td className="py-1 px-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={slot.dryC}
                        onChange={(e) => handleWeatherChange(idx, 'dryC', e.target.value)}
                        placeholder="—"
                        className="w-20 px-2 py-1 text-center rounded-lg border border-slate-200 focus:border-amber-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-1 px-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={slot.wetC}
                        onChange={(e) => handleWeatherChange(idx, 'wetC', e.target.value)}
                        placeholder="—"
                        className="w-20 px-2 py-1 text-center rounded-lg border border-slate-200 focus:border-amber-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-1 px-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={slot.metalC}
                        onChange={(e) => handleWeatherChange(idx, 'metalC', e.target.value)}
                        placeholder="—"
                        className="w-20 px-2 py-1 text-center rounded-lg border border-slate-200 focus:border-amber-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono font-semibold">
                      {hasData && psychro.rhPct !== null ? (
                        <span className={psychro.rhPct <= 85 ? 'text-slate-800' : 'text-red-600 font-bold'}>
                          {psychro.rhPct}%
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono font-semibold text-slate-700">
                      {hasData && psychro.dewPointC !== null ? `${psychro.dewPointC}°C` : '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono font-semibold">
                      {hasData && psychro.diffC !== null ? (
                        <span className={psychro.diffC >= 3.0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                          +{psychro.diffC}°C
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-1.5 px-3 text-center">
                      {hasData ? (
                        psychro.isOk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            OK to Coat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold" title={psychro.reason}>
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            NON-COMPLIANT
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Not Recorded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Surface Preparation Parameters & Inspection Tests (Only shown or prominent for s1 / customizable) */}
      {stageId === 's1' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hammer className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Surface Preparation Parameters &amp; Quality Control Tests
              </h3>
            </div>
            <button
              onClick={handleAddPrepTest}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Test Row
            </button>
          </div>

          {/* Surface Prep Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Abrasive Media &amp; Brand
              </label>
              <input
                type="text"
                list="abrasive-options"
                value={stage.surfacePrep?.abrasiveType || ''}
                onChange={(e) => updateNested('surfacePrep', { abrasiveType: e.target.value })}
                placeholder="e.g. Garnet GMA 30/60 Mesh"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white"
              />
              <datalist id="abrasive-options">
                {SELECT_OPTIONS.abrasiveTypes.map((opt, i) => <option key={i} value={opt} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Mesh / Grit Size
              </label>
              <input
                type="text"
                value={stage.surfacePrep?.meshSize || ''}
                onChange={(e) => updateNested('surfacePrep', { meshSize: e.target.value })}
                placeholder="e.g. 30/60 Mesh / G40"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nozzle Pressure (psi)
              </label>
              <input
                type="number"
                value={stage.surfacePrep?.nozzlePressurePsi || ''}
                onChange={(e) => updateNested('surfacePrep', { nozzlePressurePsi: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Air Compressor Capacity (CFM)
              </label>
              <input
                type="number"
                value={stage.surfacePrep?.compressorCfm || ''}
                onChange={(e) => updateNested('surfacePrep', { compressorCfm: e.target.value })}
                placeholder="e.g. 375"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Blasting Completion Time Slot
              </label>
              <input
                type="text"
                value={stage.surfacePrep?.blastingTimeSlot || ''}
                onChange={(e) => updateNested('surfacePrep', { blastingTimeSlot: e.target.value })}
                placeholder="e.g. 11:00"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Surface Area Blasted ($m^2$)
              </label>
              <input
                type="number"
                value={stage.surfacePrep?.surfaceAreaM2 || ''}
                onChange={(e) => updateNested('surfacePrep', { surfaceAreaM2: e.target.value })}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono"
              />
            </div>
          </div>

          {/* Test Parameters Dynamic Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-48">Inspection Parameter</th>
                  <th className="py-2.5 px-3 w-56">Standard Reference</th>
                  <th className="py-2.5 px-3">Specification Requirement</th>
                  <th className="py-2.5 px-3">Actual Result / Reading</th>
                  <th className="py-2.5 px-3 w-28 text-center">Verdict</th>
                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(stage.surfacePrepTests || []).map((t, idx) => (
                  <tr key={t.id || idx} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      <input
                        type="text"
                        value={t.testName}
                        onChange={(e) => handleUpdatePrepTest(idx, 'testName', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.stdRef}
                        onChange={(e) => handleUpdatePrepTest(idx, 'stdRef', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 font-mono text-slate-600"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.req}
                        onChange={(e) => handleUpdatePrepTest(idx, 'req', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-amber-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.actual}
                        onChange={(e) => handleUpdatePrepTest(idx, 'actual', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 font-semibold"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select
                        value={t.verdict}
                        onChange={(e) => handleUpdatePrepTest(idx, 'verdict', e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-bold border ${
                          t.verdict === 'PASS' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="HOLD">HOLD</option>
                        <option value="NA">N/A</option>
                      </select>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeletePrepTest(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete test row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Surface Prep Photo Evidence Upload Strip */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                Surface Preparation Photographic Evidence (Max 6 Photos)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'prepPhotos')}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {(stage.prepPhotos || []).map((ph) => (
                <div key={ph.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square">
                  <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setLightboxImg(ph.url)}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition"
                      title="Enlarge"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemovePhoto('prepPhotos', ph.id)}
                      className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {(stage.prepPhotos || []).length === 0 && (
                <div className="col-span-full py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                  No surface preparation photos attached yet. Click "Upload Photos" to add visual evidence.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Coating Application Parameters & Paint Material Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500" />
          Coating Application Parameters &amp; Material Batch Traceability
        </h3>

        {/* Application Params Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Application Method
            </label>
            <select
              value={stage.coatingApp?.method || 'AIRLESS SPRAY'}
              onChange={(e) => updateNested('coatingApp', { method: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white"
            >
              {SELECT_OPTIONS.applicationMethods.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Stripe Coating Applied?
            </label>
            <select
              value={stage.coatingApp?.stripeCoat || 'YES'}
              onChange={(e) => updateNested('coatingApp', { stripeCoat: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-semibold"
            >
              <option value="YES">YES (Brush on Welds &amp; Edges)</option>
              <option value="NO">NO</option>
              <option value="NA">N/A</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Visible Flash Rusting?
            </label>
            <select
              value={stage.coatingApp?.visibleRust || 'NO'}
              onChange={(e) => updateNested('coatingApp', { visibleRust: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-semibold"
            >
              <option value="NO">NO (Clean Surface)</option>
              <option value="YES">YES (Requires Re-blast)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Coating Application Window
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={stage.coatingApp?.coatingStartTime || ''}
                onChange={(e) => updateNested('coatingApp', { coatingStartTime: e.target.value })}
                placeholder="Start (12:00)"
                className="w-1/2 px-2 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono text-center"
              />
              <span className="text-slate-400 font-mono">→</span>
              <input
                type="text"
                value={stage.coatingApp?.coatingEndTime || ''}
                onChange={(e) => updateNested('coatingApp', { coatingEndTime: e.target.value })}
                placeholder="End (14:00)"
                className="w-1/2 px-2 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-white font-mono text-center"
              />
            </div>
          </div>
        </div>

        {/* Paint Material Details Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Paint Manufacturer
            </label>
            <input
              type="text"
              list="mfr-options"
              value={stage.paintDetails?.manufacturer || ''}
              onChange={(e) => updateNested('paintDetails', { manufacturer: e.target.value })}
              placeholder="e.g. Jotun"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50"
            />
            <datalist id="mfr-options">
              {SELECT_OPTIONS.manufacturers.map((m, i) => <option key={i} value={m} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Product Name / TDS Reference
            </label>
            <input
              type="text"
              value={stage.paintDetails?.productName || ''}
              onChange={(e) => updateNested('paintDetails', { productName: e.target.value })}
              placeholder="e.g. Barrier 80 (Zinc Rich Epoxy)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Color Shade / RAL Code
            </label>
            <input
              type="text"
              value={stage.paintDetails?.shadeRal || ''}
              onChange={(e) => updateNested('paintDetails', { shadeRal: e.target.value })}
              placeholder="e.g. RAL 9010 (Pure White) / Grey"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Actual Paint Consumed ($L$)
            </label>
            <input
              type="number"
              value={stage.paintDetails?.consumedLitres || ''}
              onChange={(e) => updateNested('paintDetails', { consumedLitres: e.target.value })}
              placeholder="e.g. 24"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50 font-mono"
            />
          </div>

          {/* Part A Batch Details */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Base / Part A Batch &amp; Expiry
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={stage.paintDetails?.batchA || ''}
                onChange={(e) => updateNested('paintDetails', { batchA: e.target.value })}
                placeholder="Batch A No"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
              />
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={stage.paintDetails?.expA || ''}
                  onChange={(e) => updateNested('paintDetails', { expA: e.target.value })}
                  className="w-2/3 px-2 py-1 text-xs rounded-lg border border-slate-200"
                />
                <select
                  value={stage.paintDetails?.statusA || 'OK'}
                  onChange={(e) => updateNested('paintDetails', { statusA: e.target.value })}
                  className={`w-1/3 px-1 py-1 rounded text-[11px] font-bold border ${
                    stage.paintDetails?.statusA === 'OK' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
                  }`}
                >
                  <option value="OK">OK</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Part B Batch Details */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Hardener / Part B Batch &amp; Expiry
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={stage.paintDetails?.batchB || ''}
                onChange={(e) => updateNested('paintDetails', { batchB: e.target.value })}
                placeholder="Batch B No"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
              />
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={stage.paintDetails?.expB || ''}
                  onChange={(e) => updateNested('paintDetails', { expB: e.target.value })}
                  className="w-2/3 px-2 py-1 text-xs rounded-lg border border-slate-200"
                />
                <select
                  value={stage.paintDetails?.statusB || 'OK'}
                  onChange={(e) => updateNested('paintDetails', { statusB: e.target.value })}
                  className={`w-1/3 px-1 py-1 rounded text-[11px] font-bold border ${
                    stage.paintDetails?.statusB === 'OK' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
                  }`}
                >
                  <option value="OK">OK</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Part C Batch Details */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Part C / Thinner / Pigment (Optional)
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={stage.paintDetails?.batchC || ''}
                onChange={(e) => updateNested('paintDetails', { batchC: e.target.value })}
                placeholder="Part C / Thinner Batch"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
              />
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={stage.paintDetails?.expC || ''}
                  onChange={(e) => updateNested('paintDetails', { expC: e.target.value })}
                  className="w-2/3 px-2 py-1 text-xs rounded-lg border border-slate-200"
                />
                <select
                  value={stage.paintDetails?.statusC || 'NA'}
                  onChange={(e) => updateNested('paintDetails', { statusC: e.target.value })}
                  className="w-1/3 px-1 py-1 rounded text-[11px] font-bold border border-slate-200 bg-white"
                >
                  <option value="NA">N/A</option>
                  <option value="OK">OK</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Coating Test Dynamic Parameters Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">
              Coating Application Quality Tests (WFT, Cure, Hardness, etc.)
            </h4>
            <button
              onClick={handleAddCoatingTest}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Coating Test
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2 px-3 w-48">Test Name</th>
                  <th className="py-2 px-3 w-56">Standard Reference</th>
                  <th className="py-2 px-3">Specification Requirement</th>
                  <th className="py-2 px-3">Actual Result / Observation</th>
                  <th className="py-2 px-3 w-28 text-center">Verdict</th>
                  <th className="py-2 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(stage.coatingTests || []).map((t, idx) => (
                  <tr key={t.id || idx} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      <input
                        type="text"
                        value={t.testName}
                        onChange={(e) => handleUpdateCoatingTest(idx, 'testName', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.stdRef}
                        onChange={(e) => handleUpdateCoatingTest(idx, 'stdRef', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 font-mono text-slate-600"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.req}
                        onChange={(e) => handleUpdateCoatingTest(idx, 'req', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={t.actual}
                        onChange={(e) => handleUpdateCoatingTest(idx, 'actual', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 font-semibold"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select
                        value={t.verdict}
                        onChange={(e) => handleUpdateCoatingTest(idx, 'verdict', e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-bold border ${
                          t.verdict === 'PASS' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="HOLD">HOLD</option>
                        <option value="NA">N/A</option>
                      </select>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteCoatingTest(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. SSPC-PA 2 / ISO 19840 Dry Film Thickness (DFT) Spot Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                SSPC-PA 2 / ISO 19840 Dry Film Thickness (DFT) Inspection Record
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tolerance rule: No spot reading below 80% of minimum ({lower80} µm) or above 120% of maximum ({upper120} µm). Average must satisfy specified NDFT.
            </p>
          </div>

          <button
            onClick={handleAddDftLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Inspection Area
          </button>
        </div>

        {/* Specified Bounds Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-600">Specified Min NDFT</label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={stage.dftRecord?.minDft || ''}
                onChange={(e) => updateNested('dftRecord', { minDft: e.target.value })}
                placeholder="60"
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-400 font-mono">µm</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-600">Specified Max NDFT</label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={stage.dftRecord?.maxDft || ''}
                onChange={(e) => updateNested('dftRecord', { maxDft: e.target.value })}
                placeholder="90"
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-400 font-mono">µm</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-500">80% Lower Bound</label>
            <div className="mt-1.5 font-mono text-xs font-bold text-amber-700 bg-amber-100/60 px-2 py-1 rounded text-center">
              {lower80} µm
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-500">120% Upper Bound</label>
            <div className="mt-1.5 font-mono text-xs font-bold text-amber-700 bg-amber-100/60 px-2 py-1 rounded text-center">
              {upper120} µm
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-600">Total Area ($m^2$)</label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={stage.dftRecord?.inspectionAreaM2 || ''}
                onChange={(e) => updateNested('dftRecord', { inspectionAreaM2: e.target.value })}
                placeholder="120"
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-400 font-mono">m²</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-500">Overall Stage Average</label>
            <div className={`mt-1.5 font-mono text-xs font-black px-2 py-1 rounded text-center ${
              isDftAvgCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
            }`}>
              {overallDftAvg} µm
            </div>
          </div>
        </div>

        {/* 10-Spot Reading Grid */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[850px]">
            <thead className="bg-slate-900 text-white font-mono text-[10.5px] uppercase">
              <tr>
                <th className="py-2.5 px-3 w-48">Inspection Location / Component</th>
                {Array.from({ length: 10 }).map((_, i) => (
                  <th key={i} className="py-2 px-1 text-center w-12 font-mono">
                    S{i + 1}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center w-24">Area Avg</th>
                <th className="py-2.5 px-3 text-center w-24">Status</th>
                <th className="py-2.5 px-2 w-8 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(stage.dftRecord?.locations || []).map((loc, locIdx) => {
                const spots = loc.spots || [];
                const validSpots = spots.map(s => parseFloat(s)).filter(v => !isNaN(v) && v > 0);
                const locAvg = validSpots.length > 0 
                  ? (validSpots.reduce((a, b) => a + b, 0) / validSpots.length).toFixed(1) 
                  : '—';

                const isLocPass = locAvg !== '—' && minDft > 0 && parseFloat(locAvg) >= minDft && (maxDft === 0 || parseFloat(locAvg) <= maxDft);

                return (
                  <tr key={loc.id || locIdx} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => handleUpdateDftLocationName(locIdx, e.target.value)}
                        placeholder={`Area #${locIdx + 1}`}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 font-medium"
                      />
                    </td>
                    {Array.from({ length: 10 }).map((_, sIdx) => {
                      const spotVal = spots[sIdx] || '';
                      const num = parseFloat(spotVal);
                      const isLow = !isNaN(num) && minDft > 0 && num < (minDft * 0.8);
                      const isHigh = !isNaN(num) && maxDft > 0 && num > (maxDft * 1.2);

                      return (
                        <td key={sIdx} className="py-1.5 px-1 text-center">
                          <input
                            type="number"
                            value={spotVal}
                            onChange={(e) => handleUpdateDftSpot(locIdx, sIdx, e.target.value)}
                            placeholder="—"
                            className={`w-11 px-1 py-1 text-center text-xs rounded font-mono border ${
                              isLow 
                                ? 'bg-red-50 border-red-400 text-red-700 font-bold' 
                                : isHigh 
                                ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold' 
                                : 'border-slate-200 focus:border-amber-500'
                            }`}
                          />
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                      {locAvg} {locAvg !== '—' ? 'µm' : ''}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {locAvg !== '—' ? (
                        isLocPass ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            PASS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                            OUT-TOL
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteDftLocation(locIdx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Remarks, Authorization & Sign-Off */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-amber-500" />
          Observations, Remarks &amp; Authorization Sign-Off
        </h3>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
            General Inspection Remarks &amp; Clarifications
          </label>
          <textarea
            rows={3}
            value={stage.remarks || ''}
            onChange={(e) => updateStage({ remarks: e.target.value })}
            placeholder="e.g. Surface preparation inspected and approved prior to primer application. WFT and DFT verified per SSPC-PA 2 Level 3 protocol."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50 resize-y"
          />
        </div>

        {/* Dual Signature Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Applicator Sign Block */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-600 block border-b border-slate-200 pb-1">
              Coating Contractor / Applicator Inspector
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Inspector Name</label>
                <input
                  type="text"
                  value={stage.signApplicator?.name || ''}
                  onChange={(e) => updateNested('signApplicator', { name: e.target.value })}
                  placeholder="e.g. Prakash Ramavat"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Sign / Endorsement</label>
                <input
                  type="text"
                  value={stage.signApplicator?.sign || ''}
                  onChange={(e) => updateNested('signApplicator', { sign: e.target.value })}
                  placeholder="e.g. P. Ramavat"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Client / TPI Sign Block */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-600 block border-b border-slate-200 pb-1">
              Client / TPI QC Inspector
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase">TPI Inspector Name</label>
                <input
                  type="text"
                  value={stage.signTpi?.name || ''}
                  onChange={(e) => updateNested('signTpi', { name: e.target.value })}
                  placeholder="e.g. N. V. Dave (TPI / EIL)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Sign / Endorsement</label>
                <input
                  type="text"
                  value={stage.signTpi?.sign || ''}
                  onChange={(e) => updateNested('signTpi', { sign: e.target.value })}
                  placeholder="e.g. N.V. Dave"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={lightboxImg} alt="Inspection Preview" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
