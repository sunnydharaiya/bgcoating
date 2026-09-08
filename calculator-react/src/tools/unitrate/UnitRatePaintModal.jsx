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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Paint Spread Rate &amp; Cost / m² Helper</h3>
              <p className="text-xs text-slate-400">Calculates theoretical, practical coverage &amp; material cost per m².</p>
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
              <label className="text-xs font-semibold text-slate-300">Volume Solids (%)</label>
              <input
                type="number"
                value={vs}
                onChange={(e) => setVs(e.target.value)}
                placeholder="65"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Specified DFT (µm)</label>
              <input
                type="number"
                value={dft}
                onChange={(e) => setDft(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Application Loss (%)</label>
              <input
                type="number"
                value={loss}
                onChange={(e) => setLoss(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Paint Price ({curr.sym} / L)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Thinner Addition (%)</label>
              <input
                type="number"
                value={thinnerPct}
                onChange={(e) => setThinnerPct(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Thinner Price ({curr.sym} / L)</label>
              <input
                type="number"
                value={thinnerPrice}
                onChange={(e) => setThinnerPrice(e.target.value)}
                placeholder="180"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Results Take-off Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Theoretical Coverage (TC):</span>
              <span className="font-mono font-bold text-white">{tc.toFixed(2)} m² / Litre</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Practical Coverage (PS):</span>
              <span className="font-mono font-bold text-amber-400">{ps.toFixed(2)} m² / Litre</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Paint Requirement:</span>
              <span className="font-mono font-bold text-slate-300">{paintQty.toFixed(3)} L / m²</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Thinner Requirement:</span>
              <span className="font-mono font-bold text-slate-300">{thinnerQty.toFixed(3)} L / m²</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-white uppercase">Calculated Unit Cost / m²:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                {curr.sym} {totalCostM2.toFixed(2)}
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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
          >
            <Check className="w-4 h-4" />
            <span>Copy &amp; Apply Rate ({curr.sym} {totalCostM2.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
