// src/tools/inspection/InspectionPullOffAdhesion.jsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Camera, 
  Eye, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  Layers,
  FileCheck2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function InspectionPullOffAdhesion({
  pullOffData = {},
  onUpdatePullOff
}) {
  const { addToast } = useToast();
  const [lightboxImg, setLightboxImg] = useState(null);

  const dollies = pullOffData.dollies || [];
  const specifiedTargetMpa = parseFloat(pullOffData.specifiedTargetMpa) || 8.0;

  const updateFields = (patch) => {
    onUpdatePullOff({ ...pullOffData, ...patch });
  };

  const handleAddDolly = () => {
    const next = [
      ...dollies,
      {
        id: `d_${Date.now()}`,
        loc: `Test Location #${dollies.length + 1}`,
        pressureMpa: '',
        mode: '100% Cohesive within Primer A',
        gluePct: 0,
        verdict: 'PASS'
      }
    ];
    updateFields({ dollies: next });
  };

  const handleUpdateDolly = (idx, field, val) => {
    const next = [...dollies];
    next[idx] = { ...next[idx], [field]: val };
    
    // Auto calculate verdict if pressure changed
    if (field === 'pressureMpa') {
      const p = parseFloat(val);
      if (!isNaN(p) && p > 0) {
        next[idx].verdict = p >= specifiedTargetMpa ? 'PASS' : 'FAIL';
      }
    }

    updateFields({ dollies: next });
  };

  const handleDeleteDolly = (idx) => {
    const next = dollies.filter((_, i) => i !== idx);
    updateFields({ dollies: next });
  };

  // Photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      if (file.size > 3 * 1024 * 1024) {
        addToast('File Too Large', 'Please select images under 3MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const nextPhotos = [...(pullOffData.photos || [])];
        nextPhotos.push({
          id: `ph_pull_${Date.now()}`,
          url: event.target.result,
          name: file.name
        });
        updateFields({ photos: nextPhotos });
        addToast('Adhesion Photo Added', `${file.name} uploaded successfully.`, 'success');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId) => {
    const nextPhotos = (pullOffData.photos || []).filter(p => p.id !== photoId);
    updateFields({ photos: nextPhotos });
  };

  // Calculations
  const validPressures = dollies
    .map(d => parseFloat(d.pressureMpa))
    .filter(p => !isNaN(p) && p > 0);

  const meanMpa = validPressures.length > 0
    ? validPressures.reduce((a, b) => a + b, 0) / validPressures.length
    : 0;

  const meanPsi = meanMpa * 145.038;
  const minMpa = validPressures.length > 0 ? Math.min(...validPressures) : 0;
  const maxMpa = validPressures.length > 0 ? Math.max(...validPressures) : 0;

  const isOverallPass = meanMpa >= specifiedTargetMpa;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold uppercase">
              ASTM D4541 / ISO 4624
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Hydraulic Pull-Off Adhesion Strength Test Report
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Measure tensile bond strength (MPa &amp; psi), identify multi-coat failure modes (% cohesive / adhesive), and verify compliance against specification thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Mean Tensile Strength</span>
            <span className={`text-base font-black font-mono ${isOverallPass ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatNum(meanMpa, 1)} MPa ({formatNum(meanPsi, 0)} psi)
            </span>
          </div>
          <button
            onClick={handleAddDolly}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Dolly Record
          </button>
        </div>
      </div>

      {/* 2. Equipment & Test Parameters Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Test Apparatus &amp; Experimental Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Adhesion Tester Model (Type IV / V)
            </label>
            <input
              type="text"
              value={pullOffData.gaugeModel || ''}
              onChange={(e) => updateFields({ gaugeModel: e.target.value })}
              placeholder="e.g. DeFelsko PosiTest AT-A (Hydraulic)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Dolly Size Diameter
            </label>
            <select
              value={pullOffData.dollySizeMm || '20'}
              onChange={(e) => updateFields({ dollySizeMm: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50 font-semibold"
            >
              <option value="20">20 mm (Standard Steel / High Strength)</option>
              <option value="50">50 mm (Concrete / Lower Strength / High Build)</option>
              <option value="14.2">14.2 mm (Ultra-High Strength &gt; 25 MPa)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Specified Requirement ($MPa$)
            </label>
            <input
              type="number"
              step="0.5"
              value={pullOffData.specifiedTargetMpa || ''}
              onChange={(e) => updateFields({ specifiedTargetMpa: e.target.value })}
              placeholder="e.g. 8.0"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Adhesive / Glue Formulation
            </label>
            <input
              type="text"
              value={pullOffData.glueType || ''}
              onChange={(e) => updateFields({ glueType: e.target.value })}
              placeholder="e.g. Araldite 2011 2-Part Epoxy"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Adhesive Cure Time (Hours)
            </label>
            <input
              type="text"
              value={pullOffData.cureTimeHrs || ''}
              onChange={(e) => updateFields({ cureTimeHrs: e.target.value })}
              placeholder="e.g. 24 Hours @ 25°C"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Substrate Material &amp; Thickness
            </label>
            <input
              type="text"
              value={pullOffData.substrateMoc || ''}
              onChange={(e) => updateFields({ substrateMoc: e.target.value })}
              placeholder="e.g. Carbon Steel SA 516 Gr.70 (12 mm)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* 3. Dolly Measurement Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Dolly Pull-Off Tensile Readings &amp; Failure Mode Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ASTM D4541 / ISO 4624
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">Dolly #</th>
                <th className="py-2.5 px-3 w-48">Location / Component</th>
                <th className="py-2.5 px-3 w-32 text-center">Tensile (MPa)</th>
                <th className="py-2.5 px-3 w-28 text-center">Tensile (psi)</th>
                <th className="py-2.5 px-3">Nature of Failure Mode (%)</th>
                <th className="py-2.5 px-3 w-24 text-center">Glue %</th>
                <th className="py-2.5 px-3 w-24 text-center">Result</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {dollies.map((d, idx) => {
                const mpa = parseFloat(d.pressureMpa) || 0;
                const psi = mpa * 145.038;
                const isPass = mpa >= specifiedTargetMpa;

                return (
                  <tr key={d.id || idx} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                      #{idx + 1}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={d.loc}
                        onChange={(e) => handleUpdateDolly(idx, 'loc', e.target.value)}
                        placeholder="Location description"
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-emerald-500 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        value={d.pressureMpa}
                        onChange={(e) => handleUpdateDolly(idx, 'pressureMpa', e.target.value)}
                        placeholder="11.5"
                        className="w-24 px-2 py-1 text-center font-mono font-bold text-xs rounded border border-slate-200 focus:border-emerald-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-600 font-semibold">
                      {mpa > 0 ? `${formatNum(psi, 0)} psi` : '—'}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={d.mode}
                        onChange={(e) => handleUpdateDolly(idx, 'mode', e.target.value)}
                        placeholder="e.g. 100% Cohesive Primer A"
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-emerald-500 font-mono text-slate-700"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={d.gluePct}
                        onChange={(e) => handleUpdateDolly(idx, 'gluePct', e.target.value)}
                        placeholder="0"
                        className="w-16 px-1 py-1 text-center font-mono text-xs rounded border border-slate-200 focus:border-emerald-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      {mpa > 0 ? (
                        isPass ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                            PASS
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10.5px] font-bold">
                            FAIL
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteDolly(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete dolly"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Statistical Summary & Compliance Conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Statistics Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            Adhesion Statistical Summary
          </h4>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Arithmetic Mean</span>
              <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
                {formatNum(meanMpa, 1)} <span className="text-xs font-normal">MPa</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">({formatNum(meanPsi, 0)} psi)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Specified Target</span>
              <div className="text-xl font-black font-mono text-emerald-700 mt-0.5">
                ≥ {formatNum(specifiedTargetMpa, 1)} <span className="text-xs font-normal">MPa</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Specification Minimum</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Min Spot Pull</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                {formatNum(minMpa, 1)} MPa
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Max Spot Pull</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                {formatNum(maxMpa, 1)} MPa
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
              Formal Inspection Conclusion
            </h4>

            <div className={`p-4 rounded-2xl border ${
              isOverallPass 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : 'bg-red-50/70 border-red-200 text-red-950'
            }`}>
              <div className="flex items-center gap-2">
                {isOverallPass ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-extrabold">
                  {isOverallPass ? 'COMPLIANT WITH SPECIFICATION' : 'NON-COMPLIANT ADHESION RESULT'}
                </span>
              </div>
              <p className="text-xs mt-1.5 text-slate-700 leading-relaxed">
                {isOverallPass
                  ? `Average tensile pull-off strength of ${formatNum(meanMpa, 1)} MPa satisfies the project specification requirement (≥ ${specifiedTargetMpa} MPa). Cohesive fracture within primer confirms robust inter-coat bonding.`
                  : `Average tensile strength of ${formatNum(meanMpa, 1)} MPa falls below the minimum required threshold of ${specifiedTargetMpa} MPa. Area requires non-conformance review.`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>ASTM D4541 Annex A4 Standard</span>
            <span>Recorded Dollies: {dollies.length}</span>
          </div>
        </div>

      </div>

      {/* 5. Dolly Fracture Photo Evidence Strip */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Dolly Fracture Face Photographic Evidence
            </h3>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition">
            <UploadCloud className="w-3.5 h-3.5" />
            Attach Dolly Photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {(pullOffData.photos || []).map((ph) => (
            <div key={ph.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square">
              <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setLightboxImg(ph.url)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition"
                  title="Enlarge"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemovePhoto(ph.id)}
                  className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {(pullOffData.photos || []).length === 0 && (
            <div className="col-span-full py-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
              No dolly fracture face photos attached. Click "Attach Dolly Photos" to add fracture evidence.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={lightboxImg} alt="Dolly Face Zoom" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
