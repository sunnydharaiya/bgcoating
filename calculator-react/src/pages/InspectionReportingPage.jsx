// src/pages/InspectionReportingPage.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import {
  INITIAL_BLASTER_STATE,
  calculateBlasterQualification
} from '../data/blasterDatabase';

// Sub-Tool Components (Matches Screenshots 1-9 in sc/inspection-reporting)
import BlasterFreezeBar from '../tools/blaster/BlasterFreezeBar';
import BlasterHub from '../tools/blaster/BlasterHub';
import BlasterDashboard from '../tools/blaster/BlasterDashboard';
import BlasterProjectInfo from '../tools/blaster/BlasterProjectInfo';
import BlasterTrainingTest from '../tools/blaster/BlasterTrainingTest';
import BlasterChecklist from '../tools/blaster/BlasterChecklist';
import BlasterProcess from '../tools/blaster/BlasterProcess';
import BlasterPhotoReport from '../tools/blaster/BlasterPhotoReport';
import BlasterVerdictApproval from '../tools/blaster/BlasterVerdictApproval';
import BlasterSummary from '../tools/blaster/BlasterSummary';
import BlasterRegister from '../tools/blaster/BlasterRegister';
import BlasterPrintDossier from '../tools/blaster/BlasterPrintDossier';
import BlasterCompanySheet from '../tools/blaster/BlasterCompanySheet';
import BlasterWatermarkSheet from '../tools/blaster/BlasterWatermarkSheet';

// Modals
import BlasterTestCatalogModal from '../tools/blaster/BlasterTestCatalogModal';
import BlasterApprovalModal from '../tools/blaster/BlasterApprovalModal';
import BlasterCompanyModal from '../tools/blaster/BlasterCompanyModal';
import BlasterWatermarkControl from '../tools/blaster/BlasterWatermarkControl';
import BlasterPreviewModal from '../tools/blaster/BlasterPreviewModal';
import ErrorBoundary from '../components/ErrorBoundary';

const DRAFT_KEY = 'bg_inspection_blaster_draft';
const REGISTER_KEY = 'bgcoating.inspection.reports.v1';
const COMPANY_KEY = 'bg_inspection_company';
const WATERMARK_KEY = 'bg_inspection_watermark';

// Fallback legacy draft keys to preserve previously entered data
const LEGACY_DRAFT_KEY = 'bg_blaster_draft';
const LEGACY_REGISTER_KEY = 'bgcoating.blaster.reports.v1';

const WORKFLOW_STEPS = [
  'info', 'project-operator', 'project_operator',
  'train', 'training-test', 'training_test',
  'checklist',
  'blasting', 'blasting-process', 'blasting_process',
  'photo', 'photo-report', 'photo_report',
  'verdict', 'verdict-approval', 'verdict_approval'
];

