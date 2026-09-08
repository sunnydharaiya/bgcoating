import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Eye,
  X,
  ArrowRight,
  RotateCcw,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

const STANDARD_PHOTO_PRESETS = [
  { title: "Pre-Blast Surface Condition", loc: "Test panel · before blast" },
  { title: "Blasting in Progress", loc: "Operator at work · safety PPE" },
  { title: "Post-Blast Cleanliness (Sa 2½)", loc: "Test panel · after blast" },
  { title: "Surface Profile Measurement", loc: "Replica tape / stylus reading" },
  { title: "Dust Tape Test (ISO 8502-3)", loc: "Adhesive tape contamination" },
  { title: "Abrasive Sample & Batch ID", loc: "Material traceability" }
];

export default function BlasterPhotoReport({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const { photoCount } = metrics;
  const photos = state.photos || [];
  const [lightboxImg, setLightboxImg] = useState(null);

  const handleAddPhoto = (preset) => {
    const nextId = (photos[photos.length - 1]?.id || 0) + 1;
    const newCard = {
      id: nextId,
      title: preset?.title || `Photograph ${nextId}`,
      loc: preset?.loc || '',
      date: new Date().toISOString().split('T')[0],
      init: 'GC',
      cap: preset ? `Reference photograph showing ${preset.title.toLowerCase()} during operator qualification trial.` : '',
      b64: ''
    };
    onChange('photos', [...photos, newCard]);
  };

  const handleAddStandardSet = () => {
    const stdSet = STANDARD_PHOTO_PRESETS.map((preset, i) => ({
      id: i + 1,
      title: preset.title,
      loc: preset.loc,
      date: new Date().toISOString().split('T')[0],
      init: 'GC',
      cap: `Reference photograph showing ${preset.title.toLowerCase()} during operator qualification trial.`,
      b64: ''
    }));
    onChange('photos', stdSet);
  };

  const handleClearPhotos = () => {
    onChange('photos', []);
  };

  const handleRemovePhoto = (id) => {
    onChange('photos', photos.filter(p => p.id !== id));
  };

  const handleCardChange = (id, field, value) => {
    const updated = photos.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange('photos', updated);
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCardChange(id, 'b64', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 05 · Step 5 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Photographic Evidence Report (Annexure B)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual inspection proof · Pre/Post Blast coupons · Surface profile gauges · PPE adherence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddPhoto()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo Card</span>
          </button>

          <button
            onClick={handleAddStandardSet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8700A]" />
            <span>Load 6-Photo Preset</span>
          </button>

          <button
            onClick={() => onNavigate('verdict')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <span>Next: Verdict</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Evidence Summary Status Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8700A]/10 text-[#E8700A]">
              <Camera className="w-4 h-4" />
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Attached Photos: <b className="font-mono text-[#E8700A]">{photoCount} / {photos.length}</b>
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            photoCount >= 3 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            {photoCount >= 3 ? 'EVIDENCE SUFFICIENT ✓' : 'MORE EVIDENCE RECOMMENDED'}
          </span>
        </div>

        {photos.length > 0 && (
          <button
            onClick={handleClearPhotos}
            className="flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All Photos</span>
          </button>
        )}
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <Camera className="w-12 h-12 stroke-1 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Evidence Photographs Attached</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Load 6-Photo Preset" to insert standard qualification inspection photo placeholders or upload custom photos.
          </p>
          <button
            onClick={handleAddStandardSet}
            className="px-4 py-2 rounded-lg bg-[#E8700A] text-white text-xs font-bold shadow-xs hover:bg-[#F5911F] transition cursor-pointer"
          >
            Load Standard 6-Photo Preset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                  <span>📸</span>
                  <span className="truncate">{photo.title || `Photo #${idx + 1}`}</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photo Image Upload Slot */}
              <div className="p-4 space-y-3">
                <div className="relative w-full h-44 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center group">
                  {photo.b64 ? (
                    <>
                      <img
                        src={photo.b64}
                        alt={photo.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImg(photo.b64)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={() => setLightboxImg(photo.b64)}
                          className="p-1.5 rounded-md bg-white/80 text-slate-900 hover:bg-white transition cursor-pointer"
                          title="Zoom Photo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCardChange(photo.id, 'b64', '')}
                          className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 text-center cursor-pointer w-full h-full">
                      <Camera className="w-8 h-8 text-slate-400 stroke-1 mb-1" />
                      <span className="text-xs font-bold text-[#E8700A]">Tap to Upload Photo</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Click or drag JPG / PNG here</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(photo.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Title / Tag</label>
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => handleCardChange(photo.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Location</label>
                      <input
                        type="text"
                        value={photo.loc}
                        onChange={(e) => handleCardChange(photo.id, 'loc', e.target.value)}
                        placeholder="e.g. Bay 4"
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Date</label>
                      <input
                        type="date"
                        value={photo.date}
                        onChange={(e) => handleCardChange(photo.id, 'date', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Caption / Observation</label>
                    <textarea
                      rows={2}
                      value={photo.cap}
                      onChange={(e) => handleCardChange(photo.id, 'cap', e.target.value)}
                      placeholder="Describe what this photo proves..."
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overall Photo Remark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E8700A]" />
          <span>Photographic Report Overall Summary Observation</span>
        </label>
        <textarea
          rows={2}
          value={state.remarkPhoto}
          onChange={(e) => onChange('remarkPhoto', e.target.value)}
          placeholder="Record overall summary remark for Annexure B photo evidence..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A]"
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <img src={lightboxImg} alt="Enlarged Evidence" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onNavigate('verdict')}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <span>Proceed to 06. Verdict &amp; Approval</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
