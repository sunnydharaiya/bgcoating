import React, { useState, useEffect } from 'react';
import { INITIAL_PROCEDURE_STATE } from '../data/procedureDatabase';

import ProcedureHub from '../tools/procedure/ProcedureHub';
import ProcCoverRevision from '../tools/procedure/ProcCoverRevision';
import ProcScope from '../tools/procedure/ProcScope';
import ProcRefDocs from '../tools/procedure/ProcRefDocs';
import ProcStandards from '../tools/procedure/ProcStandards';
import ProcExclusions from '../tools/procedure/ProcExclusions';
import ProcSafety from '../tools/procedure/ProcSafety';
import ProcSurfacePrep from '../tools/procedure/ProcSurfacePrep';
import ProcCoatingApp from '../tools/procedure/ProcCoatingApp';
import ProcRepairPlan from '../tools/procedure/ProcRepairPlan';
import ProcManufacturers from '../tools/procedure/ProcManufacturers';
import ProcAttachments from '../tools/procedure/ProcAttachments';
import ProcAnnexureCoating from '../tools/procedure/ProcAnnexureCoating';
import ProcAnnexureInspection from '../tools/procedure/ProcAnnexureInspection';
import ProcReportRegister from '../tools/procedure/ProcReportRegister';
import ProcPrintDossier from '../tools/procedure/ProcPrintDossier';
import ProcPreviewModal from '../tools/procedure/ProcPreviewModal';
import ProcCompanyModal from '../tools/procedure/ProcCompanyModal';
import ProcWatermarkControl from '../tools/procedure/ProcWatermarkControl';

const DRAFT_KEY = 'bg_os_procedure_draft';
const RECORDS_KEY = 'bg_os_procedure_records';
const COMPANY_KEY = 'bg_company_profile';

