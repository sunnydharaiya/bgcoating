// src/tools/painter/PainterPhotoReport.jsx
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles, 
  Maximize2, 
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PHOTO_PRESETS } from '../../data/painterDatabase';

export default function PainterPhotoReport({
  formData,
  onChange
}) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const photos = formData?._photos || [];

  const handleAddPhoto = (preset = null) => {
    const nextId = photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    const newPhoto = {
      id: nextId,
      b64: '',
      title: preset ? preset.title : `Photograph ${nextId}`,
      loc: preset ? preset.loc : '',
      date: today,
      init: 'RP',
      cap: preset ? `Photographic evidence of ${preset.title.toLowerCase()} captured during qualification trial.` : ''
    };
    onChange('_photos', [...photos, newPhoto]);
  };

  const handlePhotoFieldChange = (index, field, value) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], [field]: value };
    onChange('_photos', updated);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1100;
        if (width > maxDim || height > maxDim) {
          const ratio = width > height ? maxDim / width : maxDim / height;
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const b64 = canvas.toDataURL('image/jpeg', 0.85);

        const updated = [...photos];
        updated[index] = { ...updated[index], b64 };
        onChange('_photos', updated);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange('_photos', updated);
  };

  const handleRemoveImage = (index) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], b64: '' };
    onChange('_photos', updated);
  };

  const handleLoadStandardSet = () => {
    const today = new Date().toISOString().split('T')[0];
    const newPhotos = PHOTO_PRESETS.slice(0, 6).map((preset, idx) => ({
      id: idx + 1,
      b64: '',
      title: preset.title,
      loc: preset.loc,
      date: today,
      init: 'RP',
      cap: `Reference photograph showing ${preset.title.toLowerCase()} during qualification trial.`
    }));
    onChange('_photos', newPhotos);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all photograph evidence cards?')) {
      onChange('_photos', []);
    }
  };

  const attachedCount = photos.filter(p => !!p.b64).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#E87B1E]" />
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Section 08: Photographic Evidence Report (Annexure B)
            </h2>
            <p className="text-xs text-slate-500">
              Visual records of substrate preparation, spray technique, WFT/DFT measurement, and adhesion tests
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            attachedCount >= 3
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}>
            {attachedCount}/{photos.length} Photos Attached
          </span>

          <button
            type="button"
            onClick={handleLoadStandardSet}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Load 6-Photo Standard Set</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddPhoto()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:from-[#F39322] hover:to-[#A50021] transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo Card</span>
          </button>

          {photos.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Clear all photos"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Photo Cards Grid */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center space-y-3">
          <Camera className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 font-rajdhani uppercase tracking-wider">
            No Photographic Evidence Attached
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Load 6-Photo Standard Set" to create preset slots for substrate, mixing, primer, WFT, DFT, and adhesion.
          </p>
          <button
            type="button"
            onClick={handleLoadStandardSet}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#E87B1E] hover:bg-[#F39322] transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Standard 6-Photo Set</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#E87B1E]/60 transition"
            >
              {/* Photo Card Top Bar */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-rajdhani uppercase truncate">
                  Photo #{idx + 1} · {photo.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Image Upload Slot */}
              <div className="p-3">
                <div className="relative aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center group/slot">
                  {photo.b64 ? (
                    <>
                      <img
                        src={photo.b64}
                        alt={photo.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxSrc(photo.b64)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slot:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLightboxSrc(photo.b64)}
                          className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                          title="View Full Size"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full p-4 text-center cursor-pointer hover:bg-amber-50/50 transition">
                      <Camera className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        Tap to Upload Image
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(idx, e)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Photo Metadata Form */}
              <div className="p-3 pt-0 space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Title / Tag
                  </label>
                  <input
                    type="text"
                    value={photo.title || ''}
                    onChange={(e) => handlePhotoFieldChange(idx, 'title', e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:border-[#E87B1E] outline-none"
                    placeholder="e.g. Surface Condition (Pre-Coating)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Location / Bay
                    </label>
                    <input
                      type="text"
                      value={photo.loc || ''}
                      onChange={(e) => handlePhotoFieldChange(idx, 'loc', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:border-[#E87B1E] outline-none"
                      placeholder="e.g. Bay 3 · Test Plate 1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Date Taken
                    </label>
                    <input
                      type="date"
                      value={photo.date || ''}
                      onChange={(e) => handlePhotoFieldChange(idx, 'date', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:border-[#E87B1E] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Inspector Observation / Caption
                  </label>
                  <textarea
                    rows={2}
                    value={photo.cap || ''}
                    onChange={(e) => handlePhotoFieldChange(idx, 'cap', e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:border-[#E87B1E] outline-none resize-none"
                    placeholder="Describe what this photograph illustrates..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxSrc}
              alt="Enlarged preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white transition shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
