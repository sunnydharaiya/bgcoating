// src/tools/painter/PainterCoatStage.jsx
import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Thermometer, 
  ShieldCheck, 
  Info,
  Calendar,
  Eye
} from 'lucide-react';
import { 
  COAT_STAGE_NAMES, 
  COAT_SIDS, 
  DFT_MINI_TYPES, 
  DFT_MINI_META, 
  COAT_DEFAULT_SETS, 
  COAT_TEST_CATALOG,
  calcRH, 
  calcDP, 
  calcCoatDFT, 
  computeOvercoatInterval 
} from '../../data/painterDatabase';

export default function PainterCoatStage({
  sid,
  formData,
  onChange,
  onOpenTestCatalog,
  onSyncCoatingSystem
}) {
  const stageName = COAT_STAGE_NAMES[sid] || sid;
  const coatIndex = COAT_SIDS.indexOf(sid);
  const prevSID = coatIndex > 0 ? COAT_SIDS[coatIndex - 1] : null;

  const coatSheet = formData?._coatSheets?.[sid] || {};
  const prevCoatSheet = prevSID ? (formData?._coatSheets?.[prevSID] || {}) : null;
  const coatDFT = formData?._coatDFT?.[sid] || {};
  const csRows = formData?._coatingSystem || [];

  // Previous and current coat DFT specs
  const curCS = csRows[coatIndex] || {};
  const prevCS = prevSID ? csRows[coatIndex - 1] : null;

  // Handler for coat sheet fields
  const handleFieldChange = (field, value) => {
    const updatedSheets = { ...formData._coatSheets };
    updatedSheets[sid] = {
      ...(updatedSheets[sid] || {}),
      [field]: value
    };
    onChange('_coatSheets', updatedSheets);
  };

  // Environmental calculation
  const tdb = parseFloat(coatSheet.db);
  const twb = parseFloat(coatSheet.wb);
  const tmt = parseFloat(coatSheet.mt);
  const rh = calcRH(tdb, twb);
  const dp = calcDP(tdb, rh);
  const diff = (!isNaN(tmt) && !isNaN(dp)) ? (tmt - dp) : NaN;
  const envOK = !isNaN(rh) && !isNaN(diff) && rh <= 85 && diff >= 3.0;
  const hasEnv = !isNaN(rh) && !isNaN(diff);

  // Overcoat Interval Calculation
  const prevDate = prevCoatSheet?.date;
  const prevEnd = prevCoatSheet?.end;
  const curDate = coatSheet.date;
  const curStart = coatSheet.start;
  const autoOvercoat = prevSID ? computeOvercoatInterval(prevDate, prevEnd, curDate, curStart) : '— (First Layer / Primer)';

  // Batch Expiry Status Check
  const getBatchStatus = (batch, expDate) => {
    if (!batch && !expDate) return { text: '—', color: 'text-slate-400' };
    if (/^na$|^n\/a$/i.test(batch?.trim())) return { text: 'N.A.', color: 'text-slate-500 bg-slate-100' };
    if (!expDate) return { text: 'DATE?', color: 'text-amber-700 bg-amber-100' };
    const exp = new Date(expDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (exp < today) return { text: 'EXPIRED', color: 'text-rose-700 bg-rose-100 font-bold' };
    const daysLeft = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) return { text: `${daysLeft}d LEFT`, color: 'text-amber-700 bg-amber-100 font-bold' };
    return { text: 'VALID ✓', color: 'text-emerald-700 bg-emerald-100 font-bold' };
  };

  // Test rows management
  const tests = coatSheet.tests || [];

  const handleTestRowChange = (index, field, value) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    handleFieldChange('tests', updatedTests);
  };

  const handleRemoveTest = (index) => {
    const updatedTests = tests.filter((_, i) => i !== index);
    handleFieldChange('tests', updatedTests);
  };

  const handleLoadStandardTests = () => {
    const defaultIndices = COAT_DEFAULT_SETS[sid] || [1, 2, 7, 8];
    const newTests = defaultIndices.map(idx => {
      const item = COAT_TEST_CATALOG[idx];
      return {
        t: item.t,
        std: item.std,
        req: item.req,
        act: idx === 0 ? 'Sa 2.5 Cleanliness Confirmed' : idx === 1 ? '110 µm WFT uniform' : idx === 2 ? 'Within specified tolerance' : 'Compliant',
        res: 'Pass'
      };
    });
    handleFieldChange('tests', newTests);
  };

  // DFT Matrix Management
  const dftMin = coatDFT.min || '';
  const dftMax = coatDFT.max || '';
  const dftByType = coatDFT.byType || {};
  const dftVerdict = coatDFT.verdict || '';

  const dftStats = calcCoatDFT(dftMin, dftMax, dftByType, dftVerdict);

  const handleDFTMinMaxChange = (field, value) => {
    const updatedDFT = { ...formData._coatDFT };
    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      [field]: value
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleDFTSpotChange = (type, rowIndex, spotIndex, value) => {
    const updatedDFT = { ...formData._coatDFT };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    const currentRow = { ...currentRows[rowIndex] };
    const currentSpots = [...(currentRow.spots || ['', '', '', ''])];
    currentSpots[spotIndex] = value;
    currentRow.spots = currentSpots;
    currentRows[rowIndex] = currentRow;
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleDFTRowLabelChange = (type, rowIndex, value) => {
    const updatedDFT = { ...formData._coatDFT };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    currentRows[rowIndex] = { ...currentRows[rowIndex], label: value };
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleAddDFTRow = (type) => {
    const updatedDFT = { ...formData._coatDFT };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    const nextNum = currentRows.length + 1;
    const defaultStem = DFT_MINI_META[type].labels[0].replace(/\s+\d+$/, '').trim();
    const newLabel = `${defaultStem} ${nextNum}`;
    currentRows.push({ label: newLabel, spots: ['', '', '', ''] });
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleRemoveDFTRow = (type, rowIndex) => {
    const updatedDFT = { ...formData._coatDFT };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = (currentByType[type] || []).filter((_, i) => i !== rowIndex);
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleLoadStandardDFT = () => {
    const updatedDFT = { ...formData._coatDFT };
    const byType = {};
    DFT_MINI_TYPES.forEach(type => {
      byType[type] = DFT_MINI_META[type].labels.map(lbl => ({
        label: lbl,
        spots: sid === 's1' ? ['70', '72', '68', '74'] : ['115', '118', '112', '120']
      }));
    });
    updatedDFT[sid] = {
      min: dftMin || (sid === 's1' ? '65' : '105'),
      max: dftMax || (sid === 's1' ? '75' : '125'),
      byType,
      verdict: 'Pass'
    };
    onChange('_coatDFT', updatedDFT);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Stage Header + DFT Spec Information Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#E87B1E]" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Stage {coatIndex + 1}: {stageName}
              </h2>
              <p className="text-xs text-slate-500">Application parameters, batch traceability, environmental checks, and SSPC PA-2 DFT matrix</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncCoatingSystem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
              title="Sync values from Section C Coating System"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>Pull Spec from Project Sheet</span>
            </button>
          </div>
        </div>

        {/* Previous vs Current Coat Information Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Previous Coat / Substrate</span>
            <div className="font-bold text-slate-800 mt-0.5 truncate">
              {sid === 's1' ? 'Substrate · Steel Sa 2.5 (No Previous Coat)' : (prevCS?.generic || prevCoatSheet?.generic || 'Previous Coat')}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {sid === 's1' ? 'Profile 50–75 µm' : `Spec: ${prevCS?.min || '—'} – ${prevCS?.max || '—'} µm`}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#E87B1E]">Current Coat (This Stage)</span>
            <div className="font-bold text-[#9E1B1E] mt-0.5 truncate">
              {coatSheet.product || curCS.brand || 'Product Brand'} ({coatSheet.generic || curCS.generic || 'Generic'})
            </div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5">
              Single Coat DFT: <span className="font-bold">{curCS.min || coatSheet.dftspec_min || '—'} – {curCS.max || coatSheet.dftspec_max || '—'} µm</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Running Cumulative System DFT</span>
            <div className="font-mono font-black text-slate-800 text-sm mt-0.5">
              {dftMin || '—'} – {dftMax || '—'} µm
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Cumulative tolerance band on this layer
            </div>
          </div>
        </div>
      </div>

      {/* 1. Application & Equipment Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-4 h-4 text-[#E87B1E]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
            1. Application &amp; Equipment Execution Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Application Method *
            </label>
            <select
              value={coatSheet.method || 'Airless Spray'}
              onChange={(e) => handleFieldChange('method', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
            >
              <option value="Airless Spray">Airless Spray (Tip 0.017"–0.021", 2200 psi)</option>
              <option value="Conventional Air Spray">Conventional Air Spray</option>
              <option value="Plural Component Spray">Plural Component Spray</option>
              <option value="Brush / Stripe Coat">Brush / Stripe Coat</option>
              <option value="Roller Application">Roller Application</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Stripe Coating Applied?
            </label>
            <input
              type="text"
              value={coatSheet.stripe || 'Yes · Brush applied on welds & edges'}
              onChange={(e) => handleFieldChange('stripe', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Yes · Brush applied"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Visible Rusting / Defects
            </label>
            <input
              type="text"
              value={coatSheet.rust || 'No (Sa 2.5 substrate)'}
              onChange={(e) => handleFieldChange('rust', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. No"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Application Start Time
            </label>
            <input
              type="time"
              value={coatSheet.start || '09:00'}
              onChange={(e) => handleFieldChange('start', e.target.value)}
              className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Application End Time
            </label>
            <input
              type="time"
              value={coatSheet.end || '11:30'}
              onChange={(e) => handleFieldChange('end', e.target.value)}
              className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Application Date
            </label>
            <input
              type="date"
              value={coatSheet.date || ''}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Overcoating Interval from Previous Coat (Auto-Calculated)
            </label>
            <input
              type="text"
              readOnly
              value={autoOvercoat}
              className="w-full text-xs font-mono font-bold text-[#9E1B1E] bg-amber-50/50 border border-amber-200 rounded-lg p-2.5 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 2. Paint Material Traceability & Batch Quality */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              2. Paint Material Traceability &amp; 2-Component Batch Control
            </h3>
          </div>
          <span className="text-xs text-slate-500">Batch shelf-life tracking</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              value={coatSheet.mfr || ''}
              onChange={(e) => handleFieldChange('mfr', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Jotun"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Brand Name *
            </label>
            <input
              type="text"
              value={coatSheet.product || ''}
              onChange={(e) => handleFieldChange('product', e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Resist 86"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Generic Type
            </label>
            <input
              type="text"
              value={coatSheet.generic || ''}
              onChange={(e) => handleFieldChange('generic', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Inorganic Zinc Silicate"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Color Shade / RAL
            </label>
            <input
              type="text"
              value={coatSheet.shade || ''}
              onChange={(e) => handleFieldChange('shade', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:border-[#E87B1E] outline-none"
              placeholder="e.g. RAL 9010"
            />
          </div>
        </div>

        {/* Batch Traceability 3-Component Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 font-rajdhani text-slate-700 uppercase text-[11px] font-bold">
                <th className="p-2.5 w-32">Component</th>
                <th className="p-2.5">Batch Number</th>
                <th className="p-2.5 w-44">Expiry Date</th>
                <th className="p-2.5 text-center w-28">Status</th>
                <th className="p-2.5">Mixing Ratio / Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {['A', 'B', 'C'].map((part) => {
                const batch = coatSheet[`batch${part}`] || '';
                const expDate = coatSheet[`exp${part}`] || '';
                const status = getBatchStatus(batch, expDate);

                return (
                  <tr key={part} className="hover:bg-slate-50/60">
                    <td className="p-2.5 font-bold text-slate-800">
                      Part {part} {part === 'A' ? '(Base)' : part === 'B' ? '(Hardener)' : '(Thinner/Additive)'}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={batch}
                        onChange={(e) => handleFieldChange(`batch${part}`, e.target.value)}
                        className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded p-1.5 focus:border-[#E87B1E] outline-none"
                        placeholder={`e.g. ${part}-9921`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        value={expDate}
                        onChange={(e) => handleFieldChange(`exp${part}`, e.target.value)}
                        className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded p-1.5 focus:border-[#E87B1E] outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    {part === 'A' ? (
                      <td rowSpan="3" className="p-2.5 align-top border-l border-slate-200 bg-slate-50/50">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Specified Mixing Ratio
                        </label>
                        <input
                          type="text"
                          value={coatSheet.ratio || '4 : 1 by volume'}
                          onChange={(e) => handleFieldChange('ratio', e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded p-1.5 focus:border-[#E87B1E] outline-none"
                          placeholder="e.g. 4 : 1 by volume"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Induction time: 15–20 min · Pot life: 4 hrs @ 23°C</p>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Environmental Psychrometric Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              3. Environmental Psychrometric Snapshot at Application
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Limits: RH ≤ 85% · MT − DP ≥ 3.0°C</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Reading Time</label>
            <input
              type="time"
              value={coatSheet.envtime || '09:15'}
              onChange={(e) => handleFieldChange('envtime', e.target.value)}
              className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Dry Bulb (°C)</label>
            <input
              type="number"
              step="0.1"
              value={coatSheet.db || ''}
              onChange={(e) => handleFieldChange('db', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
              placeholder="28.5"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Wet Bulb (°C)</label>
            <input
              type="number"
              step="0.1"
              value={coatSheet.wb || ''}
              onChange={(e) => handleFieldChange('wb', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
              placeholder="22.0"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Steel Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={coatSheet.mt || ''}
              onChange={(e) => handleFieldChange('mt', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
              placeholder="32.0"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Rel. Humidity</label>
            <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded p-2 text-center">
              {isNaN(rh) ? '—' : `${rh.toFixed(1)}%`}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Dew Point</label>
            <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded p-2 text-center">
              {isNaN(dp) ? '—' : `${dp.toFixed(1)}°C`}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">MT − DP</label>
            <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded p-2 text-center">
              {isNaN(diff) ? '—' : `${diff.toFixed(1)}°C`}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Verdict</label>
            <div
              className={`text-xs font-black font-rajdhani uppercase rounded p-2 text-center border ${
                hasEnv
                  ? envOK
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {hasEnv ? (envOK ? 'OK · APPLY' : 'NOK · HOLD') : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Coating Inspection Test Parameters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              4. Coating Test Parameters &amp; Inspection Results
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTestCatalog(sid)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:from-[#F39322] hover:to-[#A50021] transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Test from Catalog</span>
            </button>
            <button
              type="button"
              onClick={handleLoadStandardTests}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <span>Standard Default Set</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white font-rajdhani uppercase text-[11px] tracking-wider">
                <th className="p-2.5 text-center w-12">Sr.</th>
                <th className="p-2.5">Test Parameter</th>
                <th className="p-2.5">Standard Ref.</th>
                <th className="p-2.5">Requirement / Acceptance</th>
                <th className="p-2.5">Actual / Observed Result</th>
                <th className="p-2.5 text-center w-28">Result</th>
                <th className="p-2.5 text-center w-12">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400 italic">
                    No inspection tests added for this stage. Click "+ Add Test from Catalog" above.
                  </td>
                </tr>
              ) : (
                tests.map((test, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition">
                    <td className="p-2.5 text-center font-mono font-bold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={test.t || ''}
                        onChange={(e) => handleTestRowChange(idx, 't', e.target.value)}
                        className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={test.std || ''}
                        onChange={(e) => handleTestRowChange(idx, 'std', e.target.value)}
                        className="w-full text-xs text-slate-600 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={test.req || ''}
                        onChange={(e) => handleTestRowChange(idx, 'req', e.target.value)}
                        className="w-full text-xs text-slate-600 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={test.act || ''}
                        onChange={(e) => handleTestRowChange(idx, 'act', e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded p-1 focus:bg-white focus:border-[#E87B1E] outline-none"
                        placeholder="Observed value / status..."
                      />
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={test.res || ''}
                        onChange={(e) => handleTestRowChange(idx, 'res', e.target.value)}
                        className={`w-full text-xs font-bold rounded p-1.5 border outline-none ${
                          test.res === 'Pass'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : test.res === 'Fail'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : test.res === 'NA'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        <option value="">⌛ Pending</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="NA">N.A.</option>
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveTest(idx)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove test"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SSPC PA-2 4-Mini-Table DFT Measurement Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                5. Dry Film Thickness (DFT) Record — SSPC PA-2 (80%–120% Rule)
              </h3>
              <p className="text-xs text-slate-500">Multi-substrate qualification: Plane Surface, 6" Pipe, 6" Deep T-Beam, 12" Wide Flange</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadStandardDFT}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>Load 24-Spot Standard Set</span>
            </button>
          </div>
        </div>

        {/* Specification Bounds Control Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Specified Min DFT (µm)</label>
            <input
              type="number"
              value={dftMin}
              onChange={(e) => handleDFTMinMaxChange('min', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
              placeholder="65"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Specified Max DFT (µm)</label>
            <input
              type="number"
              value={dftMax}
              onChange={(e) => handleDFTMinMaxChange('max', e.target.value)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded p-2 focus:border-[#E87B1E] outline-none"
              placeholder="75"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">80% Lower Bound (PA-2)</label>
            <div className="text-xs font-mono font-bold text-slate-700 bg-slate-200/80 rounded p-2">
              {dftStats.low80 ? `${dftStats.low80} µm` : '—'}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">120% Upper Bound (PA-2)</label>
            <div className="text-xs font-mono font-bold text-slate-700 bg-slate-200/80 rounded p-2">
              {dftStats.high120 ? `${dftStats.high120} µm` : '—'}
            </div>
          </div>
        </div>

        {/* 4 Mini-Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DFT_MINI_TYPES.map((type) => {
            const meta = DFT_MINI_META[type];
            const rows = dftByType[type] || [];
            const res = dftStats.typeResults[type] || {};

            return (
              <div key={type} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-r from-[#9E1B1E] to-[#E87B1E] text-white p-2.5 font-rajdhani font-bold text-xs uppercase flex items-center justify-between">
                    <span>{meta.num}. {meta.title}</span>
                    <span className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded font-normal">
                      4 Spots / Row
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                        <th className="p-2">Position</th>
                        <th className="p-2 text-center w-14">R1</th>
                        <th className="p-2 text-center w-14">R2</th>
                        <th className="p-2 text-center w-14">R3</th>
                        <th className="p-2 text-center w-14">R4</th>
                        <th className="p-2 text-center w-8">×</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-3 text-center text-slate-400 italic">
                            No positions added. Click "+ Add Row" below.
                          </td>
                        </tr>
                      ) : (
                        rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/30">
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.label || ''}
                                onChange={(e) => handleDFTRowLabelChange(type, rIdx, e.target.value)}
                                className="w-full text-xs text-slate-700 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none font-medium"
                              />
                            </td>
                            {[0, 1, 2, 3].map((spotIdx) => {
                              const val = (row.spots && row.spots[spotIdx]) || '';
                              const numV = parseFloat(val);
                              const minN = parseFloat(dftMin);
                              const maxN = parseFloat(dftMax);
                              const low80 = minN * 0.8;
                              const high120 = maxN * 1.2;

                              let spotStyle = 'bg-slate-50 text-slate-800 border-slate-200';
                              if (!isNaN(numV) && !isNaN(low80) && !isNaN(high120)) {
                                if (numV < low80 || numV > high120) {
                                  spotStyle = 'bg-rose-100 text-rose-800 font-bold border-rose-300';
                                } else if (!isNaN(minN) && !isNaN(maxN) && numV >= minN && numV <= maxN) {
                                  spotStyle = 'bg-emerald-100 text-emerald-800 font-bold border-emerald-300';
                                } else {
                                  spotStyle = 'bg-amber-100 text-amber-800 border-amber-300';
                                }
                              }

                              return (
                                <td key={spotIdx} className="p-1 text-center">
                                  <input
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleDFTSpotChange(type, rIdx, spotIdx, e.target.value)}
                                    className={`w-12 text-center text-xs font-mono rounded p-1 border outline-none ${spotStyle}`}
                                    placeholder="—"
                                  />
                                </td>
                              );
                            })}
                            <td className="p-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveDFTRow(type, rIdx)}
                                className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                                title="Remove row"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-amber-50/70 text-slate-800 font-bold text-[11px] border-t border-slate-200">
                        <td className="p-2">Substrate Average:</td>
                        <td colSpan="4" className="p-2 text-center font-mono text-[#9E1B1E]">
                          {res.avg || '—'} µm ({res.count || 0} readings)
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAddDFTRow(type)}
                    className="text-[11px] font-bold text-[#E87B1E] hover:text-[#9E1B1E] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Position Row</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Total Summary Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grand Average DFT</span>
            <div className="text-xl font-black font-mono text-[#F8C078] mt-0.5">
              {dftStats.grandAvgStr}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spot Readings</span>
            <div className="text-xl font-black font-mono text-white mt-0.5">
              {dftStats.totalReadings}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Out of Range (80%–120%)</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${dftStats.outOfRange === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {dftStats.outOfRange}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Stage DFT Verdict
            </label>
            <select
              value={dftVerdict || dftStats.autoVerdict}
              onChange={(e) => handleDFTMinMaxChange('verdict', e.target.value)}
              className={`w-full text-xs font-black uppercase rounded p-1.5 outline-none ${
                (dftVerdict || dftStats.autoVerdict) === 'Pass' || (dftVerdict || dftStats.autoVerdict) === 'PASS'
                  ? 'bg-emerald-600 text-white'
                  : (dftVerdict || dftStats.autoVerdict) === 'Rework' || (dftVerdict || dftStats.autoVerdict) === 'REWORK'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <option value="Pass">PASS</option>
              <option value="Rework">REWORK</option>
              <option value="Fail">FAIL</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
