import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Wind, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { DC_DB, NOZZLE_AIR_DB } from '../../utils/standardsDatabase';
import { formatNum } from '../../utils/calculations';

export default function DustCollectorTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Enclosure
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [roomTag, setRoomTag] = useState('');

  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [roomH, setRoomH] = useState('');
  const [nozzleSize, setNozzleSize] = useState('9.5'); // 9.5mm #6
  const [nozzlesCount, setNozzlesCount] = useState('1');
  const [targetAch, setTargetAch] = useState('60'); // Air changes per hour (60–90 typical)
  const [safetyFactor, setSafetyFactor] = useState('15'); // %
  const [copied, setCopied] = useState(false);

  // Calculations
  const hasInputs = roomL && roomW && roomH;
  const roomVolM3 = hasInputs ? Number(roomL) * Number(roomW) * Number(roomH) : 0;
  const roomVolCuFt = roomVolM3 * 35.3147;

  // 1. ACH Airflow Demand: CFM = (Volume Cu Ft × ACH) / 60
  const qAchCfm = (roomVolCuFt * Number(targetAch || 60)) / 60;

  // 2. Cross-draft Face Velocity Demand: CFM = Face Area (W × H sq ft) × Velocity (ft/min)
  const faceAreaSqFt = hasInputs ? (Number(roomW) * 3.28084) * (Number(roomH) * 3.28084) : 0;
  const qFaceCfm = faceAreaSqFt * 60; // 60 ft/min standard

  // 3. Nozzle Compressed Air Supply Demand
  const nozzleAir = NOZZLE_AIR_DB[nozzleSize]?.cfm[1] || 500;
  const qNozzlesCfm = nozzleAir * Number(nozzlesCount || 1);

  // Governing airflow + safety factor
  const baseGoverningCfm = hasInputs ? Math.max(qAchCfm, qFaceCfm, qNozzlesCfm * 1.5) : 0;
  const totalRequiredCfm = baseGoverningCfm * (1 + Number(safetyFactor || 0) / 100);

  // Recommended Standard Dust Collector Model matching
  const matchedModel = DC_DB.find(m => m.cap >= totalRequiredCfm) || DC_DB[DC_DB.length - 1];

  const handleOpenGuideline = () => {
    openGuideline('pro-dcc');
  };

  const handleCalculate = () => {
    if (!roomL || !roomW || !roomH) {
      addToast('Missing Required Inputs', 'Please enter Blast Chamber Length, Width, and Height.', 'warning');
      return;
    }
    addToast('Calculated Ventilation Sizing', 'Dust collector airflow and equipment sizing evaluated.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setRoomTag('');
    setRoomL('');
    setRoomW('');
    setRoomH('');
    setNozzleSize('9.5');
    setNozzlesCount('1');
    setTargetAch('60');
    setSafetyFactor('15');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!hasInputs) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Dust Collector Sizing Report
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${roomTag ? `Facility/Chamber: ${roomTag}\n` : ''}Blast Room: ${roomL} m × ${roomW} m × ${roomH} m (${formatNum(roomVolM3, 1)} m³) | Nozzles: ${nozzlesCount} × #${nozzleSize}
Airflow by ACH (${targetAch} ACH): ${formatNum(qAchCfm, 0)} CFM
Airflow by Cross-Draft Face Velocity: ${formatNum(qFaceCfm, 0)} CFM
--------------------------------------
Total Recommended Airflow (+${safetyFactor}% SF): ${formatNum(totalRequiredCfm, 0)} CFM
Suggested Equipment Model: ${matchedModel.model} (${matchedModel.cap} CFM · ${matchedModel.hp} HP / ${matchedModel.kw} kW · ${matchedModel.fa} m² filter)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Dust collector sizing report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-DCC-1 · ACGIH
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Dust Collector &amp; Blast Room Ventilation Sizing
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine required exhaust airflow (CFM &amp; m³/hr), filter cloth area (m²), fan motor (HP/kW), and standard equipment model matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenGuideline}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          
          {/* Section A: Project & Enclosure */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Enclosure Information
              </h2>
              <Calculator className="w-4 h-4 text-[#F7941D]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. New Blast Facility Phase-1"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Client <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Mazagon Dock Shipbuilders"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Facility / Room Tag <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={roomTag}
                  onChange={e => setRoomTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Blast Chamber #4"
                />
              </div>
            </div>
          </div>

          {/* Section B: Blast Chamber Dimensions */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Blast Chamber Dimensions &amp; Nozzle Setup
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Length (m)</label>
                  <input
                    type="number"
                    value={roomL}
                    onChange={e => setRoomL(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Width (m)</label>
                  <input
                    type="number"
                    value={roomW}
                    onChange={e => setRoomW(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 6"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (m)</label>
                  <input
                    type="number"
                    value={roomH}
                    onChange={e => setRoomH(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Blast Nozzle Size</label>
                  <select
                    value={nozzleSize}
                    onChange={e => setNozzleSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  >
                    {Object.keys(NOZZLE_AIR_DB).map(n => (
                      <option key={n} value={n}>{NOZZLE_AIR_DB[n].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nozzles Operating (Nos.)</label>
                  <input
                    type="number"
                    value={nozzlesCount}
                    onChange={e => setNozzlesCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Air Changes (ACH)</label>
                  <input
                    type="number"
                    value={targetAch}
                    onChange={e => setTargetAch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Design Safety Factor (%)</label>
                  <input
                    type="number"
                    value={safetyFactor}
                    onChange={e => setSafetyFactor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 15"
                  />
                </div>
              </div>

              {/* Form Actions: Calculate & Reset */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Calculate Dust Collector</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Exhaust Airflow Demand
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                <span>ACGIH Sizing</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Recommended Dust Collector Airflow</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(totalRequiredCfm, 0)} CFM
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Suggested Standard Unit: {matchedModel.model} ({matchedModel.cap} CFM)
              </p>
            </div>

            {/* Equipment Matching Box */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Fan Motor Power:</span>
                <span className="font-mono text-[#D97706]">{matchedModel.hp} HP / {matchedModel.kw} kW</span>
              </div>
              <div className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Filter Cloth Area:</span>
                <span className="font-mono text-slate-700">{matchedModel.fa} m² (Pulse-Jet Cartridge)</span>
              </div>
              <div className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Suitable Room Envelope:</span>
                <span className="font-mono text-slate-500">{matchedModel.room}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