export default function CoatingProcedurePage({ currentSubTool = 'hub', onNavigate }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROCEDURE_STATE;
    } catch (e) {
      return INITIAL_PROCEDURE_STATE;
    }
  });

  const [companyProfile, setCompanyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [watermarkSettings, setWatermarkSettings] = useState({
    text: companyProfile?.name || 'BG COATING & CORROSION ENGINEERING',
    opacity: 0.08,
    rotation: -30,
    enabled: true
  });

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync sub-tool route with modals
  useEffect(() => {
    if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
      setShowCompanyModal(true);
      setShowPreviewModal(false);
    } else if (currentSubTool === 'preview') {
      setShowPreviewModal(true);
      setShowCompanyModal(false);
    } else {
      setShowCompanyModal(false);
      setShowPreviewModal(false);
    }
  }, [currentSubTool]);

  // Auto-persist draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const handleStateChange = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleApplyPreset = (preset) => {
    setState((prev) => ({
      ...prev,
      ...preset,
      revisionHistory: [
        { rev: preset.revNo || '0', date: new Date().toISOString().slice(0, 10), desc: 'Issued for Client Review', prep: 'QA/QC Lead', chk: 'QC Manager', app: 'Client Rep' }
      ]
    }));
    triggerToast();
    if (onNavigate) onNavigate('coating-procedure', 'cover-revision');
  };

  const handleSaveDraft = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
      const newRec = {
        ...state,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: state.docNo ? 'Draft' : 'Incomplete'
      };
      localStorage.setItem(RECORDS_KEY, JSON.stringify([newRec, ...existing]));
      triggerToast();
    } catch (e) {}
  };

  const handleLoadRecord = (rec) => {
    setState(rec);
    if (onNavigate) onNavigate('coating-procedure', 'cover-revision');
  };

  const handleResetSection = () => {
    if (window.confirm('Reset this section to defaults?')) {
      setState(INITIAL_PROCEDURE_STATE);
    }
  };

  const handleSaveCompany = (profile) => {
    setCompanyProfile(profile);
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(profile));
    } catch (e) {}
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const subTabs = [
    { id: 'hub', label: 'Overview Hub', icon: '🏠' },
    { id: 'cover-revision', label: '01. Cover & Rev', icon: '📋' },
    { id: 'scope', label: '02. Scope', icon: '🎯' },
    { id: 'reference-docs', label: '03. Ref Docs', icon: '📑' },
    { id: 'standards', label: '04. Standards', icon: '⚖️' },
    { id: 'exclusions', label: '05. Exclusions', icon: '🚫' },
    { id: 'safety', label: '06. Safety', icon: '🛡️' },
    { id: 'surface-prep', label: '07. Surface Prep', icon: '✨' },
    { id: 'coating-app', label: '08. Application', icon: '🎨' },
    { id: 'repair-plan', label: '09. Repair Plan', icon: '🔧' },
    { id: 'manufacturers', label: '10. Manufacturers', icon: '🏭' },
    { id: 'attachments', label: '11. Attachments', icon: '📎' },
    { id: 'annexure-coating', label: 'A-I Coating Systems', icon: '📊' },
    { id: 'annexure-inspection', label: 'A-II Inspection', icon: '🔍' },
    { id: 'register', label: 'Register', icon: '📁' }
  ];

  const navigateTo = (subTool) => {
    if (onNavigate) {
      onNavigate('coating-procedure', subTool);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Action Bar */}
      <div className="bg-white border border-[#D8DEE5] rounded-xl px-4 py-3.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] text-white font-bold flex items-center justify-center text-xs shadow-md font-mono">
            03
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide flex items-center gap-2 text-[#1B222C] font-rajdhani uppercase text-base">
              Coating Procedure Specification Generator
              <span className="text-[10px] bg-[#FFF4E3] text-[#E87B1E] font-bold px-2 py-0.5 rounded border border-[#F3D2A0] font-mono">
                EPC Grade
              </span>
            </h1>
            <p className="text-[11px] text-[#7E8B99] font-mono">
              {state.docNo || 'UNTITLED-PROC'} · Rev {state.revNo || '0'} · {state.projectName || 'Active Project'}
            </p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCompanyModal(true)}
            className="px-3 py-1.5 bg-[#FFF4E3] hover:bg-[#FEE9C7] border border-[#F3D2A0] text-[#9E1B1E] text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            🏢 Company Details [Pro]
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white text-xs font-bold font-rajdhani uppercase tracking-wider rounded-lg shadow-xs transition cursor-pointer"
          >
            👁️ Preview Dossier
          </button>
          <button
            type="button"
            onClick={() => navigateTo('report')}
            className="px-3.5 py-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
          >
            🖨️ Print Technical Dossier
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-[#EAF6EB] hover:bg-[#D4EDDA] border border-[#84C98A] text-[#1B5E20] text-xs font-bold rounded-lg shadow-xs transition cursor-pointer font-mono"
          >
            💾 Save Draft
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs Rail */}
      <div className="bg-white border border-[#D8DEE5] rounded-xl p-1.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {subTabs.map((tab) => {
            const isActive = currentSubTool === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateTo(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                    : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sub-Tool Router Component */}
      <div className="min-h-[500px]">
        {currentSubTool === 'hub' && (
          <ProcedureHub
            state={state}
            onNavigate={navigateTo}
            onApplyPreset={handleApplyPreset}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'cover-revision' && (
          <ProcCoverRevision
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'scope' && (
          <ProcScope
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'reference-docs' && (
          <ProcRefDocs
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'standards' && (
          <ProcStandards
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'exclusions' && (
          <ProcExclusions
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'safety' && (
          <ProcSafety
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'surface-prep' && (
          <ProcSurfacePrep
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'coating-app' && (
          <ProcCoatingApp
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'repair-plan' && (
          <ProcRepairPlan
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'manufacturers' && (
          <ProcManufacturers
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'attachments' && (
          <ProcAttachments
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'annexure-coating' && (
          <ProcAnnexureCoating
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'annexure-inspection' && (
          <ProcAnnexureInspection
            state={state}
            onChange={handleStateChange}
            onNext={() => setShowPreviewModal(true)}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {currentSubTool === 'register' && (
          <ProcReportRegister
            onLoadRecord={handleLoadRecord}
            onNewProcedure={() => {
              setState(INITIAL_PROCEDURE_STATE);
              navigateTo('cover-revision');
            }}
          />
        )}
        {currentSubTool === 'report' && (
          <ProcPrintDossier
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        )}
        {currentSubTool === 'preview' && (
          <ProcPrintDossier
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        )}
        {currentSubTool === 'watermark' && (
          <ProcWatermarkControl
            watermarkSettings={watermarkSettings}
            onChange={setWatermarkSettings}
            onReset={() => setWatermarkSettings({ text: companyProfile?.name || 'BG COATING', opacity: 0.08, rotation: -30, enabled: true })}
          />
        )}
        {currentSubTool === 'company-details' && (
          <ProcWatermarkControl
            watermarkSettings={watermarkSettings}
            onChange={setWatermarkSettings}
            onReset={() => setWatermarkSettings({ text: companyProfile?.name || 'BG COATING', opacity: 0.08, rotation: -30, enabled: true })}
          />
        )}
        {!subTabs.some(t => t.id === currentSubTool) && !['report', 'preview', 'watermark', 'company-details'].includes(currentSubTool) && (
          <ProcedureHub
            state={state}
            onNavigate={navigateTo}
            onApplyPreset={handleApplyPreset}
            onReset={handleResetSection}
          />
        )}
      </div>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-xl font-semibold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span>✓</span> Procedure record saved successfully!
        </div>
      )}

      {/* Company Modal */}
      {showCompanyModal && (
        <ProcCompanyModal
          companyProfile={companyProfile}
          onSave={handleSaveCompany}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <ProcPreviewModal
          state={state}
          companyProfile={companyProfile}
          watermarkSettings={watermarkSettings}
          onClose={() => setShowPreviewModal(false)}
          onPrint={() => {
            setShowPreviewModal(false);
            navigateTo('report');
          }}
        />
      )}
    </div>
  );
}
