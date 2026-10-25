import React, { useRef } from 'react';

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
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const photos = state.photos || [];
  const photoCount = photos.filter(p => !!p.b64).length;
  const captionedCount = photos.filter(p => !!(p.cap && p.cap.trim())).length;

  const handleAddPhotoCard = (preset) => {
    const nextId = (photos[photos.length - 1]?.id || 0) + 1;
    const title = preset ? preset.title : `Photograph ${nextId}`;
    const loc = preset ? preset.loc : '';
    const newCard = {
      id: nextId,
      title,
      loc,
      date: new Date().toISOString().split('T')[0],
      init: 'GC',
      cap: preset ? `Reference photograph showing ${title.toLowerCase()} during operator qualification trial.` : '',
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

  const handleClearAllPhotos = () => {
    if (window.confirm('Clear all photo cards?')) {
      onChange('photos', []);
    }
  };

  const handleRemovePhotoCard = (id) => {
    onChange('photos', photos.filter(p => p.id !== id));
  };

  const handlePhotoCardChange = (id, field, value) => {
    const updated = photos.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange('photos', updated);
  };

  const handleImageFileChange = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePhotoCardChange(id, 'b64', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageOnly = (id, e) => {
    e.stopPropagation();
    handlePhotoCardChange(id, 'b64', '');
  };

  return (
    <div className="sheet act" id="sh-photo">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">PHOTOGRAPHIC EVIDENCE REPORT</div>
          <div className="xl-corp-s">Visual documentation of operator qualification activity · field photographs with metadata</div>
        </div>
      </div>

      <div className="remark-box" style={{ borderLeftColor: '#1565C0' }}>
        <div className="remark-l" style={{ color: '#1565C0' }}>📷 Photo Capture Guidance</div>
        <div style={{ fontSize: '11.5px', color: 'var(--txt)', lineHeight: 1.55 }}>
          Add photographs documenting the qualification activity — pre-blast surface, blasting in progress, post-blast cleanliness, profile measurement, dust tape test, abrasive sample, and finished test panel. Each photo supports the inspection findings and creates an auditable trail. Photos are embedded into <b>Annexure-B</b> of the printed report.
        </div>
      </div>

      <div className="compl-bar">
        <div className="compl-item">
          <div className="compl-dot g"></div>
          <span className="compl-lbl">Photos Added:</span>
          <span className="compl-val" id="photo-count">{photoCount}</span>
        </div>
        <div className="compl-item">
          <div className="compl-dot y"></div>
          <span className="compl-lbl">Captioned:</span>
          <span className="compl-val" id="photo-cap-count">{captionedCount}</span>
        </div>
        <div className="compl-pct" id="photo-status" style={{ color: photoCount >= 3 ? 'var(--gr)' : 'var(--o1)' }}>
          {photoCount >= 3 ? 'EVIDENCE SUFFICIENT' : 'EVIDENCE PENDING'}
        </div>
      </div>

      <div className="photo-add-bar">
        <button type="button" className="btn btn-add" onClick={() => handleAddPhotoCard()}>＋ Add Photo Slot</button>
        <button type="button" className="btn btn-save" onClick={handleAddStandardSet}>⊞ Add Standard 6-Photo Set</button>
        <button type="button" className="btn btn-reset" onClick={handleClearAllPhotos}>↺ Clear All</button>
      </div>

      <div className="photo-row-grid" id="photo-grid">
        {photos.map((card) => {
          const fileInputId = `ph-input-${card.id}`;
          return (
            <div className="photo-card" id={`photo-card-${card.id}`} key={card.id}>
              <div className="photo-card-h">
                <span>📷 <span className="pc-title-disp">{card.title || `Photograph ${card.id}`}</span></span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span className="pc-tag">#{card.id}</span>
                  <button
                    type="button"
                    className="photo-card-del"
                    onClick={() => handleRemovePhotoCard(card.id)}
                    title="Delete this photo card"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                className={`photo-card-slot ${card.b64 ? 'has-photo' : ''}`}
                id={`ph-slot-${card.id}`}
                tabIndex={0}
                onClick={() => document.getElementById(fileInputId)?.click()}
              >
                {card.b64 ? (
                  <>
                    <img src={card.b64} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      className="pc-rm"
                      type="button"
                      onClick={(e) => handleRemoveImageOnly(card.id, e)}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <div className="pc-ic">📷</div>
                    <div className="pc-l">Tap to Upload</div>
                    <div className="pc-s">Click or paste (Ctrl+V) an image here</div>
                  </>
                )}
              </div>
              <input
                type="file"
                id={fileInputId}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageFileChange(card.id, e)}
              />

              <div className="photo-card-meta">
                <div className="photo-card-meta-row">
                  <span className="pm-lbl">Title / Tag</span>
                  <input
                    type="text"
                    className="pm-title"
                    value={card.title || ''}
                    onChange={(e) => handlePhotoCardChange(card.id, 'title', e.target.value)}
                  />
                </div>
                <div className="photo-card-meta-row">
                  <span className="pm-lbl">Location / Reference</span>
                  <input
                    type="text"
                    className="pm-loc"
                    value={card.loc || ''}
                    placeholder="e.g. Bay 3 · Test Panel 1"
                    onChange={(e) => handlePhotoCardChange(card.id, 'loc', e.target.value)}
                  />
                </div>
                <div className="photo-card-meta-row">
                  <span className="pm-lbl">Date Taken</span>
                  <input
                    type="date"
                    className="pm-date"
                    value={card.date || ''}
                    onChange={(e) => handlePhotoCardChange(card.id, 'date', e.target.value)}
                  />
                </div>
                <div className="photo-card-meta-row">
                  <span className="pm-lbl">Inspector Initial</span>
                  <input
                    type="text"
                    className="pm-init"
                    value={card.init || ''}
                    placeholder="e.g. GC / MK"
                    onChange={(e) => handlePhotoCardChange(card.id, 'init', e.target.value)}
                  />
                </div>
                <div className="photo-card-meta-row span-2">
                  <span className="pm-lbl">Caption / Observation</span>
                  <textarea
                    className="pm-cap"
                    value={card.cap || ''}
                    onChange={(e) => handlePhotoCardChange(card.id, 'cap', e.target.value)}
                    placeholder="Describe what this photo shows..."
                  ></textarea>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="remark-box">
        <div className="remark-l">📝 Photo Report Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-photo"
          value={state.remarkPhoto || ''}
          onChange={(e) => onChange('remarkPhoto', e.target.value)}
          placeholder="Enter photographic documentation observations..."
        ></textarea>
      </div>

      <div className="btn-row">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button type="button" className="btn nx" onClick={() => onNavigate('verdict')}>Next: Verdict &amp; Approval →</button>
      </div>
    </div>
  );
}
