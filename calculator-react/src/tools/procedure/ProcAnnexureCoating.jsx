import React from 'react';
import { PROC_PAINT_GENERICS } from '../../data/procedureDatabase';

export default function ProcAnnexureCoating({ state, onChange, onNext, onPrev, onReset }) {
  const handleSystemChange = (sIdx, key, val) => {
    const systems = [...(state.coatingSystems || [])];
    systems[sIdx] = { ...systems[sIdx], [key]: val };
    onChange({ coatingSystems: systems });
  };

  const handleCoatChange = (sIdx, cIdx, key, val) => {
    const systems = [...(state.coatingSystems || [])];
    const coats = [...systems[sIdx].coats];
    coats[cIdx] = { ...coats[cIdx], [key]: val };

    // auto-recalculate total nominal DFT
    const totalDft = coats.reduce((sum, c) => sum + (parseFloat(c.dftNom) || 0), 0);
    systems[sIdx] = { ...systems[sIdx], coats, totalDftNom: totalDft };
    onChange({ coatingSystems: systems });
  };

  const addCoat = (sIdx) => {
    const systems = [...(state.coatingSystems || [])];
    const coats = [...systems[sIdx].coats];
    const nextCoatNo = coats.length + 1;
    coats.push({
      coatNo: nextCoatNo,
      genericType: 'Aliphatic Polyurethane Topcoat',
      dftMin: 50,
      dftNom: 60,
      dftMax: 75,
      thinner: 'PU Thinner (max 5%)',
      recoatMin: '8 hrs @ 25°C',
      recoatMax: 'N/A'
    });
    const totalDft = coats.reduce((sum, c) => sum + (parseFloat(c.dftNom) || 0), 0);
    systems[sIdx] = { ...systems[sIdx], coats, totalDftNom: totalDft };
    onChange({ coatingSystems: systems });
  };

  const removeCoat = (sIdx, cIdx) => {
    const systems = [...(state.coatingSystems || [])];
    if (systems[sIdx].coats.length <= 1) return;
    const coats = systems[sIdx].coats.filter((_, i) => i !== cIdx).map((c, i) => ({ ...c, coatNo: i + 1 }));
    const totalDft = coats.reduce((sum, c) => sum + (parseFloat(c.dftNom) || 0), 0);
    systems[sIdx] = { ...systems[sIdx], coats, totalDftNom: totalDft };
    onChange({ coatingSystems: systems });
  };

  const addSystem = () => {
    const nextId = `SYS-${String((state.coatingSystems?.length || 0) + 1).padStart(2, '0')}`;
    const newSystem = {
      systemId: nextId,
      serviceDesc: 'External High Temperature Carbon Steel (Up to 400°C)',
      surfacePrep: 'Abrasive blast to ISO Sa 2½, Profile 40–60 µm',
      substrate: 'Carbon Steel',
      operatingTemp: 'Ambient to 400°C',
      coats: [
        { coatNo: 1, genericType: 'Inorganic Zinc Silicate Primer', dftMin: 60, dftNom: 75, dftMax: 90, thinner: 'Silicate Thinner (max 5%)', recoatMin: '24 hrs', recoatMax: 'N/A' },
        { coatNo: 2, genericType: 'High Temperature Silicone Aluminum', dftMin: 20, dftNom: 25, dftMax: 30, thinner: 'Silicone Thinner (max 5%)', recoatMin: '24 hrs', recoatMax: 'N/A' }
      ],
      totalDftNom: 100
    };
    onChange({ coatingSystems: [...(state.coatingSystems || []), newSystem] });
  };

  const removeSystem = (sIdx) => {
    if ((state.coatingSystems || []).length <= 1) return;
    const updated = (state.coatingSystems || []).filter((_, i) => i !== sIdx);
    onChange({ coatingSystems: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Annexure I</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Coating Systems Schedule (Multi-Coat Build)</h2>
          <p className="text-xs text-gray-500">Engineering schedule defining substrate, surface preparation, multi-layer coating DFTs, thinners, and recoat windows.</p>
        </div>
        <button
          type="button"
          onClick={addSystem}
          className="text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 px-3.5 py-2 rounded-lg shadow transition"
        >
          + Add Coating System
        </button>
      </div>

      {/* Coating Systems List */}
      <div className="space-y-6">
        {(state.coatingSystems || []).map((sys, sIdx) => (
          <div key={sIdx} className="bg-white border-2 border-[#1E2530] rounded-xl overflow-hidden shadow-md">
            {/* System Header Bar */}
            <div className="bg-[#1E2530] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-black text-xs font-bold font-mono px-2 py-0.5 rounded">
                  {sys.systemId}
                </span>
                <input
                  type="text"
                  value={sys.serviceDesc || ''}
                  onChange={(e) => handleSystemChange(sIdx, 'serviceDesc', e.target.value)}
                  placeholder="System Service Description (e.g. Atmospheric Marine C5)"
                  className="bg-transparent border-b border-white/20 focus:border-amber-400 text-xs font-bold text-white focus:outline-none w-80 md:w-96"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-300 font-mono font-bold">
                  Total Nominal DFT: {sys.totalDftNom || 0} µm
                </span>
                <button
                  type="button"
                  onClick={() => removeSystem(sIdx)}
                  className="text-gray-400 hover:text-red-400 text-sm font-bold"
                  title="Delete system"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* System Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Surface Preparation Standard</label>
                  <input
                    type="text"
                    value={sys.surfacePrep || ''}
                    onChange={(e) => handleSystemChange(sIdx, 'surfacePrep', e.target.value)}
                    placeholder="e.g. ISO Sa 2½ (SSPC-SP10), Profile 50-75 µm"
                    className="w-full text-xs p-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Substrate Material</label>
                  <input
                    type="text"
                    value={sys.substrate || 'Carbon Steel'}
                    onChange={(e) => handleSystemChange(sIdx, 'substrate', e.target.value)}
                    placeholder="e.g. Carbon Steel"
                    className="w-full text-xs p-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Operating Temperature Range</label>
                  <input
                    type="text"
                    value={sys.operatingTemp || '-20°C to 120°C'}
                    onChange={(e) => handleSystemChange(sIdx, 'operatingTemp', e.target.value)}
                    placeholder="e.g. -20°C to 120°C"
                    className="w-full text-xs p-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Multi-Coat Build Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Coat Layer Build Breakdown
                  </h4>
                  <button
                    type="button"
                    onClick={() => addCoat(sIdx)}
                    className="text-xs text-red-700 hover:text-red-800 font-bold"
                  >
                    + Add Coat Layer
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-2 px-2 text-center w-12">Coat #</th>
                        <th className="py-2 px-3 text-left">Generic Paint Description *</th>
                        <th className="py-2 px-2 text-center w-20">Min DFT (µm)</th>
                        <th className="py-2 px-2 text-center w-20">Nom DFT (µm)</th>
                        <th className="py-2 px-2 text-center w-20">Max DFT (µm)</th>
                        <th className="py-2 px-3 text-left w-40">Thinner Type</th>
                        <th className="py-2 px-3 text-left w-32">Min Recoat</th>
                        <th className="py-2 px-3 text-left w-32">Max Recoat</th>
                        <th className="py-2 px-2 text-center w-10">Act</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(sys.coats || []).map((coat, cIdx) => (
                        <tr key={cIdx} className="hover:bg-gray-50">
                          <td className="p-2 text-center font-bold text-red-700">{coat.coatNo}</td>
                          <td className="p-2">
                            <select
                              value={coat.genericType}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'genericType', e.target.value)}
                              className="w-full text-xs p-1.5 border border-gray-300 rounded font-semibold text-gray-800 bg-white"
                            >
                              {PROC_PAINT_GENERICS.map((g, i) => (
                                <option key={i} value={g}>{g}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={coat.dftMin}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'dftMin', e.target.value)}
                              className="w-full text-center border border-gray-300 rounded p-1 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={coat.dftNom}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'dftNom', e.target.value)}
                              className="w-full text-center border border-gray-300 rounded p-1 font-mono font-bold text-red-700 bg-red-50/50"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={coat.dftMax}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'dftMax', e.target.value)}
                              className="w-full text-center border border-gray-300 rounded p-1 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={coat.thinner || ''}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'thinner', e.target.value)}
                              placeholder="e.g. Epoxy Thinner"
                              className="w-full border border-gray-300 rounded p-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={coat.recoatMin || ''}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'recoatMin', e.target.value)}
                              placeholder="e.g. 4 hrs @ 25°C"
                              className="w-full border border-gray-300 rounded p-1"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={coat.recoatMax || ''}
                              onChange={(e) => handleCoatChange(sIdx, cIdx, 'recoatMax', e.target.value)}
                              placeholder="e.g. 30 days"
                              className="w-full border border-gray-300 rounded p-1"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeCoat(sIdx, cIdx)}
                              className="text-gray-400 hover:text-red-600 font-bold"
                              title="Delete coat"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('attachments')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Attachments
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={() => onNext('annexure-inspection')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Annexure-II Inspection Matrix →
          </button>
        </div>
      </div>
    </div>
  );
}
