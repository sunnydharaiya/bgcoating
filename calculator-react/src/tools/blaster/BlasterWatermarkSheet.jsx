import React from 'react';

export default function BlasterWatermarkSheet({
  watermark,
  onChange,
  onNavigate,
  onSaveDraft,
  onValidate
}) {
  const isEnabled = watermark?.enabled ?? true;

  const toggleWatermark = () => {
    onChange('enabled', !isEnabled);
  };

  return (
    <div className="sheet act" id="sh-watermark">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">WATERMARK REMOVAL <span className="pro-chip">PRO</span></div>
          <div className="xl-corp-s">Control the diagonal BG Group watermark printed across every report page</div>
        </div>
      </div>

      <div className="pro-note">
        <div className="pro-note-ic">💧</div>
        <div className="pro-note-t">
          <b>Free version:</b> watermark is <b>mandatory</b> and cannot be removed — every Preview &amp; Print page carries a low-opacity
          diagonal "BG Group of Paint and Coating Consultant" watermark.<br />
          <b>Pro version:</b> the toggle below unlocks and the watermark can be switched ON / OFF for Preview &amp; Print.
        </div>
      </div>

      <div className="wm-card">
        <div className="wm-card-l">
          <div className="wm-card-t">💧 Diagonal Watermark on Preview &amp; Print</div>
          <div className="wm-card-s" id="wm-status-text">
            Watermark: <b>{isEnabled ? 'ON (Pro — toggle available)' : 'OFF (Watermark Removed)'}</b>
          </div>
        </div>
        <button
          type="button"
          className={`wm-toggle ${!isEnabled ? 'off' : ''}`}
          id="wm-toggle"
          onClick={toggleWatermark}
          title="Toggle diagonal watermark"
        >
          <span className="wm-knob"></span>
        </button>
      </div>

      <div className="wm-preview-strip">
        <div className="wm-preview-page">
          {isEnabled && (
            <div className="wm-demo-layer">
              <span>BG Group of Paint and Coating Consultant</span>
            </div>
          )}
          <div className="wm-demo-content">
            <div className="wm-demo-line w70"></div>
            <div className="wm-demo-line w90"></div>
            <div className="wm-demo-line w50"></div>
            <div className="wm-demo-line w80"></div>
            <div className="wm-demo-line w60"></div>
            <div className="wm-demo-line w90"></div>
          </div>
          <div className="wm-preview-cap">
            How the watermark appears on every printed page — low opacity, behind content, does not affect readability.
          </div>
        </div>
      </div>

      <div className="btn-row btn-row-std">
        <button type="button" className="btn btn-draft-std" onClick={onSaveDraft}>💾 Save as Draft</button>
        <button type="button" className="btn btn-validate-std" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn btn-save" onClick={() => onNavigate('print')}>Next: Print Report →</button>
      </div>
    </div>
  );
}
