// src/tools/painter/PainterPhotoReport.jsx
import React, { useState, useRef } from 'react';
import { PHOTO_PRESETS } from '../../data/painterDatabase';

export default function PainterPhotoReport({
  formData,
  onChange,
  onSaveDraft,
  onValidateApprove,
  onReset,
  onNavigate
}) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const fileInputRefs = useRef({});
  const photos = formData?._photos || [];

  const handleAddPhoto = (preset = null) => {
    const nextId = photos.length > 0 ? Math.max(...photos.map(p => p.id || 0)) + 1 : 1;
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
    onChange('_photos', []);
  };

  const totalPhotos = photos.length;
  const withImg = photos.filter(p => !!p.b64).length;
  const captionedCount = photos.filter(p => !!p.cap).length;

  return (
    <div className="sheet" id="sh-photo">
      {/* Corporate Header */}
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">PHOTOGRAPHIC EVIDENCE REPORT</div>
          <div className="xl-corp-s">
            Visual documentation of operator qualification activity · field photographs with metadata
          </div>
        </div>
      </div>

      {/* Photo Capture Guidance Box */}
      <div className="remark-box" style={{ borderLeftColor: '#1565C0', marginTop: '12px' }}>
        <div className="remark-l" style={{ color: '#1565C0' }}>📷 Photo Capture Guidance</div>
        <div style={{ fontSize: '11.5px', color: 'var(--txt)', lineHeight: 1.55 }}>
          Add photographs documenting the qualification activity — pre-blast surface, blasting in progress, post-blast cleanliness, profile measurement, dust tape test, abrasive sample, and finished test panel. Each photo supports the inspection findings and creates an auditable trail. Photos are embedded into <b>Annexure-B</b> of the printed report.
        </div>
      </div>

      {/* Compliance Bar */}
      <div className="compl-bar" style={{ marginTop: '14px' }}>
        <div className="compl-item">
          <div className="compl-dot g" />
          <span className="compl-lbl">Photos Added:</span>
          <span className="compl-val" id="photo-count">
            {withImg}{totalPhotos > withImg ? `/${totalPhotos}` : ''}
          </span>
        </div>
        <div className="compl-item">
          <div className="compl-dot y" />
          <span className="compl-lbl">Captioned:</span>
          <span className="compl-val" id="photo-cap-count">{captionedCount}</span>
        </div>
        <div
          className="compl-pct"
          id="photo-status"
          style={{
            color: withImg === 0 ? 'var(--gr)' : withImg < 3 ? 'var(--gy)' : 'var(--gs)'
          }}
        >
          {withImg === 0
            ? 'EVIDENCE PENDING'
            : withImg < 3
            ? 'MORE EVIDENCE RECOMMENDED'
            : 'EVIDENCE SUFFICIENT'}
        </div>
      </div>

      {/* Photo Action Bar */}
      <div className="photo-add-bar">
        <button
          type="button"
          className="btn btn-add"
          onClick={() => handleAddPhoto()}
        >
          ＋ Add Photo Slot
        </button>
        <button
          type="button"
          className="btn btn-save"
          onClick={handleLoadStandardSet}
        >
          ⊞ Add Standard 6-Photo Set
        </button>
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleClearAll}
        >
          ↺ Clear All
        </button>
      </div>

      {/* Photo Row Grid */}
      <div className="photo-row-grid" id="photo-grid">
        {photos.map((photo, idx) => (
          <div className="photo-card" key={photo.id || idx}>
            <div className="photo-card-h">
              <span className="pc-tag">#{idx + 1} PHOTO</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                {photo.title || `Photograph ${idx + 1}`}
              </span>
              <button
                type="button"
                className="photo-card-del"
                onClick={() => handleRemovePhoto(idx)}
                title="Delete photo slot"
              >
                ✕ DELETE
              </button>
            </div>

            <div
              className={`photo-card-slot ${photo.b64 ? 'has-photo' : ''}`}
              onClick={() => {
                if (!photo.b64) {
                  fileInputRefs.current[idx]?.click();
                } else {
                  setLightboxSrc(photo.b64);
                }
              }}
            >
              {photo.b64 ? (
                <>
                  <img src={photo.b64} alt={photo.title || `Photograph ${idx + 1}`} />
                  <button
                    type="button"
                    className="pc-rm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <div className="pc-ic">📷</div>
                  <div className="pc-l">Click or Paste to Upload</div>
                  <div className="pc-s">JPEG / PNG / WEBP · Auto-compressed</div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={(el) => (fileInputRefs.current[idx] = el)}
                onChange={(e) => handleImageUpload(idx, e)}
              />
            </div>

            <div className="photo-card-meta">
              <div className="photo-card-meta-row">
                <div className="pm-lbl">Photo Title</div>
                <input
                  type="text"
                  className="pm-title"
                  placeholder="e.g. Surface Profile Measurement"
                  value={photo.title || ''}
                  onChange={(e) => handlePhotoFieldChange(idx, 'title', e.target.value)}
                />
              </div>
              <div className="photo-card-meta-row">
                <div className="pm-lbl">Location / Area</div>
                <input
                  type="text"
                  className="pm-loc"
                  placeholder="e.g. Test Plate Front"
                  value={photo.loc || ''}
                  onChange={(e) => handlePhotoFieldChange(idx, 'loc', e.target.value)}
                />
              </div>
              <div className="photo-card-meta-row">
                <div className="pm-lbl">Date of Photo</div>
                <input
                  type="date"
                  className="pm-date"
                  value={photo.date || ''}
                  onChange={(e) => handlePhotoFieldChange(idx, 'date', e.target.value)}
                />
              </div>
              <div className="photo-card-meta-row">
                <div className="pm-lbl">Inspector Initial</div>
                <input
                  type="text"
                  className="pm-init"
                  placeholder="e.g. RP"
                  value={photo.init || ''}
                  onChange={(e) => handlePhotoFieldChange(idx, 'init', e.target.value)}
                />
              </div>
              <div className="photo-card-meta-row span-2">
                <div className="pm-lbl">Caption / Technical Observation</div>
                <textarea
                  className="pm-cap"
                  rows={2}
                  placeholder="Describe technical observations, compliance with standards, or surface defect findings..."
                  value={photo.cap || ''}
                  onChange={(e) => handlePhotoFieldChange(idx, 'cap', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remark Box */}
      <div className="remark-box" style={{ marginTop: '14px' }}>
        <div className="remark-l">📝 Photo Report Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-photo"
          rows={3}
          placeholder="Overall photographic evidence remarks, audit trail observations, or client witnessed notes..."
          value={formData?.['f-remark-photo'] || formData?.remarkPhoto || ''}
          onChange={(e) => {
            onChange('f-remark-photo', e.target.value);
            onChange('remarkPhoto', e.target.value);
          }}
        />
      </div>

      {/* Standard Button Row */}
      <div className="btn-row btn-row-std">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidateApprove}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button
          type="button"
          className="btn nx"
          onClick={() => onNavigate && onNavigate('painter', 'verdict')}
        >
          Next: Verdict &amp; Approval →
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxSrc}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-black/50 px-3 py-1 rounded hover:bg-black/80"
              onClick={() => setLightboxSrc(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
