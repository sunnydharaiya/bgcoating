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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E6E8EC] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Abrasive Media &amp; Blasting Rate Helper</h3>
              <p className="text-xs text-slate-500">Calculates blasting abrasive consumption (kg/m²) and media cost.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Abrasive Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => {
                  setMediaType(e.target.value);
                  setSelectedGradeIdx(0);
                }}
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              >
                <option value="garnet">Almandine Garnet (30/60 &amp; 20/40 mesh)</option>
                <option value="copper_slag">Copper Slag / Disposable Grit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Abrasive Price ({curr.sym} / kg)</label>
              <input
                type="number"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Substrate & Cleanliness Grade Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Substrate Cleanliness Standard</label>
            <div className="space-y-1.5">
              {ratesList.map((g, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGradeIdx(idx)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    selectedGradeIdx === idx
                      ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-slate-800">{g.grade}</span>
                    <span className="text-[10px] text-slate-500">{g.desc}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-600">
                    {g.kgPerM2} kg / m²
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Abrasive Consumption:</span>
              <span className="font-mono font-bold text-orange-600">{kgPerM2} kg / m²</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Total Project Requirement ({totalProjectArea.toFixed(0)} m²):</span>
              <span className="font-mono font-bold text-slate-800">{(totalKg / 1000).toFixed(2)} Metric Tons</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-slate-800 uppercase">Abrasive Cost / m²:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-600">
                {curr.sym} {costPerM2.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition border border-slate-200 shadow-2xs"
          >
            Close
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Abrasive Row ({curr.sym} {costPerM2.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
