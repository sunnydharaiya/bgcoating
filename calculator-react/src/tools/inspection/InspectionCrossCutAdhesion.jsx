// src/tools/inspection/InspectionCrossCutAdhesion.jsx
import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Camera, 
  Eye, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// ASTM D3359 / ISO 2409 Classification Data
const CROSS_CUT_CLASSES = [
  { rating: '5B (ISO Class 0)', pct: '0% Flaking', desc: 'The edges of the cuts are completely smooth; none of the squares of the lattice is detached.', color: 'emerald' },
  { rating: '4B (ISO Class 1)', pct: '< 5% Flaking', desc: 'Small flakes of the coating are detached at intersections; less than 5% of area affected.', color: 'emerald' },
  { rating: '3B (ISO Class 2)', pct: '5 – 15% Flaking', desc: 'Small flakes of the coating are detached along edges and intersections; 5% to 15% affected.', color: 'amber' },
  { rating: '2B (ISO Class 3)', pct: '15 – 35% Flaking', desc: 'The coating has flaked along the edges and on parts of the squares; 15% to 35% affected.', color: 'orange' },
  { rating: '1B (ISO Class 4)', pct: '35 – 65% Flaking', desc: 'The coating has flaked along the edges in large ribbons and whole squares detached; 35% to 65%.', color: 'red' },
  { rating: '0B (ISO Class 5)', pct: '> 65% Flaking', desc: 'Any degree of flaking that cannot even be classified by classification 1B; greater than 65%.', color: 'red' }
];

