import React, { useRef } from 'react';
import { 
  PAINT_GENERIC_OPTIONS, 
  PAINT_MFR_OPTIONS, 
  COATING_SYSTEM_DEFAULTS 
} from '../../data/painterDatabase';

export default function PainterProjectInfo({
  formData = {},
  onChange,
  onPhotoUpload,
  onPhotoRemove,
  onSyncCoatingSystem,
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const fileInputRef = useRef(null);

  const handleField = (field, val) => {
    onChange(field, val);
  };

  const handlePastePhoto = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onloadend = () => {
              onChange('_opPhoto', reader.result);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Clipboard read failed or permission denied:', e);
    }
  };

  // Coating system rows
  const csRows = formData._coatingSystem || COATING_SYSTEM_DEFAULTS;

  const handleCSRowChange = (index, field, value) => {
    const updated = [...csRows];
    updated[index] = { ...updated[index], [field]: value };
    onChange('_coatingSystem', updated);
  };

  const handleAddCSRow = () => {
    const nextAct = `Intermediate Coat ${csRows.length}`;
    const newRow = {
      act: nextAct,
      generic: "Epoxy High Build",
      mfr: "Jotun",
      brand: "Jotamastic 90",
      coats: "1",
      min: "100",
      max: "125",
      shade: "Grey"
    };
    onChange('_coatingSystem', [...csRows, newRow]);
  };

  const handleRemoveCSRow = (index) => {
    if (csRows.length <= 1) return;
    const updated = csRows.filter((_, i) => i !== index);
    onChange('_coatingSystem', updated);
  };

  const handleResetCS = () => {
    if (window.confirm('Reset Coating System specification to default 2-coat starter system?')) {
      onChange('_coatingSystem', COATING_SYSTEM_DEFAULTS);
    }
  };

  // Cumulative DFT totals
  let totalCoats = 0;
  let cumMin = 0;
  let cumMax = 0;
  const computedRows = csRows.map(row => {
    const coats = parseInt(row.coats) || 1;
    const mn = parseFloat(row.min);
    const mx = parseFloat(row.max);
    totalCoats += coats;
    if (!isNaN(mn)) cumMin += mn * coats;
    if (!isNaN(mx)) cumMax += mx * coats;
    return {
      ...row,
      tmin: isNaN(cumMin) ? '—' : cumMin.toFixed(0),
      tmax: isNaN(cumMax) ? '—' : cumMax.toFixed(0)
    };
  });

  return (
    <div className="sheet act" id="sh-info">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">PROJECT &amp; OPERATOR INFORMATION</div>
          <div className="xl-corp-s">Step 1 of 8 — Capture project context and operator identification</div>
        </div>
      </div>

      {/* Operator Photograph */}
      <div className="xl-sec-h" id="sec-info-0">
        <span className="ic">📸</span>Operator Photograph
        <span className="num">REQUIRED FOR ID CARD &amp; PRINT REPORT</span>
      </div>
      <div className="op-photo-w">
        <div 
          className="op-photo-slot" 
          id="op-photo-slot" 
          tabIndex={0} 
          onClick={() => fileInputRef.current?.click()}
        >
          {formData._opPhoto ? (
            <img 
              src={formData._opPhoto} 
              alt="Operator" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <>
              <div className="op-ph-ic">👤</div>
              <div className="op-ph-l">Tap to Upload</div>
              <div className="op-ph-s">Click here, or drop / paste an image. JPG / PNG · Portrait orientation recommended.</div>
            </>
          )}
          {formData._opPhoto && (
            <button 
              className="op-ph-rm" 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onPhotoRemove(); }} 
              title="Remove photo"
            >
              ✕
            </button>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          id="op-photo-input" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={onPhotoUpload} 
        />
        <div className="op-photo-info">
          <div className="op-photo-info-h">📌 Photo Guidelines</div>
          <div className="op-photo-info-t">
            Upload a recent passport-style photograph of the operator. This photograph will:
            <ul>
              <li>Appear in the printed report header</li>
              <li>Be embedded in the qualification certificate</li>
              <li>Used for site ID-card verification</li>
            </ul>
          </div>
          <div className="op-photo-actions">
            <button type="button" className="op-photo-btn" onClick={() => fileInputRef.current?.click()}>
              📁 Choose File
            </button>
            <button type="button" className="op-photo-btn alt" onClick={handlePastePhoto}>
              📋 Paste from Clipboard
            </button>
            <button type="button" className="op-photo-btn del" onClick={onPhotoRemove}>
              🗑️ Remove
            </button>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="xl-sec-h" id="sec-info-1">
        <span className="ic">🏗️</span>Project Details
      </div>
      <div className="xl-info">
        <div className="xl-cell">
          <div className="xl-cell-l">Report No.</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-rep-no" 
              value={formData['f-rep-no'] || ''} 
              placeholder="Auto-generated on Save / Validate" 
              readOnly 
              title="The Report No. is generated automatically when you Save Draft or Validate & Approve." 
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, cursor: 'not-allowed' }} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Report Date</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-rep-date" 
              value={formData['f-rep-date'] || ''} 
              onChange={(e) => handleField('f-rep-date', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Project Name</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-proj" 
              placeholder="e.g. NFS Qatar Gas" 
              value={formData['f-proj'] || ''} 
              onChange={(e) => handleField('f-proj', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Project No.</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-proj-no" 
              placeholder="e.g. NFS-Q-2025" 
              value={formData['f-proj-no'] || ''} 
              onChange={(e) => handleField('f-proj-no', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Client</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-client" 
              placeholder="e.g. QatarEnergy LNG" 
              value={formData['f-client'] || ''} 
              onChange={(e) => handleField('f-client', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">EPC Contractor</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-epc" 
              placeholder="e.g. EPC Contractor Name" 
              value={formData['f-epc'] || ''} 
              onChange={(e) => handleField('f-epc', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Coating Contractor</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input 
              type="text" 
              id="f-contractor" 
              placeholder="Coating Contractor" 
              value={formData['f-contractor'] || ''} 
              onChange={(e) => handleField('f-contractor', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Work Location</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-location" 
              placeholder="e.g. Qatar Site / Workshop" 
              value={formData['f-location'] || ''} 
              onChange={(e) => handleField('f-location', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Reference Standard</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-ref" 
              value={formData['f-ref'] || 'ASTM D 4228, SSPC PA-2, ASTM D7091, ASTM D3359, ASTM D4541, NACE / AMPP'} 
              onChange={(e) => handleField('f-ref', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Operator Identification */}
      <div className="xl-sec-h" id="sec-info-2">
        <span className="ic">🎨</span>Operator / Spray Painter Identification
      </div>
      <div className="xl-info">
        <div className="xl-cell">
          <div className="xl-cell-l">Full Name</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-name" 
              placeholder="Operator full name" 
              value={formData['f-name'] || ''} 
              onChange={(e) => handleField('f-name', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Category</div>
          <div className="xl-cell-v">
            <select 
              id="f-category" 
              value={formData['f-category'] || 'Spray Painter'} 
              onChange={(e) => handleField('f-category', e.target.value)}
            >
              <option>Spray Painter</option>
              <option>Paint Applicator</option>
              <option>Airless Sprayer</option>
              <option>Air-Spray Operator</option>
              <option>Brush/Roller Painter</option>
              <option>Coating Inspector</option>
            </select>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Civil ID / Passport No.</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-civil" 
              placeholder="Civil ID / Passport No." 
              value={formData['f-civil'] || ''} 
              onChange={(e) => handleField('f-civil', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Nationality</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-nationality" 
              placeholder="e.g. INDIAN / FILIPINO / NEPALI" 
              value={formData['f-nationality'] || ''} 
              onChange={(e) => handleField('f-nationality', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Date of Birth</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-dob" 
              value={formData['f-dob'] || ''} 
              onChange={(e) => handleField('f-dob', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Experience (Years)</div>
          <div className="xl-cell-v">
            <input 
              type="number" 
              id="f-exp" 
              min="0" 
              step="0.5" 
              placeholder="0" 
              value={formData['f-exp'] || ''} 
              onChange={(e) => handleField('f-exp', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Employer</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input 
              type="text" 
              id="f-employer" 
              placeholder="Operator employer" 
              value={formData['f-employer'] || ''} 
              onChange={(e) => handleField('f-employer', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Qualification Date</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-qual-date" 
              value={formData['f-qual-date'] || ''} 
              onChange={(e) => handleField('f-qual-date', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Next Assessment Date</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-next-date" 
              value={formData['f-next-date'] || ''} 
              onChange={(e) => handleField('f-next-date', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Coating System Specification */}
      <div className="xl-sec-h" id="sec-info-3">
        <span className="ic">⭐</span>Coating System <span className="num">DEFINES QUALIFICATION SCOPE · EDITABLE</span>
      </div>
      <div style={{ background: '#FFFBF5', border: '1.5px solid var(--o2)', borderRadius: '9px', padding: '12px', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: 'var(--txt2)', lineHeight: 1.5, marginBottom: '10px' }}>
          Define the complete coating system the painter is being qualified for. <b>The paint generic names, DFT ranges and manufacturer products entered here are the qualified scope</b> — only these paints/coats may be applied by the qualified spray painter. Add or remove activity rows for different project coating systems.
        </div>
        <div className="xl-cell" style={{ marginBottom: '10px' }}>
          <div className="xl-cell-l">Surface Preparation Standard</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input 
              type="text" 
              id="cs-surf-prep" 
              placeholder="e.g. SSPC-SP10 / NACE No.2 · Near-White Blast · Profile 50-75 µm" 
              value={formData['cs-surf-prep'] || 'SSPC-SP10 / NACE No.2 · Near-White Blast Cleaning · Profile: 50-75 µm'} 
              onChange={(e) => handleField('cs-surf-prep', e.target.value)} 
            />
          </div>
        </div>

        <div className="xl-tbl-w" style={{ overflowX: 'auto' }}>
          <table className="xl-tbl" id="cs-table" style={{ minWidth: '1340px' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ width: '160px', textAlign: 'left', paddingLeft: '10px' }}>Activity</th>
                <th rowSpan={2} style={{ textAlign: 'left', paddingLeft: '10px' }}>Paint Generic Name</th>
                <th rowSpan={2} style={{ textAlign: 'left', paddingLeft: '10px' }}>Paint Manufacturer</th>
                <th rowSpan={2} style={{ textAlign: 'left', paddingLeft: '10px' }}>Paint Brand Name</th>
                <th rowSpan={2} style={{ width: '60px' }}>No. of Coat</th>
                <th colSpan={2}>Req. DFT (µ)</th>
                <th colSpan={2}>Total (µ)</th>
                <th rowSpan={2} style={{ width: '140px' }}>Final Coat Color Shade</th>
                <th rowSpan={2} style={{ width: '36px' }}>×</th>
              </tr>
              <tr style={{ background: 'linear-gradient(180deg,var(--bg4),var(--bg5))' }}>
                <th style={{ width: '64px' }}>Min</th>
                <th style={{ width: '64px' }}>Max</th>
                <th style={{ width: '64px' }}>Min</th>
                <th style={{ width: '64px' }}>Max</th>
              </tr>
            </thead>
            <tbody id="cs-tbody">
              {computedRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="txt-l">
                    <input 
                      type="text" 
                      className="cs-act txt-l-i" 
                      value={row.act} 
                      placeholder="Activity" 
                      onChange={(e) => handleCSRowChange(idx, 'act', e.target.value)} 
                    />
                  </td>
                  <td className="txt-l">
                    <input 
                      type="text" 
                      className="cs-generic txt-l-i" 
                      list="dl-cs-generic" 
                      value={row.generic} 
                      placeholder="Paint generic name" 
                      onChange={(e) => handleCSRowChange(idx, 'generic', e.target.value)} 
                    />
                  </td>
                  <td className="txt-l">
                    <input 
                      type="text" 
                      className="cs-mfr txt-l-i" 
                      list="dl-cs-mfr" 
                      value={row.mfr} 
                      placeholder="e.g. Jotun / Hempel" 
                      onChange={(e) => handleCSRowChange(idx, 'mfr', e.target.value)} 
                    />
                  </td>
                  <td className="txt-l">
                    <input 
                      type="text" 
                      className="cs-brand txt-l-i" 
                      value={row.brand} 
                      placeholder="e.g. Resist 86" 
                      onChange={(e) => handleCSRowChange(idx, 'brand', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="cs-coats" 
                      value={row.coats} 
                      placeholder="1" 
                      onChange={(e) => handleCSRowChange(idx, 'coats', e.target.value)} 
                      style={{ textAlign: 'center', width: '50px' }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="cs-min" 
                      value={row.min} 
                      placeholder="min" 
                      onChange={(e) => handleCSRowChange(idx, 'min', e.target.value)} 
                      style={{ textAlign: 'center', width: '56px' }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="cs-max" 
                      value={row.max} 
                      placeholder="max" 
                      onChange={(e) => handleCSRowChange(idx, 'max', e.target.value)} 
                      style={{ textAlign: 'center', width: '56px' }} 
                    />
                  </td>
                  <td className="calc cs-tmin" style={{ fontWeight: 700 }}>{row.tmin}</td>
                  <td className="calc cs-tmax" style={{ fontWeight: 700 }}>{row.tmax}</td>
                  <td className="txt-l">
                    <input 
                      type="text" 
                      className="cs-shade txt-l-i" 
                      value={row.shade} 
                      placeholder="Color shade / RAL" 
                      onChange={(e) => handleCSRowChange(idx, 'shade', e.target.value)} 
                    />
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="rep-act del" 
                      title="Remove row" 
                      onClick={() => handleRemoveCSRow(idx)} 
                      style={{ width: '24px', height: '24px' }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'linear-gradient(180deg,#F4E5C7,#E9D7B0)', fontWeight: 700 }}>
                <td colSpan={4} style={{ textAlign: 'right', fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', paddingRight: '10px' }}>
                  TOTAL NOS OF COAT &amp; TOTAL DFT
                </td>
                <td className="calc" id="cs-total-coats">{totalCoats}</td>
                <td colSpan={2}></td>
                <td className="calc" id="cs-total-min">{cumMin.toFixed(0)}</td>
                <td className="calc" id="cs-total-max">{cumMax.toFixed(0)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Datalists for generic & manufacturers */}
        <datalist id="dl-cs-generic">
          {PAINT_GENERIC_OPTIONS.map((opt, i) => <option key={i} value={opt} />)}
        </datalist>
        <datalist id="dl-cs-mfr">
          {PAINT_MFR_OPTIONS.map((opt, i) => <option key={i} value={opt} />)}
        </datalist>

        <div style={{ display: 'flex', gap: '8px', margin: '9px 0', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-add" onClick={handleAddCSRow}>＋ Add Coat Row</button>
          <button type="button" className="btn btn-reset" onClick={handleResetCS}>↺ Reset to Default System</button>
        </div>
        <div className="remark-box" style={{ marginTop: '6px' }}>
          <div className="remark-l">💬 Coating System Remark</div>
          <textarea 
            className="remark-t" 
            id="cs-remark" 
            value={formData['cs-remark'] || ''} 
            onChange={(e) => handleField('cs-remark', e.target.value)} 
            placeholder="Comment on DFT, shade, or any specific note. For over-coating intervals, paint manufacturer data sheet to be followed strictly."
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '9px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-save" 
            onClick={onSyncCoatingSystem} 
            title="Push generic names, manufacturer brand & DFT ranges into the per-coat sheets"
          >
            ⟳ Sync to Coat Sheets
          </button>
        </div>
      </div>

      <div className="btn-row btn-row-std">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button type="button" className="btn nx" onClick={() => onNavigate && onNavigate('train')}>Next: Training &amp; Test →</button>
      </div>
    </div>
  );
}
