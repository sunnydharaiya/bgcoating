import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Plus, Trash2, Layers, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { SAW_SECTIONS_DB } from '../../utils/standardsDatabase';
import { formatNum } from '../../utils/calculations';

export default function StructureBOQTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project Info
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [boqRef, setBoqRef] = useState('');

  const [sectionType, setSectionType] = useState('UB');
  const [sectionSize, setSectionSize] = useState('200UB22');
  const [lengthM, setLengthM] = useState('');
  const [qty, setQty] = useState('1');
  const [boqItems, setBoqItems] = useState([]);
  const [copied, setCopied] = useState(false);

  const activeCatalog = SAW_SECTIONS_DB[sectionType] || {};
  const currentData = activeCatalog[sectionSize] || [0.911, 22.3]; // [saPerM, wtPerM]

  const currentSa = lengthM && qty ? currentData[0] * Number(lengthM) * Number(qty) : 0;
  const currentWt = lengthM && qty ? currentData[1] * Number(lengthM) * Number(qty) : 0;

  const grandTotalSa = boqItems.reduce((acc, it) => acc + it.totalSa, 0);
  const grandTotalWtKg = boqItems.reduce((acc, it) => acc + it.totalWtKg, 0);
  const grandTotalMT = grandTotalWtKg / 1000;
  const overallKgM2 = grandTotalSa > 0 ? grandTotalWtKg / grandTotalSa : 0;

  const handleAddItem = () => {
    if (!lengthM || Number(lengthM) <= 0) {
      addToast('Missing Required Inputs', 'Please enter a valid member Length (m).', 'warning');
      return;
    }
    const newItem = {
      id: Date.now(),
      type: sectionType,
      size: sectionSize,
      length: Number(lengthM),
      qty: Number(qty || 1),
      saPerM: currentData[0],
      wtPerM: currentData[1],
      totalSa: currentSa,
      totalWtKg: currentWt
    };
    setBoqItems(prev => [...prev, newItem]);
    addToast('Item Added to BOQ', `${sectionSize} (${qty || 1} nos) added.`, 'success');
  };

  const handleRemoveItem = (id) => {
    setBoqItems(prev => prev.filter(it => it.id !== id));
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setBoqRef('');
    setSectionType('UB');
    setSectionSize('200UB22');
    setLengthM('');
    setQty('1');
    setBoqItems([]);
    addToast('Form Reset', 'All input parameters and BOQ rows have been cleared.', 'info');
  };

  const handleOpenGuideline = () => {
    openGuideline('pro-saw');
  };

  const handleCopy = () => {
    if (boqItems.length === 0) {
      addToast('No Items', 'Please add structural members to the BOQ first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Structural Steel BOQ Take-Off Summary
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${boqRef ? `Drawing/BOQ Ref: ${boqRef}\n` : ''}Total Members in BOQ: ${boqItems.length} lines
--------------------------------------
Total Paintable Surface Area: ${formatNum(grandTotalSa, 2)} m²
Total Steel Mass: ${formatNum(grandTotalMT, 3)} MT (${formatNum(grandTotalWtKg, 1)} kg)
Overall Structure Weight-to-Area Ratio: ${formatNum(overallKgM2, 2)} kg/m²`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Structural BOQ summary copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-SAW-1
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Structural Steel Section BOQ Builder
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build a multi-member project bill of quantities (BOQ) with standard Universal Beams (UB), Columns (UC), Channels (PFC), Angles (EA), and Hollow Sections (SHS/RHS).
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

      {/* Section A: Project Info */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            A · Project &amp; Drawing Info
          </h2>
          <Calculator className="w-4 h-4 text-[#F7941D]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Project Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              placeholder="e.g. Flare Structure Package"
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
              placeholder="e.g. Reliance Industries"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Drawing / BOQ Ref <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
            </label>
            <input
              type="text"
              value={boqRef}
              onChange={e => setBoqRef(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              placeholder="e.g. DWG-STR-2024-08"
            />
          </div>
        </div>
      </div>

      {/* Member Builder Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            B · Add Structural Member to BOQ
          </h2>
          <Calculator className="w-4 h-4 text-[#F7941D]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section Profile</label>
            <select
              value={sectionType}
              onChange={e => {
                setSectionType(e.target.value);
                const firstSize = Object.keys(SAW_SECTIONS_DB[e.target.value] || {})[0];
                setSectionSize(firstSize);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            >
              <option value="UB">Universal Beam (UB)</option>
              <option value="UC">Universal Column (UC)</option>
              <option value="SHS">Square Hollow Section (SHS)</option>
              <option value="RHS">Rectangular Hollow (RHS)</option>
              <option value="EA">Equal Angle (EA)</option>
              <option value="PFC">Parallel Flange Channel (PFC)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Standard Size</label>
            <select
              value={sectionSize}
              onChange={e => setSectionSize(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            >
              {Object.keys(activeCatalog).map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Length (m)</label>
            <input
              type="number"
              value={lengthM}
              onChange={e => setLengthM(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              placeholder="e.g. 12"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Nos)</label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              placeholder="e.g. 1"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 px-3 bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-3 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs transition hover:border-[#A50021] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOQ Table & Grand Total Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F7941D]" />
            <span>Accumulated Project BOQ Take-off ({boqItems.length} items)</span>
          </span>
          <span className="text-xs font-mono font-bold text-[#D97706]">
            Total Area: {formatNum(grandTotalSa, 2)} m² · Weight: {formatNum(grandTotalMT, 3)} MT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Profile &amp; Size</th>
                <th className="p-3">Length</th>
                <th className="p-3">Qty</th>
                <th className="p-3 text-right">Unit Area</th>
                <th className="p-3 text-right">Total Area (m²)</th>
                <th className="p-3 text-right">Total Weight</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {boqItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3 text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{item.type} {item.size}</td>
                  <td className="p-3">{item.length} m</td>
                  <td className="p-3">{item.qty} nos</td>
                  <td className="p-3 text-right text-slate-500">{item.saPerM} m²/m</td>
                  <td className="p-3 text-right font-bold text-[#D97706]">{formatNum(item.totalSa, 2)} m²</td>
                  <td className="p-3 text-right text-slate-700">{formatNum(item.totalWtKg / 1000, 3)} MT</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total Footer Summary Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#D97706]">Project Grand Total</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatNum(grandTotalSa, 2)} m² Paintable Surface · {formatNum(grandTotalMT, 3)} Metric Tonnes
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">Average Structural Density:</span>
            <span className="font-bold text-slate-800">{formatNum(overallKgM2, 1)} kg / m²</span>
          </div>
        </div>

      </div>

    </div>
  );
}