export default function InspectionReportingPage({
  currentSubTool = 'hub',
  activeSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const activeSub = currentSubTool || activeSubTool || 'hub';

  // Master State with multi-key caching
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY) || localStorage.getItem(LEGACY_DRAFT_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BLASTER_STATE;
    } catch {
      return INITIAL_BLASTER_STATE;
    }
  });

  // Saved reports master register
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTER_KEY) || localStorage.getItem(LEGACY_REGISTER_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Company Branding settings
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY) || localStorage.getItem('bg_company_profile');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'BG INDUSTRIAL COATINGS W.L.L.',
            division: 'Quality Assurance & Technical Services',
            contact: 'ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 Certified',
            logo: ''
          };
    } catch {
      return {
        name: 'BG INDUSTRIAL COATINGS W.L.L.',
        division: 'Quality Assurance & Technical Services',
        contact: 'ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 Certified',
        logo: ''
      };
    }
  });

  // Watermark settings
  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem(WATERMARK_KEY) || localStorage.getItem('bg_watermark_settings');
      return saved
        ? JSON.parse(saved)
        : {
            enabled: true,
            text: 'OFFICIAL QUALIFICATION DOSSIER',
            opacity: 0.08,
            angle: -30
          };
    } catch {
      return {
        enabled: true,
        text: 'OFFICIAL QUALIFICATION DOSSIER',
        opacity: 0.08,
        angle: -30
      };
    }
  });

  // Modal visibility states
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isWatermarkOpen, setIsWatermarkOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sync modal routing when navigated from sidebar or direct URL
  useEffect(() => {
    if (activeSub === 'company-details' || activeSub === 'company_details' || activeSub === 'company') {
      setIsCompanyOpen(true);
      setIsWatermarkOpen(false);
      setIsPreviewOpen(false);
    } else if (activeSub === 'watermark') {
      setIsWatermarkOpen(true);
      setIsCompanyOpen(false);
      setIsPreviewOpen(false);
    } else if (activeSub === 'preview') {
      setIsPreviewOpen(true);
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
    } else {
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
      setIsPreviewOpen(false);
    }
  }, [activeSub]);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save inspection draft:', e);
    }
  }, [state]);

  // Save register to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTER_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save inspection register:', e);
    }
  }, [reports]);

  // Save company settings
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company profile:', e);
    }
  }, [company]);

  // Save watermark settings
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (e) {
      console.error('Failed to save watermark settings:', e);
    }
  }, [watermark]);

  // Core Math & Metrics Evaluator
  const metrics = calculateBlasterQualification(state);

  // State update handler
  const handleStateChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Preset Applicator
  const handleApplyPreset = (preset) => {
    setState((prev) => ({
      ...prev,
      category: preset.category || prev.category,
      referenceStandard: preset.refStd || prev.referenceStandard,
      spMethod: preset.spMethod || prev.spMethod,
      abType: preset.abType || prev.abType,
      abMesh: preset.abMesh || prev.abMesh,
      spProfReq: preset.spProfReq || prev.spProfReq,
      spStdReq: preset.spStdReq || prev.spStdReq,
      coatingSystem: preset.coatingSystem || prev.coatingSystem
    }));
    addToast(`Loaded ${preset.title} preset template!`, 'success');
  };

  // Reset Qualification
  const handleReset = () => {
    if (window.confirm('Reset all qualification fields back to clean initial state?')) {
      setState(INITIAL_BLASTER_STATE);
      addToast('Reset qualification record to default template.', 'info');
    }
  };

  // Generate Report Number
  const generateReportNo = () => {
    const op = (state.operatorName || 'OPERATOR').replace(/\s+/g, '-').toUpperCase().slice(0, 8);
    const dateStr = (state.repDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const seq = (reports.length + 1).toString().padStart(3, '0');
    return `BL-QR-${dateStr}-${op}-${seq}`;
  };

  // Save Draft to Register
  const handleSaveDraft = () => {
    const repNo = state.repNo || generateReportNo();
    const newRecord = {
      ...state,
      id: state.id || `rep_${Date.now()}`,
      repNo,
      status: 'Draft',
      verdict: metrics.verdict,
      overallScore: metrics.overallScore,
      prePct: metrics.prePct,
      postPct: metrics.postPct,
      chkPct: metrics.chkPct,
      inspPct: metrics.inspPct,
      savedAt: new Date().toISOString()
    };

    setState((prev) => ({ ...prev, id: newRecord.id, repNo }));

    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === newRecord.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });

    addToast(`Saved draft qualification report (${repNo})!`, 'success');
  };

  // Approve and Lock Qualification Record
  const handleConfirmApprove = () => {
    const repNo = state.repNo || generateReportNo();
    const approvedRecord = {
      ...state,
      id: state.id || `rep_${Date.now()}`,
      repNo,
      status: 'Approved',
      verdict: metrics.verdict,
      overallScore: metrics.overallScore,
      prePct: metrics.prePct,
      postPct: metrics.postPct,
      chkPct: metrics.chkPct,
      inspPct: metrics.inspPct,
      savedAt: new Date().toISOString()
    };

    setState((prev) => ({ ...prev, id: approvedRecord.id, repNo }));

    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === approvedRecord.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = approvedRecord;
        return updated;
      }
      return [approvedRecord, ...prev];
    });

    addToast(`Validated and approved qualification dossier (${repNo})!`, 'success');
  };

  // Load report from register
  const handleLoadReport = (rep) => {
    setState(rep);
    addToast(`Loaded qualification report ${rep.repNo}!`, 'info');
    if (onNavigate) onNavigate('inspection-reporting', 'info');
  };

  // Duplicate report
  const handleDuplicateReport = (rep) => {
    const dup = {
      ...rep,
      id: `rep_${Date.now()}`,
      repNo: '',
      status: 'Draft',
      savedAt: new Date().toISOString()
    };
    setReports((prev) => [dup, ...prev]);
    addToast(`Duplicated report ${rep.repNo} as new draft.`, 'success');
  };

  // Delete report
  const handleDeleteReport = (id) => {
    if (window.confirm('Delete this qualification report from master register?')) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      addToast('Report deleted from register.', 'info');
    }
  };

  // Test catalog selection handler
  const handleSelectCatalogTest = (testItem) => {
    const currentRows = state.inspRows || [];
    const newRow = {
      p: testItem.t,
      std: testItem.std,
      req: testItem.req,
      obs: 'Inspection completed - conforms to specification',
      res: 'Pass'
    };
    setState((prev) => ({
      ...prev,
      inspRows: [...currentRows, newRow]
    }));
    addToast(`Added inspection test: ${testItem.t}`, 'success');
  };

  // Intercept Global Header Actions
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const action = e.detail?.action;
      if (action === 'save' || action === 'save-draft') handleSaveDraft();
      if (action === 'validate') setIsApprovalOpen(true);
      if (action === 'preview') setIsPreviewOpen(true);
      if (action === 'register') {
        if (onNavigate) onNavigate('inspection-reporting', 'register');
      }
      if (action === 'reset') handleReset();
      if (action === 'guideline') {
        openGuideline({
          title: 'Blaster / Operator Qualification Management System',
          category: 'Digital Quality Control & Personnel Qualification',
          standard: 'ISO 8501-1 · SSPC-SP 10 · SSPC-AB 1/2/3 · ASTM D4417 · ASTM D4228',
          description:
            'A standardized digital qualification workflow for surface preparation blasters and abrasive operators. Ensures full traceability and compliance with international oil & gas / infrastructure coating specifications.',
          tips: [
            'Record dry bulb, wet bulb, and steel temperature to verify Delta-T >= 3°C before blasting.',
            'Maintain abrasive cleanliness (conductivity <= 150 µS/cm and no oil contamination).',
            'Take 5 surface profile spot readings across the test plate and verify the average conforms to specification.',
            'Ensure all 12 critical elements of the practical assessment checklist are evaluated.'
          ]
        });
      }
    };

    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [state, metrics]);

  const nav = (sub) => {
    if (onNavigate) {
      onNavigate('inspection-reporting', sub);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render standalone printable view if in print mode
  if (activeSub === 'print' || activeSub === 'report' || activeSub === 'xlprint') {
    return (
      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen py-6 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 print:hidden">
            <button
              onClick={() => nav('hub')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition"
            >
              ← Back to Hub
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#E8700A] text-white text-xs font-bold shadow-xs hover:bg-[#F5911F] transition"
              >
                🖨 Print / Export PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <BlasterPrintDossier
              state={state}
              metrics={metrics}
              company={company}
              watermark={watermark}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen bg-[#F2F4F6] text-[#1B222C] flex flex-col transition-colors duration-200"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: 'radial-gradient(circle at 12% 10%, rgba(232,123,30,0.05) 0%, transparent 36%), radial-gradient(circle at 88% 88%, rgba(184,52,0,0.04) 0%, transparent 40%), #F2F4F6'
        }}
      >
        
        {/* HERO SECTION (Shown across workflow sheets) */}
        {WORKFLOW_STEPS.includes(activeSub) && (
          <section className="hero">
            <div className="hero-grid"></div>
            <div className="hero-in">
              <div>
                <div className="hkick"><span className="hdot"></span>Operator Qualification · Blaster · Coating Inspector</div>
                <h1 className="htit">Operator Qualification &amp;<br /><em>Assessment Report System</em></h1>
                <p className="hsub">Enterprise-grade digital qualification platform with real-time auto-calculations, ISO 8501 / SSPC / NACE / AMPP compliance logic, dew-point analysis, surface profile verification, Pre/Post training assessment, multi-stage approval workflow, operator-photo certificates and MNC-grade printable reports for EPC, refinery, offshore &amp; petrochemical operations.</p>
                <div className="hstds">
                  <span className="hstd">ISO 8501-1</span>
                  <span className="hstd">ISO 8502-3</span>
                  <span className="hstd">SSPC-AB 1/3</span>
                  <span className="hstd">SSPC VIS 1</span>
                  <span className="hstd">ASTM D4285</span>
                  <span className="hstd">ASTM D4417</span>
                  <span className="hstd">NACE / AMPP</span>
                  <span className="hstd">ASTM D4228</span>
                </div>
              </div>
              <div className="hero-side">
                <div className="hero-card">
                  <div className="hero-card-ic">📋</div>
                  <div>
                    <div className="hero-card-l">Report ID</div>
                    <div className="hero-card-v">{state.reportNo || 'BG/Blast/01'}</div>
                  </div>
                </div>
                <div className="hero-card">
                  <div className="hero-card-ic">🛡️</div>
                  <div>
                    <div className="hero-card-l">Status</div>
                    <div className="hero-card-v">{metrics.verdict === 'PASS' ? 'Approved' : 'In Progress'}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WRAP CONTAINER */}
        <div className="wrap">
          
          {/* Sticky Progress Panel (Visible only on active workflow sheets when modal is not open) */}
          {WORKFLOW_STEPS.includes(activeSub) && !isPreviewOpen && (
            <div className="frozen-top">
              <div className="prog-panel">
                <div className="prog-panel-l">
                  <div className="prog-panel-title">
                    <span className="ic">⚙️</span>QUALIFICATION WORKFLOW PROGRESS
                    <span className="stage">
                      {activeSub === 'info' ? 'STAGE 1 OF 6' :
                       activeSub === 'train' ? 'STAGE 2 OF 6' :
                       activeSub === 'checklist' ? 'STAGE 3 OF 6' :
                       activeSub === 'blasting' ? 'STAGE 4 OF 6' :
                       activeSub === 'photo' ? 'STAGE 5 OF 6' :
                       activeSub === 'verdict' ? 'STAGE 6 OF 6' :
                       'STAGE ' + (activeSub?.toUpperCase() || 'WORKFLOW')}
                    </span>
                  </div>
                  <div className="prog-bar-wrap">
                    <div className="prog-bar-fill" style={{ width: `${metrics.totalProgress || 0}%` }}></div>
                  </div>
                  <div className="prog-chips">
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'info' ? 'act' : ''}`}
                      onClick={() => nav('info')}
                    >
                      Project &amp; Operator
                      <span className="num">{metrics.stepCompletions?.info || 0}%</span>
                    </span>
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'train' ? 'act' : ''}`}
                      onClick={() => nav('train')}
                    >
                      Training &amp; Test
                      <span className="num">{metrics.stepCompletions?.train || 0}%</span>
                    </span>
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'checklist' ? 'act' : ''}`}
                      onClick={() => nav('checklist')}
                    >
                      Assessment Checklist
                      <span className="num">{metrics.stepCompletions?.checklist || 0}%</span>
                    </span>
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'blasting' ? 'act' : ''}`}
                      onClick={() => nav('blasting')}
                    >
                      Blasting Process
                      <span className="num">{metrics.stepCompletions?.blasting || 0}%</span>
                    </span>
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'photo' ? 'act' : ''}`}
                      onClick={() => nav('photo')}
                    >
                      Photographic Report
                      <span className="num">{metrics.stepCompletions?.photo || 0}%</span>
                    </span>
                    <span 
                      className={`prog-chip cursor-pointer ${activeSub === 'verdict' ? 'act' : ''}`}
                      onClick={() => nav('verdict')}
                    >
                      Verdict &amp; Approval
                      <span className="num">{metrics.stepCompletions?.verdict || 0}%</span>
                    </span>
                  </div>
                </div>
                <div className="prog-donut">
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <defs>
                      <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5911F"></stop>
                        <stop offset="50%" stopColor="#E8700A"></stop>
                        <stop offset="100%" stopColor="#B83400"></stop>
                      </linearGradient>
                    </defs>
                    <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(232,112,10,.14)" strokeWidth="7"></circle>
                    <circle 
                      cx="35" cy="35" r="28" fill="none" stroke="url(#donut-grad)" strokeWidth="7"
                      strokeDasharray={`${(metrics.totalProgress / 100) * 175.9} 175.9`}
                      strokeLinecap="round" transform="rotate(-90 35 35)"
                    ></circle>
                  </svg>
                  <div className="prog-donut-text">
                    <div className="prog-donut-pct">{Math.round(metrics.totalProgress || 0)}%</div>
                    <div className="prog-donut-lbl">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Tool Content Routing */}
          <main className="transition-all pt-4">
            {(activeSub === 'hub' || activeSub === 'home') && (
              <BlasterHub
                state={state}
                metrics={metrics}
                reports={reports}
                onNavigate={nav}
                onApplyPreset={handleApplyPreset}
                onNewGeneration={() => {
                  setState(INITIAL_BLASTER_STATE);
                  nav('info');
                }}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onOpenPrint={() => nav('print')}
              />
            )}

            {activeSub === 'dashboard' && (
              <BlasterDashboard
                state={state}
                metrics={metrics}
                onNavigate={nav}
              />
            )}

            {(activeSub === 'info' || activeSub === 'project-operator' || activeSub === 'project_operator') && (
              <BlasterProjectInfo
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {(activeSub === 'train' || activeSub === 'training-test' || activeSub === 'training_test') && (
              <BlasterTrainingTest
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {activeSub === 'checklist' && (
              <BlasterChecklist
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {(activeSub === 'blasting' || activeSub === 'blasting-process' || activeSub === 'blasting_process') && (
              <BlasterProcess
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onOpenCatalog={() => setIsCatalogOpen(true)}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {(activeSub === 'photo' || activeSub === 'photo-report' || activeSub === 'photo_report') && (
              <BlasterPhotoReport
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {(activeSub === 'verdict' || activeSub === 'verdict-approval' || activeSub === 'verdict_approval') && (
              <BlasterVerdictApproval
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onApprove={() => setIsApprovalOpen(true)}
                onReset={handleReset}
              />
            )}

            {activeSub === 'summary' && (
              <BlasterSummary
                state={state}
                onChange={handleStateChange}
                metrics={metrics}
                onNavigate={nav}
                onOpenPreview={() => setIsPreviewOpen(true)}
              />
            )}

            {(activeSub === 'register' || activeSub === 'reports' || activeSub === 'report_register') && (
              <BlasterRegister
                reports={reports}
                onLoadReport={handleLoadReport}
                onDuplicateReport={handleDuplicateReport}
                onDeleteReport={handleDeleteReport}
                onNewReport={() => {
                  setState(INITIAL_BLASTER_STATE);
                  nav('info');
                }}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onOpenPrint={() => nav('print')}
              />
            )}

            {(activeSub === 'company' || activeSub === 'company-details' || activeSub === 'company_details') && (
              <BlasterCompanySheet
                company={company}
                onChange={(field, val) => setCompany((prev) => ({ ...prev, [field]: val }))}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
              />
            )}

            {activeSub === 'watermark' && (
              <BlasterWatermarkSheet
                watermark={watermark}
                onChange={(field, val) => setWatermark((prev) => ({ ...prev, [field]: val }))}
                onNavigate={nav}
                onSaveDraft={handleSaveDraft}
                onValidate={() => setIsApprovalOpen(true)}
              />
            )}
          </main>
        </div>

        {/* Modal Dialogs Suite */}
        <BlasterTestCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
          onSelectTest={handleSelectCatalogTest}
        />

        <BlasterApprovalModal
          isOpen={isApprovalOpen}
          onClose={() => setIsApprovalOpen(false)}
          state={state}
          metrics={metrics}
          onConfirmApprove={handleConfirmApprove}
        />

        <BlasterCompanyModal
          isOpen={isCompanyOpen}
          onClose={() => {
            setIsCompanyOpen(false);
            if (activeSub === 'company-details' || activeSub === 'company_details' || activeSub === 'company') {
              nav('hub');
            }
          }}
          company={company}
          onChange={(field, val) => setCompany((prev) => ({ ...prev, [field]: val }))}
        />

        <BlasterWatermarkControl
          isOpen={isWatermarkOpen}
          onClose={() => {
            setIsWatermarkOpen(false);
            if (activeSub === 'watermark') {
              nav('hub');
            }
          }}
          watermark={watermark}
          onChange={(field, val) => setWatermark((prev) => ({ ...prev, [field]: val }))}
        />

        <BlasterPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            if (activeSub === 'preview' || activeSub === 'report') {
              nav('hub');
            }
          }}
          state={state}
          metrics={metrics}
          company={company}
          watermark={watermark}
          onApprove={() => {
            setIsPreviewOpen(false);
            setIsApprovalOpen(true);
          }}
        />

      </div>
    </ErrorBoundary>
  );
}
