// src/tools/inspection/InspectionMasterList.jsx
import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { INDUSTRY_PRESETS, SELECT_OPTIONS } from '../../data/inspectionDatabase';
import { useToast } from '../../context/ToastContext';

export default function InspectionMasterList({ onApplyPreset }) {
  const { addToast } = useToast();

  const [customSystems, setCustomSystems] = useState([
    {
      id: 'SYS-01',
      name: 'Offshore Marine CX Heavy Duty 3-Coat System',
      env: 'ISO 12944 CX / Offshore Marine',
      totalNdft: 320,
      coats: [
        { stage: 'Primer', generic: 'Zinc Rich Epoxy', brand: 'Barrier 80 (Jotun)', minDft: 60, maxDft: 80, shade: 'Grey' },
        { stage: '1st Inter', generic: 'Epoxy MIO High Build', brand: 'Penguard MIO (Jotun)', minDft: 140, maxDft: 180, shade: 'MIO Grey' },
        { stage: 'Topcoat', generic: 'Aliphatic Acrylic Polyurethane', brand: 'Hardtop AX (Jotun)', minDft: 50, maxDft: 70, shade: 'RAL 9010 White' }
      ]
    },
    {
      id: 'SYS-02',
      name: 'Crude Oil Storage Tank Internal Lining (2-Coat)',
      env: 'NACE SP0198 / Immersion',
      totalNdft: 300,
      coats: [
        { stage: '1st Coat', generic: 'Epoxy Novolac Tank Lining', brand: 'Interline 850 (AkzoNobel)', minDft: 125, maxDft: 175, shade: 'Light Grey' },
        { stage: '2nd Coat', generic: 'Epoxy Novolac Tank Lining', brand: 'Interline 850 (AkzoNobel)', minDft: 125, maxDft: 175, shade: 'White' }
      ]
    },
    {
      id: 'SYS-03',
      name: 'Industrial Plant Structural Steel C4 (3-Coat)',
      env: 'ISO 12944 C4 Industrial',
      totalNdft: 275,
      coats: [
        { stage: 'Primer', generic: 'Inorganic Zinc Silicate', brand: 'Apcodur Zinc Silicate (Asian Paints)', minDft: 65, maxDft: 75, shade: 'Grey' },
        { stage: '1st Inter', generic: 'Epoxy MIO High Build', brand: 'Apcodur MIO (Asian Paints)', minDft: 125, maxDft: 160, shade: 'Dark Grey' },
        { stage: 'Topcoat', generic: 'Aliphatic Polyurethane', brand: 'Apcocthane PU (Asian Paints)', minDft: 45, maxDft: 60, shade: 'RAL 5015 Blue' }
      ]
    }
  ]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono font-bold uppercase">
              Specification Master (PRO)
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Master Paint Systems &amp; Multi-Coat DFT Build-Up Library
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-configured industrial coating specifications, layer-by-layer thickness build-up guidelines, and TDS validation matrices.
          </p>
        </div>
      </div>

      {/* Coating Systems Grid */}
      <div className="space-y-4">
        {customSystems.map((sys) => (
          <div key={sys.id} className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-xs">
                    {sys.id}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">{sys.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Environment: {sys.env}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                  Total NDFT: {sys.totalNdft} µm
                </span>
              </div>
            </div>

            {/* Coats Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead className="bg-slate-900 text-white font-mono text-[10.5px] uppercase">
                  <tr>
                    <th className="py-2 px-3 w-28">Layer Stage</th>
                    <th className="py-2 px-3 w-56">Generic Paint Chemistry</th>
                    <th className="py-2 px-3">Product Name &amp; TDS Reference</th>
                    <th className="py-2 px-3 w-32 text-center">Specified DFT (µm)</th>
                    <th className="py-2 px-3 w-36">Standard Shade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sys.coats.map((coat, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800 bg-slate-50/50">
                        {coat.stage}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {coat.generic}
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {coat.brand}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                        {coat.minDft} – {coat.maxDft} µm
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {coat.shade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
