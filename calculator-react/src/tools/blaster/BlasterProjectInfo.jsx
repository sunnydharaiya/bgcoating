import React, { useRef } from 'react';

export default function BlasterProjectInfo({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('operatorPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange('operatorPhoto', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
              onChange('operatorPhoto', reader.result);
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

  return (
    <div className="sheet act" id="sh-info">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">PROJECT &amp; OPERATOR INFORMATION</div>
          <div className="xl-corp-s">Step 1 of 8 — Capture project context and operator identification</div>
        </div>
      </div>

      <div className="xl-sec-h" id="sec-info-0">
        <span className="ic">📸</span>Operator Photograph<span className="num">REQUIRED FOR ID CARD &amp; PRINT REPORT</span>
      </div>
      <div className="op-photo-w">
        <div 
          className="op-photo-slot" 
          id="op-photo-slot" 
          tabIndex={0} 
          onClick={() => fileInputRef.current?.click()}
        >
          {state.operatorPhoto ? (
            <img 
              src={state.operatorPhoto} 
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
          {state.operatorPhoto && (
            <button 
              className="op-ph-rm" 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }} 
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
          onChange={handlePhotoUpload} 
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
            <button type="button" className="op-photo-btn" onClick={() => fileInputRef.current?.click()}>📁 Choose File</button>
            <button type="button" className="op-photo-btn alt" onClick={handlePastePhoto}>📋 Paste from Clipboard</button>
            <button type="button" className="op-photo-btn del" onClick={handleRemovePhoto}>🗑️ Remove</button>
          </div>
        </div>
      </div>

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
              value={state.reportNo || ''} 
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
              value={state.reportDate || ''} 
              onChange={(e) => onChange('reportDate', e.target.value)} 
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
              value={state.projectName || ''} 
              onChange={(e) => onChange('projectName', e.target.value)} 
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
              value={state.projectNo || ''} 
              onChange={(e) => onChange('projectNo', e.target.value)} 
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
              value={state.client || ''} 
              onChange={(e) => onChange('client', e.target.value)} 
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
              value={state.epcContractor || ''} 
              onChange={(e) => onChange('epcContractor', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell xl-cell-span-2">
          <div className="xl-cell-l">Coating Contractor</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-contractor" 
              placeholder="Coating Contractor" 
              value={state.coatingContractor || ''} 
              onChange={(e) => onChange('coatingContractor', e.target.value)} 
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
              value={state.location || ''} 
              onChange={(e) => onChange('location', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Reference Standard</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-ref" 
              value={state.referenceStandard || 'ASTM D 4228, SSPC, NACE, ISO 8501'} 
              onChange={(e) => onChange('referenceStandard', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell xl-cell-span-2">
          <div className="xl-cell-l">Coating System</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-coat-sys" 
              placeholder="e.g. Epoxy Primer + Polyurethane Topcoat" 
              value={state.coatingSystem || ''} 
              onChange={(e) => onChange('coatingSystem', e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="xl-sec-h" id="sec-info-2">
        <span className="ic">👷</span>Operator / Blaster Identification
      </div>
      <div className="xl-info">
        <div className="xl-cell">
          <div className="xl-cell-l">Full Name</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-name" 
              placeholder="Operator full name" 
              value={state.operatorName || ''} 
              onChange={(e) => onChange('operatorName', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Category</div>
          <div className="xl-cell-v">
            <select 
              id="f-category" 
              value={state.category || 'Blaster'} 
              onChange={(e) => onChange('category', e.target.value)}
            >
              <option>Blaster</option>
              <option>Painter</option>
              <option>Spray Operator</option>
              <option>Roller/Brush Operator</option>
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
              value={state.civilId || ''} 
              onChange={(e) => onChange('civilId', e.target.value)} 
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
              value={state.nationality || ''} 
              onChange={(e) => onChange('nationality', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Date of Birth</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-dob" 
              value={state.dob || ''} 
              onChange={(e) => onChange('dob', e.target.value)} 
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
              value={state.experience || ''} 
              onChange={(e) => onChange('experience', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell xl-cell-span-2">
          <div className="xl-cell-l">Employer</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-employer" 
              placeholder="Operator employer" 
              value={state.employer || ''} 
              onChange={(e) => onChange('employer', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Qualification Card No.</div>
          <div className="xl-cell-v">
            <input 
              type="text" 
              id="f-card" 
              placeholder="Qualification card / certificate no." 
              value={state.cardNo || ''} 
              onChange={(e) => onChange('cardNo', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Qualification Date</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-qual-date" 
              value={state.qualificationDate || ''} 
              onChange={(e) => onChange('qualificationDate', e.target.value)} 
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Next Assessment Date</div>
          <div className="xl-cell-v">
            <input 
              type="date" 
              id="f-next-date" 
              value={state.nextAssessmentDate || ''} 
              onChange={(e) => onChange('nextAssessmentDate', e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button 
          type="button" 
          className="btn btn-save" 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'draft' } }))}
        >
          💾 Save Draft
        </button>
        <button 
          type="button" 
          className="btn" 
          style={{ background: 'linear-gradient(135deg,var(--o2),var(--o1))', color: '#fff' }} 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'validate' } }))}
        >
          ✓ Validate &amp; Approve
        </button>
        <button 
          type="button" 
          className="btn btn-reset" 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'reset' } }))}
        >
          ↺ Reset
        </button>
        <button 
          type="button" 
          className="btn" 
          style={{ background: 'linear-gradient(135deg,var(--o3),var(--o2))', color: '#fff' }} 
          onClick={() => onNavigate('train')}
        >
          Next: Training &amp; Test →
        </button>
      </div>
    </div>
  );
}
