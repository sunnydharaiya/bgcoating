// src/tools/inspection/InspectionPhotoReport.jsx
import React, { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Eye, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Image as ImageIcon,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function InspectionPhotoReport({
  photoReport = [],
  onUpdatePhotoReport
}) {
  const { addToast } = useToast();
  const [lightboxImg, setLightboxImg] = useState(null);

  // Add custom photo test row
  const handleAddRow = () => {
    const next = [
      ...photoReport,
      {
        id: `ph_custom_${Date.now()}`,
        testName: 'Custom Visual Inspection',
        stdRef: 'Project Specification / ISO Standard',
        photos: [],
        comments: '',
        verdict: 'PASS'
      }
    ];
    onUpdatePhotoReport(next);
  };

  const handleUpdateRow = (idx, field, val) => {
    const next = [...photoReport];
    next[idx] = { ...next[idx], [field]: val };
    onUpdatePhotoReport(next);
  };

  const handleDeleteRow = (idx) => {
    const next = photoReport.filter((_, i) => i !== idx);
    onUpdatePhotoReport(next);
  };

  // Upload image to specific slot in test row
  const handleSlotUpload = (e, rowIdx, slotIdx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      addToast('File Too Large', 'Please select images under 3MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const next = [...photoReport];
      const photos = [...(next[rowIdx].photos || [])];
      photos[slotIdx] = {
        id: `img_${Date.now()}_${slotIdx}`,
        url: event.target.result,
        name: file.name,
        sizeKb: Math.round(file.size / 1024)
      };
      next[rowIdx] = { ...next[rowIdx], photos };
      onUpdatePhotoReport(next);
      addToast('Photo Uploaded', `Slot ${slotIdx + 1} updated with ${file.name}.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlotPhoto = (rowIdx, slotIdx) => {
    const next = [...photoReport];
    const photos = [...(next[rowIdx].photos || [])];
    photos[slotIdx] = null;
    next[rowIdx] = { ...next[rowIdx], photos };
    onUpdatePhotoReport(next);
  };

  // Count total photos
  let totalPhotos = 0;
  photoReport.forEach(row => {
    (row.photos || []).forEach(p => {
      if (p && p.url) totalPhotos++;
    });
  });

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-mono font-bold uppercase">
              Visual QC Dossier
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              5-Column Photographic Evidence Grid
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach multi-angle high-resolution photographic evidence for each inspection milestone. All images are embedded into the client export dossier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Attached Photos</span>
            <span className="text-sm font-black font-mono text-sky-600">{totalPhotos} Images</span>
          </div>
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Inspection Test Row
          </button>
        </div>
      </div>

      {/* Photo Table Grid */}
      <div className="space-y-4">
        {photoReport.map((row, rowIdx) => {
          const photos = row.photos || [];

          return (
            <div 
              key={row.id || rowIdx}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 shadow-xs transition-all space-y-4"
            >
              {/* Row Header: Test Name & Verdict */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">
                      Test Parameter / Stage Item
                    </label>
                    <input
                      type="text"
                      value={row.testName}
                      onChange={(e) => handleUpdateRow(rowIdx, 'testName', e.target.value)}
                      placeholder="e.g. Visual Surface Cleanliness"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 font-bold text-slate-800 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">
                      Standard Reference
                    </label>
                    <input
                      type="text"
                      value={row.stdRef}
                      onChange={(e) => handleUpdateRow(rowIdx, 'stdRef', e.target.value)}
                      placeholder="e.g. ISO 8501-1 (Sa 2½)"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 font-mono text-slate-600 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={row.verdict || 'PASS'}
                    onChange={(e) => handleUpdateRow(rowIdx, 'verdict', e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      row.verdict === 'PASS'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : row.verdict === 'FAIL'
                        ? 'bg-red-50 text-red-800 border-red-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="PENDING">PENDING</option>
                    <option value="NA">N/A</option>
                  </select>

                  <button
                    onClick={() => handleDeleteRow(rowIdx)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Photo Slots */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2 flex items-center justify-between">
                  <span>Photo Evidence Slots (5 Slots)</span>
                  <span className="text-slate-400 font-normal">Click slot to upload / view</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, slotIdx) => {
                    const photo = photos[slotIdx];

                    return (
                      <div 
                        key={slotIdx}
                        className="relative aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/60 overflow-hidden flex flex-col items-center justify-center group transition"
                      >
                        {photo && photo.url ? (
                          <>
                            <img 
                              src={photo.url} 
                              alt={`Slot ${slotIdx + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => setLightboxImg(photo.url)}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition"
                                title="Zoom"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRemoveSlotPhoto(rowIdx, slotIdx)}
                                className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-mono">
                              Slot #{slotIdx + 1}
                            </span>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center p-2 cursor-pointer text-slate-400 hover:text-sky-600 transition">
                            <UploadCloud className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono font-semibold">Slot #{slotIdx + 1}</span>
                            <span className="text-[9px] text-slate-400">Click to upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlotUpload(e, rowIdx, slotIdx)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments & Observations */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                  Comments &amp; Visual Observations
                </label>
                <textarea
                  rows={2}
                  value={row.comments || ''}
                  onChange={(e) => handleUpdateRow(rowIdx, 'comments', e.target.value)}
                  placeholder="e.g. Surface profile and cleanliness verified prior to application. Zero flash rust or oil contamination observed."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 bg-slate-50/50"
                />
              </div>
            </div>
          );
        })}
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
            <img src={lightboxImg} alt="Enlarged Inspection Preview" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
