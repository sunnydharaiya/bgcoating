import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_PROCEDURE_STATE } from '../data/procedureDatabase';
import { procedureService } from '../services/procedureService';

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
import ProcProjectMasterModal from '../tools/procedure/ProcProjectMasterModal';

const DRAFT_KEY = 'bg_os_procedure_draft';
const RECORDS_KEY = 'bg_os_procedure_records';
const COMPANY_KEY = 'bg_company_profile';

const ALIAS_MAP = {
  'sec-2': 'cover-revision',
  'cover_revision': 'cover-revision',
  'cover-revision': 'cover-revision',
  'sec-3': 'scope',
  'scope': 'scope',
  'sec-4': 'reference-docs',
  'reference_docs': 'reference-docs',
  'reference-docs': 'reference-docs',
  'ref-docs': 'reference-docs',
  'sec-5': 'standards',
  'standards': 'standards',
  'sec-6': 'exclusions',
  'exclusions': 'exclusions',
  'sec-7': 'safety',
  'safety': 'safety',
  'sec-8': 'surface-prep',
  'surface_prep': 'surface-prep',
  'surface-prep': 'surface-prep',
  'sec-9': 'coating-app',
  'coating_app': 'coating-app',
  'coating-app': 'coating-app',
  'sec-10': 'repair-plan',
  'repair_plan': 'repair-plan',
  'repair-plan': 'repair-plan',
  'sec-11': 'manufacturers',
  'manufacturers': 'manufacturers',
  'sec-12': 'attachments',
  'annexures': 'attachments',
  'attachments': 'attachments',
  'sec-anx-1': 'annexure-coating',
  'annexure_coating': 'annexure-coating',
  'annexure-coating': 'annexure-coating',
  'sec-anx-2': 'annexure-inspection',
  'annexure_inspection': 'annexure-inspection',
  'annexure-inspection': 'annexure-inspection',
  'hub': 'hub',
  'home': 'hub',
  'register': 'register',
  'report': 'report',
  'print': 'report',
  'preview': 'preview',
  'company-details': 'company-details',
  'company_details': 'company-details',
  'watermark': 'watermark',
  'project-master': 'project-master'
};

