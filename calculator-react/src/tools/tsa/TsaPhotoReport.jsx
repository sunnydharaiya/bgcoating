import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Plus, 
  RotateCcw, 
  ZoomIn, 
  Sparkles,
  Calendar,
  MapPin,
  User,
  Info
} from 'lucide-react';
import { TSA_PHOTO_PRESETS } from '../../data/tsaDatabase';

export default function TsaPhotoReport({
  formData,
  onChange
}) {
  const photos = formData?.photos || [];
  const [lightboxImg, setLightboxImg] = useState(null);

  const handleAddPhotoCard = (preset) => {
    const nextId = (photos.length > 0 ? Math.max(...photos.map(p => p.id)) : 0) + 1;
    const newCard = {
      id: nextId,
      title: preset ? preset.title : `Photograph ${nextId}`,
      loc: preset ? preset.loc : '',
      date: new Date().toISOString().split('T')[0],
      init: 'DVR',
      cap: preset ? `Verification photograph recording ${preset.title.toLowerCase()} during TSA qualification.` : '',
      b64: ''
    };
    onChange?.('photos', [...photos, newCard]);
  };

  const handleLoadStandardSet = () => {
    if (window.confirm('Replace photo list with the standard 6-photo TSA qualification evidence set?')) {
      const standard = TSA_PHOTO_PRESETS.map((p, i) => ({
        id: i + 1,
        title: p.title,
        loc: p.loc,
        date: new Date().toISOString().split('T')[0],
        init: 'DVR',
        cap: `Reference photograph showing ${p.title.toLowerCase()} during thermal spray applicator trial.`,
        b64: ''
      }));
      onChange?.('photos', standard);
    }
  };

  const handleUpdateCard = (id, field, value) => {
    const updated = photos.map(p => {
      if (p.id === id) return { ...p, [field]: value };
      return p;
    });
    onChange?.('photos', updated);
  };

  const handleRemoveCard = (id) => {
    const updated = photos.filter(p => p.id !== id);
    onChange?.('photos', updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all photo cards?')) {
      onChange?.('photos', []);
    }
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleUpdateCard(id, 'b64', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#E87B1E]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Photographic Evidence Report (Annexure B)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 07 · Photographic documentation of surface blast, equipment setup, crossing spray passes, bend coupons, and sealer coat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddPhotoCard()}
            className="px-3.5 py-1.5 rounded-xl bg-[#E87B1E] text-white font-bold text-xs shadow-xs hover:bg-[#9E1B1E] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo Card</span>
          </button>
          <button
            type="button"
            onClick={handleLoadStandardSet}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Standard 6-Photo Set</span>
          </button>
          {photos.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Photo Cards Grid */}
      {photos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center">
          <Camera className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Evidence Photographs Added Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Standard 6-Photo Set" to generate pre-filled inspection cards, or add custom photo slots manually.
          </p>
          <button
            type="button"
            onClick={handleLoadStandardSet}
            className="mt-4 px-4 py-2 rounded-xl bg-[#E87B1E] text-white font-bold text-xs hover:bg-[#9E1B1E] transition"
          >
            Load Standard 6-Photo Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((card, idx) => (
            <div
              key={card.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 group hover:border-[#E87B1E]/60 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>Photo #{idx + 1}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({card.init || 'DVR'})</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(card.id)}
                  className="w-6 h-6 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition"
                  title="Remove Photo Card"
                >
                  ✕
                </button>
              </div>

              {/* Photo Image Upload / Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-2 group/img">
                {card.b64 ? (
                  <>
                    <img
                      src={card.b64}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLightboxImg(card.b64)}
                        className="p-2 rounded-xl bg-white/90 text-slate-800 shadow-md hover:bg-white transition"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateCard(card.id, 'b64', '')}
                        className="p-2 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 transition"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <Camera className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
                    <span className="text-[11px] font-bold text-slate-500">Tap to Upload Image</span>
                    <span className="text-[9px] text-slate-400">JPG or PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(card.id, e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Card Form Inputs */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => handleUpdateCard(card.id, 'title', e.target.value)}
                    placeholder="e.g. Bend Test 180° Mandrel Inspection"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#E87B1E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Location / Spot
                    </label>
                    <input
                      type="text"
                      value={card.loc || ''}
                      onChange={(e) => handleUpdateCard(card.id, 'loc', e.target.value)}
                      placeholder="e.g. Test Plate #1"
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#E87B1E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Date Taken
                    </label>
                    <input
                      type="date"
                      value={card.date || ''}
                      onChange={(e) => handleUpdateCard(card.id, 'date', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#E87B1E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Caption / Observed Detail
                  </label>
                  <textarea
                    rows={2}
                    value={card.cap || ''}
                    onChange={(e) => handleUpdateCard(card.id, 'cap', e.target.value)}
                    placeholder="Describe specific visual finding, defect-free appearance, or measured value..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#E87B1E]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Photographic Remarks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          General Photographic Report Summary & Notes
        </label>
        <textarea
          rows={3}
          value={formData?.['f-remark-photo'] || ''}
          onChange={(e) => onChange?.('f-remark-photo', e.target.value)}
          placeholder="Comprehensive evidence summary stating that all critical stages from surface prep to final silicone sealer curing were photographically captured..."
          className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs focus:border-[#E87B1E] outline-none leading-relaxed"
        />
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black">
            <img
              src={lightboxImg}
              alt="Zoomed Preview"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-md hover:bg-white/40 transition"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
