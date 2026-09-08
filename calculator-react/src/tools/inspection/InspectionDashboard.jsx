// src/tools/inspection/InspectionDashboard.jsx
import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Camera, 
  ArrowUpRight, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { formatNum } from '../../utils/calculations';

export default function InspectionDashboard({ state }) {
  const stages = state.stages || {};
  const stageList = Object.values(stages);

  // 1. Weather Compliance Analytics
  let totalWeatherHours = 0;
  let okWeatherHours = 0;

  stageList.forEach(stg => {
    (stg.weatherSlots || []).forEach(slot => {
      if (slot.dryC && slot.wetC) {
        totalWeatherHours++;
        const dry = parseFloat(slot.dryC);
        const wet = parseFloat(slot.wetC);
        const metal = parseFloat(slot.metalC);
        if (!isNaN(dry) && !isNaN(wet)) {
          const Ew = 6.112 * Math.exp((17.502 * wet) / (240.97 + wet));
          const Ed = 6.112 * Math.exp((17.502 * dry) / (240.97 + dry));
          const E = Ew - 0.00066 * (1 + 0.00115 * wet) * 1013.25 * (dry - wet);
          const rh = (E / Ed) * 100;
          const logE = Math.log(Math.max(0.001, E) / 6.112);
          const dp = (240.97 * logE) / (17.502 - logE);
          const diff = metal - dp;
          if (rh <= 85.0 && (isNaN(metal) || diff >= 3.0)) {
            okWeatherHours++;
          }
        }
      }
    });
  });

  const weatherCompliancePct = totalWeatherHours > 0 
    ? Math.round((okWeatherHours / totalWeatherHours) * 100) 
    : 100;

  // 2. DFT Spot Distribution Analysis
  let totalDftSpots = 0;
  let compliantDftSpots = 0;
  let allDftValues = [];

  stageList.forEach(stg => {
    const min = parseFloat(stg.dftRecord?.minDft) || 0;
    const max = parseFloat(stg.dftRecord?.maxDft) || 0;
    const lower80 = min * 0.8;
    const upper120 = max * 1.2;

    (stg.dftRecord?.locations || []).forEach(loc => {
      (loc.spots || []).forEach(s => {
        const val = parseFloat(s);
        if (!isNaN(val) && val > 0) {
          totalDftSpots++;
          allDftValues.push(val);
          if (min > 0 && val >= lower80 && (max === 0 || val <= upper120)) {
            compliantDftSpots++;
          }
        }
      });
    });
  });

  const dftCompliancePct = totalDftSpots > 0
    ? Math.round((compliantDftSpots / totalDftSpots) * 100)
    : 100;

  // 3. Adhesion Compliance
  const dollies = state.pullOffAdhesion?.dollies || [];
  const targetAdhesion = parseFloat(state.pullOffAdhesion?.specifiedTargetMpa) || 8.0;
  const passedDollies = dollies.filter(d => (parseFloat(d.pressureMpa) || 0) >= targetAdhesion).length;
  const adhesionCompliancePct = dollies.length > 0
    ? Math.round((passedDollies / dollies.length) * 100)
    : 100;

  // 4. Overall Quality Compliance Score
  const overallQualityScore = Math.round(
    (weatherCompliancePct * 0.3) + 
    (dftCompliancePct * 0.4) + 
    (adhesionCompliancePct * 0.3)
  );

  // 5. Non-conformance defect tally
  const reworkList = state.reworkLog || [];
  const defectCounts = {};
  reworkList.forEach(r => {
    const name = r.defectName || 'Unspecified';
    defectCounts[name] = (defectCounts[name] || 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-mono font-bold uppercase">
              Executive Analytics
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Coating QA/QC Performance Center &amp; BI Insights
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time compliance analytics across climatic windows, SSPC-PA 2 DFT spot distributions, tensile adhesion results, and defect trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 block">Overall Quality Index</span>
            <span className="text-xl font-black font-mono text-indigo-900">{overallQualityScore}%</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Weather Compliance</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1">{weatherCompliancePct}%</div>
            <span className="text-[10px] text-emerald-600 font-semibold">{okWeatherHours} / {totalWeatherHours} Monitored Hours OK</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">DFT Tolerance (80-120%)</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1">{dftCompliancePct}%</div>
            <span className="text-[10px] text-sky-600 font-semibold">{compliantDftSpots} / {totalDftSpots} Spots Within Bound</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Pull-Off Adhesion Pass</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1">{adhesionCompliancePct}%</div>
            <span className="text-[10px] text-amber-600 font-semibold">{passedDollies} / {dollies.length} Dollies &ge; {targetAdhesion} MPa</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Total Defect NCRs</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1">{reworkList.length}</div>
            <span className="text-[10px] text-slate-500 font-semibold">{reworkList.filter(r => r.status === 'Closed').length} Closed &amp; Verified</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stage Progress Matrix */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Inspection Stage Quality Compliance Summary
          </h3>

          <div className="space-y-3 pt-2">
            {stageList.map((stg) => {
              const spots = [];
              (stg.dftRecord?.locations || []).forEach(l => {
                (l.spots || []).forEach(s => {
                  const val = parseFloat(s);
                  if (!isNaN(val) && val > 0) spots.push(val);
                });
              });
              const avg = spots.length > 0 
                ? (spots.reduce((a, b) => a + b, 0) / spots.length).toFixed(1) 
                : '0.0';

              const min = parseFloat(stg.dftRecord?.minDft) || 0;
              const isPass = min > 0 && parseFloat(avg) >= min;

              return (
                <div key={stg.stageId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-[10.5px] font-bold text-slate-800 uppercase">
                        {stg.stageId.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {stg.stageTitle || stg.stageName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Mfr: {stg.paintDetails?.manufacturer || '—'} · Product: {stg.paintDetails?.productName || '—'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-sm text-slate-900">{avg} µm</div>
                    <span className={`text-[10px] font-bold ${isPass ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {spots.length > 0 ? (isPass ? '✅ NDFT COMPLIANT' : '⚠️ UNDER SPEC') : 'NO READINGS'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Defect Frequency Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            Coating Non-Conformance Defect Breakdown
          </h3>

          <div className="space-y-3 pt-2">
            {Object.keys(defectCounts).length > 0 ? (
              Object.entries(defectCounts).map(([defectName, count], i) => {
                const pct = Math.round((count / reworkList.length) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{defectName}</span>
                      <span className="font-mono text-slate-500">{count} occurrences ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Zero defects logged. Quality compliance is 100%.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
