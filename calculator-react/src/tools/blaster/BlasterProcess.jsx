import React from 'react';
import {
  Thermometer,
  Flame,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  TestTube,
  FileText
} from 'lucide-react';
import { ABRASIVE_MAP, INSP_CATALOG, INSP_STANDARD_SET } from '../../data/blasterDatabase';

export default function BlasterProcess({
  state,
  onChange,
  metrics,
  onNavigate,
  onOpenCatalog
}) {
  const {
    evaluatedEnvRows,
    dbAvg,
    wbAvg,
    mtAvg,
    rhAvg,
    dpAvg,
    diffAvg,
    envFinalOK,
    profAvg,
    isProfPass,
    profVerdictText,
    inspPass,
    inspFail,
    inspNa,
    inspPct
  } = metrics;

  // Environmental Row Management
  const handleAddEnvRow = () => {
    const rows = state.envRows || [];
    const lastTime = rows[rows.length - 1]?.time || '1000';
    const nextHour = (parseInt(lastTime.slice(0, 2)) || 10) + 1;
    const newTime = `${nextHour.toString().padStart(2, '0')}00`;
    onChange('envRows', [...rows, { time: newTime, db: '', wb: '', mt: '' }]);
  };

  const handleRemoveEnvRow = (index) => {
    const rows = state.envRows || [];
    onChange('envRows', rows.filter((_, i) => i !== index));
  };

  const handleEnvRowChange = (index, field, value) => {
    const rows = [...(state.envRows || [])];
    if (!rows[index]) rows[index] = { time: '', db: '', wb: '', mt: '' };
    rows[index] = { ...rows[index], [field]: value };
    onChange('envRows', rows);
  };

  // Surface Profile Spot Management
  const handleProfileSpotChange = (index, value) => {
    const spots = [...(state.profileSpots || [0, 0, 0, 0, 0])];
    spots[index] = parseFloat(value) || 0;
    onChange('profileSpots', spots);
  };

  // Abrasive Type Selection (Autofills class and standards)
  const handleAbrasiveTypeChange = (type) => {
    onChange('abType', type);
    const map = ABRASIVE_MAP[type];
    if (map) {
      onChange('abClass', map.cls);
      onChange('abSspc', map.sspc);
      onChange('abIso', map.iso);
    }
  };

  // Inspection Row Management
  const handleInspRowChange = (index, field, value) => {
    const rows = [...(state.inspRows || [])];
    if (!rows[index]) rows[index] = { p: '', std: '', req: '', obs: '', res: '' };
    rows[index] = { ...rows[index], [field]: value };
    onChange('inspRows', rows);
  };

  const handleRemoveInspRow = (index) => {
    const rows = state.inspRows || [];
    onChange('inspRows', rows.filter((_, i) => i !== index));
  };

  const handleAddStandard5Set = () => {
    const stdRows = INSP_STANDARD_SET.map(idx => {
      const cat = INSP_CATALOG[idx];
      return {
        p: cat.t,
        std: cat.std,
        req: cat.req,
        obs: 'Conforms to standard',
        res: 'Pass'
      };
    });
    onChange('inspRows', stdRows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 04 · Step 4 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Blasting Process &amp; Environmental Quality Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Psychrometric Dew-Point Monitoring · Surface Profile Averaging · Abrasive Selection · Process Inspection Tests.
          </p>
        </div>

        <button
          onClick={() => onNavigate('photo')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <span>Next: Photo Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Part 1: Environmental Monitoring */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#E8700A]" />
              <span>Environmental Readings (Psychrometric Dew Point Analysis)</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Pass Criteria: Relative Humidity $\le$ {state.envRhLimit || 85}% &nbsp;·&nbsp; Steel Temp − Dew Point $\ge$ 3°C
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-500">RH Limit:</span>
              <input
                type="number"
                min="50"
                max="95"
                value={state.envRhLimit}
                onChange={(e) => onChange('envRhLimit', parseFloat(e.target.value) || 85)}
                className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-right text-xs"
              />
              <span className="text-slate-400">%</span>
            </div>

            <button
              onClick={handleAddEnvRow}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Timing Row</span>
            </button>
          </div>
        </div>

        {/* Environmental Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-2 w-10">#</th>
                <th className="py-2.5 px-3">Time (HRS)</th>
                <th className="py-2.5 px-3">Dry Bulb (°C)</th>
                <th className="py-2.5 px-3">Wet Bulb (°C)</th>
                <th className="py-2.5 px-3">Steel Temp (°C)</th>
                <th className="py-2.5 px-3 bg-amber-50/50 dark:bg-amber-950/20 text-[#E8700A]">RH (%)</th>
                <th className="py-2.5 px-3 bg-amber-50/50 dark:bg-amber-950/20 text-[#E8700A]">Dew Point (°C)</th>
                <th className="py-2.5 px-3 bg-amber-50/50 dark:bg-amber-950/20 text-[#E8700A]">MT − DP (°C)</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-2 w-10">×</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {evaluatedEnvRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2 px-2 font-mono font-bold text-slate-400">{i + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={r.time}
                      onChange={(e) => handleEnvRowChange(i, 'time', e.target.value)}
                      placeholder="HHMM"
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-center text-xs"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.1"
                      value={r.db}
                      onChange={(e) => handleEnvRowChange(i, 'db', e.target.value)}
                      placeholder="32.0"
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-center text-xs"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.1"
                      value={r.wb}
                      onChange={(e) => handleEnvRowChange(i, 'wb', e.target.value)}
                      placeholder="25.0"
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-center text-xs"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.1"
                      value={r.mt}
                      onChange={(e) => handleEnvRowChange(i, 'mt', e.target.value)}
                      placeholder="34.0"
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-center text-xs"
                    />
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 bg-amber-50/30 dark:bg-amber-950/10">
                    {r.rh}
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 bg-amber-50/30 dark:bg-amber-950/10">
                    {r.dp}
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 bg-amber-50/30 dark:bg-amber-950/10">
                    {r.diff}
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      r.verdict === 'OK' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : r.verdict === 'NOK' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' : 'text-slate-400'
                    }`}>
                      {r.verdict}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => handleRemoveEnvRow(i)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                <td colSpan={2} className="py-2 px-3 text-right text-slate-500 uppercase text-[10px]">
                  Average
                </td>
                <td className="py-2 px-3 font-mono">{dbAvg}</td>
                <td className="py-2 px-3 font-mono">{wbAvg}</td>
                <td className="py-2 px-3 font-mono">{mtAvg}</td>
                <td className="py-2 px-3 font-mono text-[#E8700A]">{rhAvg}</td>
                <td className="py-2 px-3 font-mono text-[#E8700A]">{dpAvg}</td>
                <td className="py-2 px-3 font-mono text-[#E8700A]">{diffAvg}</td>
                <td className="py-2 px-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    envFinalOK ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {envFinalOK ? 'ACCEPTABLE' : 'REWORK'}
                  </span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Part 2: Surface Preparation & 5-Spot Profile Readings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Flame className="w-4 h-4 text-[#E8700A]" />
          <span>Surface Preparation Parameters &amp; Profile Readings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Method</label>
            <input
              type="text"
              value={state.spMethod}
              onChange={(e) => onChange('spMethod', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prep Reference</label>
            <input
              type="text"
              value={state.spRef}
              onChange={(e) => onChange('spRef', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Required Cleanliness</label>
            <input
              type="text"
              value={state.spStdReq}
              onChange={(e) => onChange('spStdReq', e.target.value)}
              placeholder="e.g. SA 2.5"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#E8700A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Profile Requirement</label>
            <input
              type="text"
              value={state.spProfReq}
              onChange={(e) => onChange('spProfReq', e.target.value)}
              placeholder="e.g. 50-75 µm"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
        </div>

        {/* 5-Spot Profile Table */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Surface Profile Replica Tape / Stylus Gauge Readings (µm):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 items-center">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block text-center">Spot {idx + 1}</span>
                <input
                  type="number"
                  value={state.profileSpots?.[idx] || ''}
                  onChange={(e) => handleProfileSpotChange(idx, e.target.value)}
                  placeholder="65"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-center font-bold text-xs"
                />
              </div>
            ))}

            <div className="space-y-1 text-center bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Average</span>
              <span className="text-sm font-black font-mono text-[#E8700A] block">{profAvg} µm</span>
            </div>

            <div className="space-y-1 text-center bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Verdict</span>
              <span className={`text-xs font-black font-mono block ${
                isProfPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {profVerdictText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Abrasive Media Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Layers className="w-4 h-4 text-[#E8700A]" />
          <span>Abrasive Media Selection &amp; Traceability Standards</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Abrasive Type</label>
            <select
              value={state.abType}
              onChange={(e) => handleAbrasiveTypeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A]"
            >
              {Object.keys(ABRASIVE_MAP).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Material Class</label>
            <input
              type="text"
              value={state.abClass}
              onChange={(e) => onChange('abClass', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">SSPC Standard</label>
            <input
              type="text"
              value={state.abSspc}
              onChange={(e) => onChange('abSspc', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-[#E8700A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ISO Standard</label>
            <input
              type="text"
              value={state.abIso}
              onChange={(e) => onChange('abIso', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mesh Size / Grade</label>
            <input
              type="text"
              value={state.abMesh}
              onChange={(e) => onChange('abMesh', e.target.value)}
              placeholder="e.g. GMA 30/60 Mesh"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Manufacturer</label>
            <input
              type="text"
              value={state.abMfr}
              onChange={(e) => onChange('abMfr', e.target.value)}
              placeholder="e.g. GMA Garnet"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Batch / Lot No.</label>
            <input
              type="text"
              value={state.abBatch}
              onChange={(e) => onChange('abBatch', e.target.value)}
              placeholder="e.g. GMA-2026-B849"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">MTC / Test Cert Ref</label>
            <input
              type="text"
              value={state.abTc}
              onChange={(e) => onChange('abTc', e.target.value)}
              placeholder="e.g. MTC-GMA-99214"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

        </div>
      </div>

      {/* Part 4: Surface Preparation Process Inspection Tests */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <TestTube className="w-4 h-4 text-[#E8700A]" />
              <span>Inspection Summary · Process Test Results</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Pass Rate: <b className="text-emerald-600 dark:text-emerald-400 font-mono">{inspPct.toFixed(0)}%</b> ({inspPass} Pass / {inspFail} Fail)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCatalog}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catalog Picker</span>
            </button>

            <button
              onClick={handleAddStandard5Set}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8700A]" />
              <span>Reset 5-Test Set</span>
            </button>
          </div>
        </div>

        {/* Inspection Tests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 text-center w-10">#</th>
                <th className="py-2.5 px-4">Test Parameter</th>
                <th className="py-2.5 px-3 w-40">Standard Ref</th>
                <th className="py-2.5 px-4">Requirement</th>
                <th className="py-2.5 px-4">Observed / Actual</th>
                <th className="py-2.5 px-3 text-center w-28">Result</th>
                <th className="py-2.5 px-2 text-center w-10">×</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(state.inspRows || []).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={row.p}
                      onChange={(e) => handleInspRowChange(i, 'p', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.std}
                      onChange={(e) => handleInspRowChange(i, 'std', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={row.req}
                      onChange={(e) => handleInspRowChange(i, 'req', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={row.obs}
                      onChange={(e) => handleInspRowChange(i, 'obs', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <select
                      value={row.res}
                      onChange={(e) => handleInspRowChange(i, 'res', e.target.value)}
                      className={`w-full px-2 py-1 rounded border text-xs font-bold ${
                        row.res === 'Pass' ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : row.res === 'Fail' ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <option value="">—</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="NA">N.A.</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleRemoveInspRow(i)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="pt-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Inspection Process Observations / Remarks
          </label>
          <textarea
            rows={2}
            value={state.remarkInsp}
            onChange={(e) => onChange('remarkInsp', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A]"
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onNavigate('photo')}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <span>Proceed to 05. Photo Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