export default function InspectionCrossCutAdhesion({
  crossCutData = {},
  onUpdateCrossCut
}) {
  const { addToast } = useToast();
  const [lightboxImg, setLightboxImg] = useState(null);

  const cuts = crossCutData.cuts || [];
  const specifiedMinRating = crossCutData.specifiedMinRating || '4B (ISO Class 1)';

  const updateFields = (patch) => {
    onUpdateCrossCut({ ...crossCutData, ...patch });
  };

  const handleAddCut = () => {
    const next = [
      ...cuts,
      {
        id: `cc_${Date.now()}`,
        loc: `Lattice Cut #${cuts.length + 1}`,
        rating: '5B (ISO Class 0)',
        flakingPct: 0,
        desc: CROSS_CUT_CLASSES[0].desc,
        verdict: 'PASS'
      }
    ];
    updateFields({ cuts: next });
  };

  const handleUpdateCut = (idx, field, val) => {
    const next = [...cuts];
    next[idx] = { ...next[idx], [field]: val };

    if (field === 'rating') {
      const cls = CROSS_CUT_CLASSES.find(c => c.rating === val);
      if (cls) {
        next[idx].desc = cls.desc;
        // Check if 5B or 4B
        const isPass = val.startsWith('5B') || val.startsWith('4B');
        next[idx].verdict = isPass ? 'PASS' : 'FAIL';
      }
    }

    updateFields({ cuts: next });
  };

  const handleDeleteCut = (idx) => {
    const next = cuts.filter((_, i) => i !== idx);
    updateFields({ cuts: next });
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
        const nextPhotos = [...(crossCutData.photos || [])];
        nextPhotos.push({
          id: `ph_cross_${Date.now()}`,
          url: event.target.result,
          name: file.name
        });
        updateFields({ photos: nextPhotos });
        addToast('Cross-Cut Photo Added', `${file.name} uploaded successfully.`, 'success');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId) => {
    const nextPhotos = (crossCutData.photos || []).filter(p => p.id !== photoId);
    updateFields({ photos: nextPhotos });
  };

  const isOverallPass = cuts.length > 0 && cuts.every(c => c.verdict === 'PASS');

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-200 text-[11px] font-mono font-bold uppercase">
              ASTM D3359 Method B / ISO 2409
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Cross-Cut Tape Lattice Adhesion Test Report
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-hatch lattice tape test for coatings $\le 125\mu m$ or multi-coat adhesion screening per ASTM D3359 Class 0B–5B and ISO 2409 Class 0–5.
          </p>
        </div>

        <button
          onClick={handleAddCut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Lattice Cut Test
        </button>
      </div>

      {/* 2. Apparatus Parameters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-violet-600" />
          Test Apparatus &amp; Lattice Geometry Setup
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Cutter Tool Type
            </label>
            <input
              type="text"
              value={crossCutData.cutterType || ''}
              onChange={(e) => updateFields({ cutterType: e.target.value })}
              placeholder="e.g. Cross-Hatch Multi-Blade (6-Blades)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-violet-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Blade Cut Spacing
            </label>
            <select
              value={crossCutData.bladeSpacingMm || '2.0'}
              onChange={(e) => updateFields({ bladeSpacingMm: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-violet-500 bg-slate-50/50 font-semibold"
            >
              <option value="1.0">1.0 mm (DFT &le; 50 µm / Thin Films)</option>
              <option value="2.0">2.0 mm (DFT 50 – 125 µm / Standard)</option>
              <option value="3.0">3.0 mm (DFT 125 – 250 µm / Thick Films)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Pressure-Sensitive Tape Type
            </label>
            <input
              type="text"
              value={crossCutData.tapeType || ''}
              onChange={(e) => updateFields({ tapeType: e.target.value })}
              placeholder="e.g. Permacel 99 / Tesa 4651 Tape"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-violet-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Minimum Required Acceptance Rating
            </label>
            <select
              value={crossCutData.specifiedMinRating || '4B (ISO Class 1)'}
              onChange={(e) => updateFields({ specifiedMinRating: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-violet-500 bg-slate-50/50 font-bold text-emerald-800"
            >
              <option value="5B (ISO Class 0)">5B (ISO Class 0) — 0% Flaking</option>
              <option value="4B (ISO Class 1)">4B (ISO Class 1) — &lt; 5% Flaking</option>
              <option value="3B (ISO Class 2)">3B (ISO Class 2) — 5–15% Flaking</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Classification Visual Guide Cards */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              ASTM D3359 Method B / ISO 2409 Visual Classification Standard
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Reference Scale</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {CROSS_CUT_CLASSES.map((cls, i) => (
            <div 
              key={i}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between ${
                i <= 1 
                  ? 'bg-emerald-950/40 border-emerald-500/40' 
                  : i <= 2 
                  ? 'bg-amber-950/40 border-amber-500/40' 
                  : 'bg-red-950/40 border-red-500/40'
              }`}
            >
              <div>
                <div className="font-mono font-black text-sm text-white">{cls.rating.split(' ')[0]}</div>
                <div className="text-[10px] font-mono text-slate-300">{cls.rating.split('(')[1].replace(')', '')}</div>
                <div className="text-[11px] font-bold text-amber-400 mt-1">{cls.pct}</div>
              </div>
              <p className="text-[9.5px] text-slate-300 mt-2 leading-tight line-clamp-3">
                {cls.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Lattice Cut Recordings Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-600" />
            Lattice Cut Test Recordings &amp; Adhesion Ratings
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {cuts.length} Tests Recorded
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">Test #</th>
                <th className="py-2.5 px-3 w-48">Location / Component</th>
                <th className="py-2.5 px-3 w-48 text-center">Adhesion Rating</th>
                <th className="py-2.5 px-3">Visual Lattice Description</th>
                <th className="py-2.5 px-3 w-28 text-center">Result</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {cuts.map((c, idx) => (
                <tr key={c.id || idx} className="hover:bg-slate-50/80">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                    #{idx + 1}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={c.loc}
                      onChange={(e) => handleUpdateCut(idx, 'loc', e.target.value)}
                      placeholder="Location description"
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-violet-500 font-medium"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <select
                      value={c.rating}
                      onChange={(e) => handleUpdateCut(idx, 'rating', e.target.value)}
                      className="w-full px-2 py-1 rounded text-xs font-bold border border-slate-200 focus:border-violet-500 font-mono"
                    >
                      {CROSS_CUT_CLASSES.map((cls, i) => (
                        <option key={i} value={cls.rating}>{cls.rating} ({cls.pct})</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={c.desc}
                      onChange={(e) => handleUpdateCut(idx, 'desc', e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 text-slate-600"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <select
                      value={c.verdict || 'PASS'}
                      onChange={(e) => handleUpdateCut(idx, 'verdict', e.target.value)}
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                        c.verdict === 'PASS' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleDeleteCut(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete cut"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Photo Evidence Strip */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-violet-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Cross-Cut Lattice Grid Photographic Evidence
            </h3>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition">
            <UploadCloud className="w-3.5 h-3.5" />
            Attach Lattice Photos
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
          {(crossCutData.photos || []).map((ph) => (
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
          {(crossCutData.photos || []).length === 0 && (
            <div className="col-span-full py-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
              No cross-cut lattice photos attached. Click "Attach Lattice Photos" to add macro visual evidence.
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
            <img src={lightboxImg} alt="Cross-Cut Lattice Zoom" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