export default function CoatingProcedurePage({ currentSubTool = 'hub', onNavigate }) {
  const resolvedSubTool = ALIAS_MAP[currentSubTool] || currentSubTool || 'hub';

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
  const [previewRecord, setPreviewRecord] = useState(null);
  const [showProjectMasterModal, setShowProjectMasterModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [saveToast, setSaveToast] = useState({ show: false, message: '' });

  const hasLoadedInitialDraftRef = useRef(false);
  const saveDraftTimeoutRef = useRef(null);

  // Load remote working draft or fallback to localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadDraft = async () => {
      try {
        const draft = await procedureService.getActiveDraft();
        if (draft && isMounted) {
          setState(draft);
          if (draft.status === 'Approved') {
            setIsApproved(true);
          }
        }
      } catch (e) {
        console.warn('[CoatingProcedurePage] Error fetching remote draft:', e);
      } finally {
        if (isMounted) {
          hasLoadedInitialDraftRef.current = true;
        }
      }
    };
    loadDraft();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync route param with modals
  useEffect(() => {
    if (resolvedSubTool === 'company-details') {
      setShowCompanyModal(true);
      setShowPreviewModal(false);
      setShowProjectMasterModal(false);
    } else if (resolvedSubTool === 'preview') {
      setShowPreviewModal(true);
      setShowCompanyModal(false);
      setShowProjectMasterModal(false);
    } else if (resolvedSubTool === 'project-master') {
      setShowProjectMasterModal(true);
      setShowCompanyModal(false);
      setShowPreviewModal(false);
    } else {
      setShowCompanyModal(false);
      setShowPreviewModal(false);
      setShowProjectMasterModal(false);
    }
  }, [resolvedSubTool]);

  // Listen to Global Top Header Action Events
  useEffect(() => {
    const handleAction = (e) => {
      const page = e.detail?.page;
      if (page === 'coating-procedure' || page === 'procedure') {
        const action = e.detail?.action;
        if (action === 'preview') {
          setShowPreviewModal(true);
        } else if (action === 'save-draft') {
          handleSaveDraft();
        } else if (action === 'validate') {
          setIsApproved(prev => !prev);
          triggerToast(!isApproved ? 'Procedure validated and approved!' : 'Reverted to Draft status');
        } else if (action === 'register') {
          navigateTo('register');
        } else if (action === 'reset') {
          handleResetSection();
        } else if (action === 'new-generation') {
          handleNewGeneration();
        } else if (action === 'continue-editing') {
          navigateTo('cover-revision');
        } else if (action === 'copy-procedure') {
          handleCopyProcedure();
        } else if (action === 'open-project-master') {
          setShowProjectMasterModal(true);
        }
      }
    };

    window.addEventListener('bg_header_action', handleAction);
    return () => window.removeEventListener('bg_header_action', handleAction);
  }, [state, isApproved]);

  // Auto-persist working draft to backend (debounced 800ms) and local storage
  useEffect(() => {
    if (!hasLoadedInitialDraftRef.current) return;

    if (saveDraftTimeoutRef.current) {
      clearTimeout(saveDraftTimeoutRef.current);
    }

    saveDraftTimeoutRef.current = setTimeout(() => {
      procedureService.saveActiveDraft({
        ...state,
        status: isApproved ? 'Approved' : (state.docNo ? 'Draft' : 'Incomplete')
      });
    }, 800);

    return () => {
      if (saveDraftTimeoutRef.current) {
        clearTimeout(saveDraftTimeoutRef.current);
      }
    };
  }, [state, isApproved]);

  const handleStateChange = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleApplyPreset = (preset) => {
    const updated = {
      ...state,
      ...preset,
      revisionHistory: [
        { rev: preset.revNo || '0', date: new Date().toISOString().slice(0, 10), desc: 'Issued for Client Review', prep: 'QA/QC Lead', chk: 'QC Manager', app: 'Client Rep' }
      ]
    };
    setState(updated);
    procedureService.saveActiveDraft(updated);
    triggerToast('Industry standard procedure preset applied!');
    navigateTo('cover-revision');
  };

  const handleSaveDraft = async () => {
    try {
      const toSave = {
        ...state,
        status: isApproved ? 'Approved' : (state.docNo ? 'Draft' : 'Incomplete')
      };
      await procedureService.saveReport(toSave);
      await procedureService.saveActiveDraft(toSave);
      triggerToast('Procedure saved to register & working draft!');
    } catch (e) {
      triggerToast('Procedure saved locally.');
    }
  };

  const handleLoadRecord = (rec) => {
    const loadedData = rec.data || rec;
    setState(loadedData);
    setIsApproved((rec.status || loadedData.status) === 'Approved');
    procedureService.saveActiveDraft(loadedData);
    triggerToast(`Loaded procedure: ${rec.docNo || loadedData.docNo || 'Record'}`);
    navigateTo('cover-revision');
  };

  const handleResetSection = async () => {
    if (window.confirm('Reset all procedure fields to initial blank state? This will clear the active working draft.')) {
      setState(INITIAL_PROCEDURE_STATE);
      setIsApproved(false);
      await procedureService.clearActiveDraft();
      triggerToast('Procedure reset to defaults.');
    }
  };

  const handleNewGeneration = async () => {
    setState(INITIAL_PROCEDURE_STATE);
    setIsApproved(false);
    await procedureService.clearActiveDraft();
    triggerToast('Started new procedure — enter cover & revision details.');
    navigateTo('cover-revision');
  };

  const handleCopyProcedure = async () => {
    try {
      const cloned = {
        ...state,
        id: undefined,
        docNo: `${state.docNo || 'BG-PROC'}-COPY`,
        status: 'Draft',
        revNo: 'A'
      };
      await procedureService.saveReport(cloned);
      triggerToast('Procedure cloned and saved to register!');
    } catch (e) {
      triggerToast('Procedure cloned locally.');
    }
  };

  const handleSelectProjectFromMaster = (proj) => {
    setState(prev => ({
      ...prev,
      projectName: proj.projectName || prev.projectName,
      clientName: proj.clientName || prev.clientName,
      docNo: proj.docNo || prev.docNo,
      equipmentTag: proj.tag || prev.equipmentTag,
      projectNumber: proj.projectNum || prev.projectNumber,
      siteLocation: proj.location || prev.siteLocation
    }));
    triggerToast(`Project details auto-filled from Master List: ${proj.projectName}`);
  };

  const handleSaveCompany = (profile) => {
    setCompanyProfile(profile);
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(profile));
      triggerToast('Company branding profile updated!');
    } catch (e) {}
  };

  const triggerToast = (msg = 'Saved successfully!') => {
    setSaveToast({ show: true, message: msg });
    setTimeout(() => setSaveToast({ show: false, message: '' }), 2500);
  };

  const navigateTo = (subTool) => {
    const target = ALIAS_MAP[subTool] || subTool;
    if (onNavigate) {
      onNavigate('coating-procedure', target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subTabs = [
    { id: 'hub', label: 'Home Overview', icon: '🏠' },
    { id: 'cover-revision', label: '1. Cover & Rev', icon: '📋' },
    { id: 'scope', label: '2. Scope', icon: '🎯' },
    { id: 'reference-docs', label: '3. Ref Docs', icon: '📑' },
    { id: 'standards', label: '4. Standards', icon: '⚖️' },
    { id: 'exclusions', label: '5. Exclusions', icon: '🚫' },
    { id: 'safety', label: '6. Safety', icon: '🛡️' },
    { id: 'surface-prep', label: '7. Surface Prep', icon: '✨' },
    { id: 'coating-app', label: '8. Coating App', icon: '🎨' },
    { id: 'repair-plan', label: '9. Repair Plan', icon: '🔧' },
    { id: 'manufacturers', label: '10. Manufacturers', icon: '🏭' },
    { id: 'attachments', label: '11. Annexures', icon: '📎' },
    { id: 'annexure-coating', label: 'A-1 Systems', icon: '📊' },
    { id: 'annexure-inspection', label: 'A-2 Inspection', icon: '🔍' },
    { id: 'register', label: 'Register', icon: '📂' }
  ];

  const isPrintOrPreview = resolvedSubTool === 'report' || resolvedSubTool === 'preview';
  const showSubRail = !isPrintOrPreview;
  const isSectionFormView = showSubRail && resolvedSubTool !== 'hub' && resolvedSubTool !== 'register';

  return (
    <div className="space-y-6 font-sans">
      
      {/* PROCEDURE EDITOR TOP BARS (When viewing a specific section) */}
      {showSubRail && (
        <div className="space-y-3">
          {/* Approved status banner */}
          {isApproved && isSectionFormView && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between text-emerald-900 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold">
                    This procedure is APPROVED (Rev {state.revNo || 'R0'}) — workflow locked for controlled printing.
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Click Validate on the top bar again to revert to Draft for further edits.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('report')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer shrink-0"
              >
                🖨️ Print Dossier [PRO]
              </button>
            </div>
          )}

          {/* Project Setup Action Bar (Matches ref-2.html) */}
          {isSectionFormView && (
            <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#F7EFE1] border border-[#E8D7BE] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center text-sm font-bold border border-amber-500/30">
                  🗂
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8B0E16]">
                    Project Setup · Master Integration
                  </div>
                  <div className="text-[11px] text-[#7E634F]">
                    Create a project once in <strong>Project Creation</strong> to permanently register it. Open <strong>Project Master</strong> to auto-fill metadata.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProjectMasterModal(true)}
                  className="px-3 py-1.5 bg-[#8B0E16] hover:bg-[#6E0C12] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Project Creation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectMasterModal(true)}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-[#D8C2A7] text-[#8B0E16] text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>🗂</span>
                  <span>Project Master</span>
                </button>
              </div>
            </div>
          )}

          {/* Horizontal Section Rail */}
          <div className="bg-white border border-[#E6E8EC] rounded-xl p-1.5 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {subTabs.map((tab) => {
                const isActive = resolvedSubTool === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => navigateTo(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F7941D] to-[#8B0E16] text-white shadow-xs font-rajdhani uppercase tracking-wider'
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
        </div>
      )}

      {/* ACTIVE SUB-TOOL ROUTER COMPONENT */}
      <div className="min-h-[500px]">
        {resolvedSubTool === 'hub' && (
          <ProcedureHub
            state={state}
            onNavigate={navigateTo}
            onApplyPreset={handleApplyPreset}
            onReset={handleResetSection}
            onNewGeneration={handleNewGeneration}
            onCopyProcedure={handleCopyProcedure}
          />
        )}
        {resolvedSubTool === 'cover-revision' && (
          <ProcCoverRevision
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'scope' && (
          <ProcScope
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'reference-docs' && (
          <ProcRefDocs
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'standards' && (
          <ProcStandards
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'exclusions' && (
          <ProcExclusions
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'safety' && (
          <ProcSafety
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'surface-prep' && (
          <ProcSurfacePrep
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'coating-app' && (
          <ProcCoatingApp
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'repair-plan' && (
          <ProcRepairPlan
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'manufacturers' && (
          <ProcManufacturers
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'attachments' && (
          <ProcAttachments
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'annexure-coating' && (
          <ProcAnnexureCoating
            state={state}
            onChange={handleStateChange}
            onNext={navigateTo}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'annexure-inspection' && (
          <ProcAnnexureInspection
            state={state}
            onChange={handleStateChange}
            onNext={() => setShowPreviewModal(true)}
            onPrev={navigateTo}
            onReset={handleResetSection}
          />
        )}
        {resolvedSubTool === 'register' && (
          <ProcReportRegister
            state={state}
            onLoadRecord={handleLoadRecord}
            onNewProcedure={handleNewGeneration}
            onOpenPreview={(rec) => {
              setPreviewRecord(rec.data || rec);
              setShowPreviewModal(true);
            }}
            onPrint={(rec) => {
              const loadedData = rec.data || rec;
              setState(loadedData);
              navigateTo('report');
            }}
          />
        )}
        {resolvedSubTool === 'report' && (
          <ProcPrintDossier
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        )}
        {resolvedSubTool === 'preview' && (
          <ProcPrintDossier
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        )}
        {resolvedSubTool === 'watermark' && (
          <ProcWatermarkControl
            watermarkSettings={watermarkSettings}
            onChange={setWatermarkSettings}
            onReset={() => setWatermarkSettings({ text: companyProfile?.name || 'BG COATING', opacity: 0.08, rotation: -30, enabled: true })}
          />
        )}
        {resolvedSubTool === 'company-details' && (
          <ProcWatermarkControl
            watermarkSettings={watermarkSettings}
            onChange={setWatermarkSettings}
            onReset={() => setWatermarkSettings({ text: companyProfile?.name || 'BG COATING', opacity: 0.08, rotation: -30, enabled: true })}
          />
        )}
      </div>

      {/* Floating Save Toast */}
      {saveToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E9E50] text-white px-4 py-2.5 rounded-xl shadow-xl font-semibold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span>✓</span> {saveToast.message}
        </div>
      )}

      {/* Company Branding Modal */}
      {showCompanyModal && (
        <ProcCompanyModal
          companyProfile={companyProfile}
          onSave={handleSaveCompany}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {/* Dossier Preview Modal */}
      {showPreviewModal && (
        <ProcPreviewModal
          state={previewRecord || state}
          companyProfile={companyProfile}
          watermarkSettings={watermarkSettings}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewRecord(null);
          }}
          onPrint={() => {
            setShowPreviewModal(false);
            if (previewRecord) {
              setState(previewRecord);
              setPreviewRecord(null);
            }
            navigateTo('report');
          }}
        />
      )}

      {/* Project Master Modal */}
      <ProcProjectMasterModal
        isOpen={showProjectMasterModal}
        onClose={() => setShowProjectMasterModal(false)}
        onSelectProject={handleSelectProjectFromMaster}
      />
    </div>
  );
}
