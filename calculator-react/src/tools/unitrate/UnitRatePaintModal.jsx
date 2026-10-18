import React, { useState } from 'react';
import { X, Calculator, Scale, Sparkles, Check } from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRatePaintModal({ 
  isOpen, 
  onClose, 
  currency = 'INR',
  onApplyRate 
}) {
  const [vs, setVs] = useState(65);
  const [dft, setDft] = useState(75);
  const [loss, setLoss] = useState(30);
  const [price, setPrice] = useState(450);
  const [thinnerPct, setThinnerPct] = useState(5);
  const [thinnerPrice, setThinnerPrice] = useState(180);

  if (!isOpen) return null;

  const curr = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;

  // Formulas:
  // TC = (VS * 10) / DFT  (m²/L)
  // PS = TC * (1 - Loss / 100)  (m²/L)
  // Paint Qty = 1 / PS (L/m²)
  // Thinner Qty = Paint Qty * (ThinnerPct / 100) (L/m²)
  // Total Cost / m² = (PaintQty * Price) + (ThinnerQty * ThinnerPrice)

  const numVs = parseFloat(vs) || 0;
  const numDft = parseFloat(dft) || 1;
  const numLoss = parseFloat(loss) || 0;
  const numPrice = parseFloat(price) || 0;
  const numThinPct = parseFloat(thinnerPct) || 0;
  const numThinPrice = parseFloat(thinnerPrice) || 0;

  const tc = numVs > 0 && numDft > 0 ? (numVs * 10) / numDft : 0;
  const ps = tc * (1 - numLoss / 100);
  const paintQty = ps > 0 ? 1 / ps : 0;
  const thinnerQty = paintQty * (numThinPct / 100);
  const paintCostM2 = paintQty * numPrice;
  const thinnerCostM2 = thinnerQty * numThinPrice;
  const totalCostM2 = paintCostM2 + thinnerCostM2;

  const handleApply = () => {
    if (onApplyRate && totalCostM2 > 0) {
      onApplyRate(Math.round(totalCostM2 * 100) / 100);
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
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Paint Spread Rate &amp; Cost / m² Helper</h3>
              <p className="text-xs text-slate-500">Calculates theoretical, practical coverage &amp; material cost per m².</p>
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
              <label className="text-xs font-semibold text-slate-700">Volume Solids (%)</label>
              <input
                type="number"
                value={vs}
                onChange={(e) => setVs(e.target.value)}
                placeholder="65"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Specified DFT (µm)</label>
              <input
                type="number"
                value={dft}
                onChange={(e) => setDft(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Application Loss (%)</label>
              <input
                type="number"
                value={loss}
                onChange={(e) => setLoss(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Paint Price ({curr.sym} / L)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Thinner Addition (%)</label>
              <input
                type="number"
                value={thinnerPct}
                onChange={(e) => setThinnerPct(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Thinner Price ({curr.sym} / L)</label>
              <input
                type="number"
                value={thinnerPrice}
                onChange={(e) => setThinnerPrice(e.target.value)}
                placeholder="180"
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Results Take-off Box */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Theoretical Coverage (TC):</span>
              <span className="font-mono font-bold text-slate-800">{tc.toFixed(2)} m² / Litre</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Practical Coverage (PS):</span>
              <span className="font-mono font-bold text-orange-600">{ps.toFixed(2)} m² / Litre</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Paint Requirement:</span>
              <span className="font-mono font-bold text-slate-700">{paintQty.toFixed(3)} L / m²</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2">
              <span className="text-slate-500">Thinner Requirement:</span>
              <span className="font-mono font-bold text-slate-700">{thinnerQty.toFixed(3)} L / m²</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-slate-800 uppercase">Calculated Unit Cost / m²:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-600">
                {curr.sym} {totalCostM2.toFixed(2)}
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
            <span>Copy &amp; Apply Rate ({curr.sym} {totalCostM2.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
