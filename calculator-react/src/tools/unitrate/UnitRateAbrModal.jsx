import React, { useState } from 'react';
import { X, Layers, Check } from 'lucide-react';
import { CURRENCY_CONFIG, ABRASIVE_CONSUMPTION_RATES } from '../../data/unitRateDatabase';

export default function UnitRateAbrModal({ 
  isOpen, 
  onClose, 
  currency = 'INR',
  totalProjectArea = 1000,
  onApplyRate 
}) {
  const [mediaType, setMediaType] = useState('garnet');
  const [pricePerKg, setPricePerKg] = useState(15);
  const [selectedGradeIdx, setSelectedGradeIdx] = useState(0);

  if (!isOpen) return null;

  const curr = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const ratesList = ABRASIVE_CONSUMPTION_RATES[mediaType] || ABRASIVE_CONSUMPTION_RATES.garnet;
  const selectedGrade = ratesList[selectedGradeIdx] || ratesList[0];

  const numPrice = parseFloat(pricePerKg) || 0;
  const kgPerM2 = selectedGrade.kgPerM2;
  const costPerM2 = kgPerM2 * numPrice;
  const totalKg = kgPerM2 * totalProjectArea;
  const totalCost = totalKg * numPrice;

  const handleApply = () => {
    if (onApplyRate && costPerM2 > 0) {
      onApplyRate(Math.round(costPerM2 * 100) / 100);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Abrasive Media &amp; Blasting Rate Helper</h3>
              <p className="text-xs text-slate-400">Calculates blasting abrasive consumption (kg/m²) and media cost.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Abrasive Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => {
                  setMediaType(e.target.value);
                  setSelectedGradeIdx(0);
                }}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="garnet">Almandine Garnet (30/60 &amp; 20/40 mesh)</option>
                <option value="copper_slag">Copper Slag / Disposable Grit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Abrasive Price ({curr.sym} / kg)</label>
              <input
                type="number"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Substrate & Cleanliness Grade Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Substrate Cleanliness Standard</label>
            <div className="space-y-1.5">
              {ratesList.map((g, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGradeIdx(idx)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    selectedGradeIdx === idx
                      ? 'bg-blue-950/60 border-blue-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{g.grade}</span>
                    <span className="text-[10px] text-slate-400">{g.desc}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {g.kgPerM2} kg / m²
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Abrasive Consumption:</span>
              <span className="font-mono font-bold text-amber-400">{kgPerM2} kg / m²</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Project Requirement ({totalProjectArea.toFixed(0)} m²):</span>
              <span className="font-mono font-bold text-white">{(totalKg / 1000).toFixed(2)} Metric Tons</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-white uppercase">Abrasive Cost / m²:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                {curr.sym} {costPerM2.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Abrasive Row ({curr.sym} {costPerM2.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
