import React from 'react';

export default function BlasterHub({
  state,
  metrics = {},
  reports = [],
  onNavigate,
  onApplyPreset,
  onNewGeneration,
  onOpenPreview,
  onOpenPrint
}) {
  const totalReports = reports.length;
  const draftReports = reports.filter(r => r.status === 'Draft' || !r.status).length;
  const approvedReports = reports.filter(r => r.status === 'Approved').length;
  const pendingReports = reports.filter(r => r.status === 'Pending' || r.verdict === 'PENDING').length;

  const handleStartNew = () => {
    if (onNewGeneration) {
      onNewGeneration();
    } else if (onNavigate) {
      onNavigate('info');
    }
  };

  const handleGoRegister = () => {
    if (onNavigate) onNavigate('register');
  };

  const handleGoPreview = () => {
    if (onOpenPreview) {
      onOpenPreview();
    } else if (onNavigate) {
      onNavigate('preview');
    }
  };

  const handleGoPrint = () => {
    if (onOpenPrint) {
      onOpenPrint();
    } else if (onNavigate) {
      onNavigate('report');
    }
  };

  return (
    <div className="sheet act" id="sh-home">
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-logo">
            <img src="/logo-2.png" id="home-logo-img" alt="BG Group" />
          </div>
          <div className="home-hero-txt">
            <div className="home-kicker">✦ DIGITAL QUALIFICATION · BLASTER · SURFACE PREPARATION OPERATOR</div>
            <h1 className="home-title">
              Blaster / Operator Qualification <span>&amp; Digital Reporting</span>
            </h1>
            <p className="home-desc">
              A premium industrial qualification platform by BG Group of Paint and Coating Consultant — capture
              Project &amp; Operator data, Training &amp; Assessment, Environmental monitoring, Surface Preparation &amp; Abrasive
              control and Inspection results with real-time compliance to SSPC/NACE standards, dew-point monitoring and photo
              evidence; the system auto-validates limits, then generates MNC-grade printable qualification dossiers.
            </p>
            <button className="btn-new-generation home-newgen" onClick={handleStartNew}>
              🚀 NEW GENERATION
            </button>
            <div className="home-hero-cap">Start a new qualification — all sheets open for guided data entry</div>
          </div>
        </div>
      </div>

      <div className="home-sec-h">
        <span className="bar"></span>Qualification Overview <span className="home-sec-note">Saved qualification reports</span>
      </div>
      <div className="home-cards">
        <button className="home-card" onClick={handleGoRegister}>
          <span className="hc-ic" style={{ background: '#FDEBD6' }}>📊</span>
          <span className="hc-arrow">→</span>
          <div className="hc-num" id="home-total" style={{ color: 'var(--br1)' }}>{totalReports}</div>
          <div className="hc-lbl">Total Reports</div>
          <div className="hc-sub">All saved reports</div>
        </button>
        <button className="home-card" onClick={handleGoRegister}>
          <span className="hc-ic" style={{ background: '#FFF3E0' }}>✏️</span>
          <span className="hc-arrow">→</span>
          <div className="hc-num" id="home-drafts" style={{ color: '#E65100' }}>{draftReports}</div>
          <div className="hc-lbl">Draft Reports</div>
          <div className="hc-sub">Work in progress</div>
        </button>
        <button className="home-card" onClick={handleGoRegister}>
          <span className="hc-ic" style={{ background: '#E8F5E9' }}>✅</span>
          <span className="hc-arrow">→</span>
          <div className="hc-num" id="home-approved" style={{ color: '#2E7D32' }}>{approvedReports}</div>
          <div className="hc-lbl">Approved</div>
          <div className="hc-sub">Validated &amp; signed off</div>
        </button>
        <button className="home-card" onClick={handleGoRegister}>
          <span className="hc-ic" style={{ background: '#E3F2FD' }}>⏳</span>
          <span className="hc-arrow">→</span>
          <div className="hc-num" id="home-pending" style={{ color: '#1565C0' }}>{pendingReports}</div>
          <div className="hc-lbl">Pending</div>
          <div className="hc-sub">Awaiting approval</div>
        </button>
      </div>

      <div className="home-sec-h">
        <span className="bar"></span>Quick Actions <span className="home-sec-note">Jump straight in</span>
      </div>
      <div className="home-actions">
        <button className="home-act" onClick={handleStartNew}>
          <span className="ha-ic" style={{ background: 'linear-gradient(135deg,var(--o2),var(--o1))' }}>🚀</span>
          <span className="ha-t">New Generation<small>Start a fresh qualification</small></span>
        </button>
        <button className="home-act" onClick={handleGoRegister}>
          <span className="ha-ic" style={{ background: 'linear-gradient(135deg,#1976D2,#0D47A1)' }}>📁</span>
          <span className="ha-t">Report Register<small>Open all saved reports</small></span>
        </button>
        <button className="home-act" onClick={handleGoPreview}>
          <span className="ha-ic" style={{ background: 'linear-gradient(135deg,#8E24AA,#4A148C)' }}>👁</span>
          <span className="ha-t">Preview Latest<small>Read-only report preview</small></span>
        </button>
        <button className="home-act" onClick={handleGoPrint}>
          <span className="ha-ic" style={{ background: 'linear-gradient(135deg,#43A047,#1B5E20)' }}>🖨️</span>
          <span className="ha-t">Print Existing <span className="sb-pro" style={{ position: 'static' }}>PRO</span><small>Excel-format printable view</small></span>
        </button>
      </div>
    </div>
  );
}
