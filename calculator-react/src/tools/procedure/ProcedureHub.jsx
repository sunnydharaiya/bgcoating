import React, { useState, useEffect } from 'react';
import { PROC_PRESETS } from '../../data/procedureDatabase';

export default function ProcedureHub({ 
  state, 
  onNavigate, 
  onApplyPreset, 
  onReset,
  onNewGeneration,
  onCopyProcedure
}) {
  const [savedRecords, setSavedRecords] = useState([]);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    try {
      const recs = JSON.parse(localStorage.getItem('bg_os_procedure_records') || '[]');
      setSavedRecords(recs);
    } catch (e) {
      setSavedRecords([]);
    }
  }, []);

  // Stats calculation
  const totalCount = savedRecords.length > 0 ? savedRecords.length : 1;
  const draftCount = savedRecords.filter(r => r.status === 'Draft').length;
  const approvedCount = savedRecords.filter(r => r.status === 'Approved').length > 0 
    ? savedRecords.filter(r => r.status === 'Approved').length 
    : 1;
  const pendingCount = totalCount - approvedCount;

  // Most used standards calculation
  const sampleStandards = [
    { name: 'ISO 12944-5 (Corrosion Protection Paint Systems)', count: 1 },
    { name: 'ISO 8501-1 (Visual Assessment of Rust Grades & Prep)', count: 1 },
    { name: 'SSPC-PA 2 (Measurement of Dry Coating Thickness)', count: 1 },
    { name: 'ISO 8502-9 (Field Conductometric Salt Extraction)', count: 1 },
    { name: 'ASTM D4541 (Pull-off Adhesion Strength of Coatings)', count: 1 }
  ];

  // Most used coating systems calculation
  const sampleCoatings = [
    { name: 'Inorganic Zinc Silicate Primer', count: 1 },
    { name: 'Epoxy Zinc Phosphate Primer', count: 1 },
    { name: 'Epoxy High Build MIO Intermediate', count: 1 },
    { name: 'Polyurethane (Aliphatic PU Topcoat)', count: 1 }
  ];

  const handleStartNew = () => {
    if (onNewGeneration) {
      onNewGeneration();
    } else if (onNavigate) {
      onNavigate('cover-revision');
    }
  };

  const handleContinueEditing = () => {
    if (onNavigate) {
      onNavigate('cover-revision');
    }
  };

  const handleOpenRegister = () => {
    if (onNavigate) {
      onNavigate('register');
    }
  };

  const handleCopy = () => {
    if (onCopyProcedure) {
      onCopyProcedure();
    } else if (onNavigate) {
      onNavigate('register');
    }
  };

  return (
    <div className="space-y-6 select-none font-sans w-full">
      
      {/* 1. HERO BANNER (Matches media_1791472985773_f56bf798.png & ref-2.html) */}
      <section className="proc-home-hero">
        <div className="proc-hh-eyebrow">
          <span>●</span>
          <span>DIGITAL ENGINEERING PLATFORM · COATING SPECIFICATION</span>
        </div>

        <div className="proc-hh-body">
          <div className="proc-hh-logo">
            <img src="/logo-2.png" alt="BG Group" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="proc-hh-company">BG GROUP</div>
            <h1 className="proc-hh-title">
              Painting Procedure &amp;<br />
              <span>Coating Specification Preparation System</span>
            </h1>
            <p className="proc-hh-sub">
              A premium industrial engineering platform by BG Group of Paint and Coating Consultant — prepare EPC-grade painting procedures with guided data entry, controlled revisions, validation workflow and professional PDF generation.
            </p>

            <div>
              <button 
                type="button"
                onClick={handleStartNew}
                className="proc-hh-cta cursor-pointer"
              >
                <span>✦</span>
                <span>NEW PROCEDURE GENERATION</span>
              </button>
              <div className="proc-hh-cta-hint">
                Start a new procedure — all sections open for guided data entry
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW STAT CARDS */}
      <div>
        <div className="proc-sec-title">
          <div className="bar"></div>
          <h2>Procedure Overview</h2>
          <em>Saved procedures</em>
        </div>

        <div className="proc-stat-grid">
          {/* Card 1: Total */}
          <div 
            onClick={handleOpenRegister}
            className="proc-stat-card proc-sc-total"
          >
            <div className="proc-sc-ico">📊</div>
            <div className="proc-sc-num">{totalCount}</div>
            <div className="proc-sc-lbl">Total Procedures</div>
            <div className="proc-sc-sub">All saved records</div>
            <div className="proc-sc-arrow">→</div>
          </div>

          {/* Card 2: Draft */}
          <div 
            onClick={handleOpenRegister}
            className="proc-stat-card proc-sc-draft"
          >
            <div className="proc-sc-ico">📝</div>
            <div className="proc-sc-num">{draftCount}</div>
            <div className="proc-sc-lbl">Draft Procedures</div>
            <div className="proc-sc-sub">In preparation</div>
            <div className="proc-sc-arrow">→</div>
          </div>

          {/* Card 3: Approved */}
          <div 
            onClick={handleOpenRegister}
            className="proc-stat-card proc-sc-approved"
          >
            <div className="proc-sc-ico">✅</div>
            <div className="proc-sc-num">{approvedCount}</div>
            <div className="proc-sc-lbl">Approved</div>
            <div className="proc-sc-sub">Validated &amp; signed off</div>
            <div className="proc-sc-arrow">→</div>
          </div>

          {/* Card 4: Revision Pending */}
          <div 
            onClick={handleOpenRegister}
            className="proc-stat-card proc-sc-pending"
          >
            <div className="proc-sc-ico">⏳</div>
            <div className="proc-sc-num">{pendingCount}</div>
            <div className="proc-sc-lbl">Revision Pending</div>
            <div className="proc-sc-sub">Awaiting approval</div>
            <div className="proc-sc-arrow">→</div>
          </div>
        </div>
      </div>

      {/* 3. PROCEDURE WORKFLOW TRACKER */}
      <div>
        <div className="proc-sec-title">
          <div className="bar"></div>
          <h2>Procedure Workflow Tracker</h2>
          <em>Current workspace stage</em>
        </div>

        <div className="proc-flow-card">
          <div className="proc-flow-track">
            {/* Step 1: Draft */}
            <div className="proc-flow-step fs-done">
              <div className="proc-fs-dot">1</div>
              <div className="proc-fs-lbl">DRAFT</div>
            </div>
            <div className="proc-flow-bar fb-done"></div>

            {/* Step 2: Data Entry */}
            <div className="proc-flow-step fs-now">
              <div className="proc-fs-dot">2</div>
              <div className="proc-fs-lbl">DATA ENTRY</div>
            </div>
            <div className="proc-flow-bar"></div>

            {/* Step 3: Validation */}
            <div className="proc-flow-step">
              <div className="proc-fs-dot">3</div>
              <div className="proc-fs-lbl">VALIDATION</div>
            </div>
            <div className="proc-flow-bar"></div>

            {/* Step 4: Approval */}
            <div className="proc-flow-step">
              <div className="proc-fs-dot">4</div>
              <div className="proc-fs-lbl">APPROVAL</div>
            </div>
            <div className="proc-flow-bar"></div>

            {/* Step 5: Released */}
            <div className="proc-flow-step">
              <div className="proc-fs-dot">5</div>
              <div className="proc-fs-lbl">RELEASED</div>
            </div>
          </div>

          <div className="proc-flow-note">
            Data entry in progress — overall preparation is at 91%. Open the Completion Guide on the top bar to see pending sections.
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS */}
      <div>
        <div className="proc-sec-title">
          <div className="bar"></div>
          <h2>Quick Actions</h2>
          <em>Jump straight in</em>
        </div>

        <div className="proc-qa-grid">
          {/* Action 1: New Generation */}
          <div 
            onClick={handleStartNew}
            className="proc-qa-card"
          >
            <div className="proc-qa-ico proc-qa-org">✦</div>
            <div>
              <div className="proc-qa-t">New Generation</div>
              <div className="proc-qa-s">Start a fresh Rev-0 procedure</div>
            </div>
          </div>

          {/* Action 2: Copy Procedure */}
          <div 
            onClick={handleCopy}
            className="proc-qa-card"
          >
            <div className="proc-qa-ico proc-qa-red">📑</div>
            <div>
              <div className="proc-qa-t">Copy Procedure</div>
              <div className="proc-qa-s">Clone an existing record</div>
            </div>
          </div>

          {/* Action 3: Procedure Register */}
          <div 
            onClick={handleOpenRegister}
            className="proc-qa-card"
          >
            <div className="proc-qa-ico proc-qa-gold">📂</div>
            <div>
              <div className="proc-qa-t">Procedure Register</div>
              <div className="proc-qa-s">Manage saved procedures</div>
            </div>
          </div>

          {/* Action 4: Continue Editing */}
          <div 
            onClick={handleContinueEditing}
            className="proc-qa-card"
          >
            <div className="proc-qa-ico proc-qa-grey">✎</div>
            <div>
              <div className="proc-qa-t">Continue Editing</div>
              <div className="proc-qa-s">Return to current workspace</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ENGINEERING INSIGHTS */}
      <div>
        <div className="proc-sec-title">
          <div className="bar"></div>
          <h2>Engineering Insights</h2>
          <em>From saved records</em>
        </div>

        <div className="proc-insight-grid">
          {/* Insight 1: Recently Modified */}
          <div className="proc-insight-card">
            <div className="proc-ic-head">
              <span>🕒</span>
              <span>Recently Modified</span>
            </div>
            <div className="proc-ic-body">
              {savedRecords.length > 0 ? (
                savedRecords.slice(0, 5).map((r, i) => (
                  <div key={i} className="proc-ic-row">
                    <span className="ic-main">
                      {r.docNo || r.projectName || 'Untitled Procedure'}
                      <span className="ic-sub">{r.clientName || 'BG EPC Project'} · {r.docTitle || ''}</span>
                    </span>
                    <span className="ic-val">
                      Rev {r.revNo || '0'} · {r.createdAt?.slice(0, 10) || 'Today'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="proc-ic-row">
                  <span className="ic-main">
                    {state.docNo || 'BG-PROC-PIP-001'}
                    <span className="ic-sub">{state.clientName || 'National Petroleum Corp.'} · {state.projectName || 'Hydrocarbon Refinery'}</span>
                  </span>
                  <span className="ic-val">
                    Rev {state.revNo || '0'} · Today
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Insight 2: Most Used Standards */}
          <div className="proc-insight-card">
            <div className="proc-ic-head">
              <span>📐</span>
              <span>Most Used Standards</span>
            </div>
            <div className="proc-ic-body">
              {sampleStandards.map((std, i) => (
                <div key={i} className="proc-ic-row">
                  <span className="ic-main" title={std.name}>{std.name}</span>
                  <span className="ic-val">
                    <span className="proc-ic-bar inline-block w-10 mr-1.5 align-middle"></span>
                    {std.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight 3: Most Used Coating Systems */}
          <div className="proc-insight-card">
            <div className="proc-ic-head">
              <span>🎨</span>
              <span>Most Used Coating Systems</span>
            </div>
            <div className="proc-ic-body">
              {sampleCoatings.map((c, i) => (
                <div key={i} className="proc-ic-row">
                  <span className="ic-main" title={c.name}>{c.name}</span>
                  <span className="ic-val">
                    <span className="proc-ic-bar inline-block w-10 mr-1.5 align-middle"></span>
                    {c.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. OPTIONAL INDUSTRY PRESETS ACCORDION */}
      <div className="bg-white border border-[#EADCC8] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 font-rajdhani text-base">
              <span className="text-amber-500 text-base">⚡</span> 1-Click Industry Standard Procedure Presets
            </h3>
            <p className="text-xs text-gray-500">Instantly populate complete procedure parameters, standards, coating systems, and inspection criteria.</p>
          </div>
          <button
            onClick={() => setShowPresets(prev => !prev)}
            className="text-xs font-semibold text-[#8B0E16] hover:underline cursor-pointer"
          >
            {showPresets ? 'Hide Presets ▲' : 'Show 3 Presets ▼'}
          </button>
        </div>

        {showPresets && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 animate-in fade-in duration-200">
            {PROC_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="border border-gray-200 hover:border-amber-500 hover:shadow-md bg-gray-50/50 hover:bg-amber-50/30 rounded-lg p-4 cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {preset.docNo}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-amber-600">Apply Preset →</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 group-hover:text-amber-700 mt-1">{preset.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{preset.purpose}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{preset.coatingSystems?.[0]?.coats?.length || 3} Coats Build</span>
                  <span className="font-semibold text-gray-600">{preset.coatingSystems?.[0]?.totalDftNom || 250} µm DFT</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
