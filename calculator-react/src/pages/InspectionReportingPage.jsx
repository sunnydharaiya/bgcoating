// src/pages/InspectionReportingPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import {
  createInitialInspectionState,
  INSPECTION_STAGES,
  INDUSTRY_PRESETS
} from '../data/inspectionDatabase';

// Sub-Tool Components (From calculator-react/src/tools/inspection/)
import InspectionHub from '../tools/inspection/InspectionHub';
import InspectionStage from '../tools/inspection/InspectionStage';
import InspectionPullOffAdhesion from '../tools/inspection/InspectionPullOffAdhesion';
import InspectionCrossCutAdhesion from '../tools/inspection/InspectionCrossCutAdhesion';
import InspectionStandardsReference from '../tools/inspection/InspectionStandardsReference';
import InspectionPhotoReport from '../tools/inspection/InspectionPhotoReport';
import InspectionReportRegister, { INSPECTION_STORAGE_KEY } from '../tools/inspection/InspectionReportRegister';
import InspectionReworkRegister from '../tools/inspection/InspectionReworkRegister';
import InspectionDashboard from '../tools/inspection/InspectionDashboard';
import InspectionReportView from '../tools/inspection/InspectionReportView';
import InspectionMasterList from '../tools/inspection/InspectionMasterList';

// Modals
import InspectionPreviewModal from '../tools/inspection/InspectionPreviewModal';
import InspectionCompanyDetailsModal from '../tools/inspection/InspectionCompanyDetailsModal';
import InspectionWatermarkControl, { DEFAULT_WATERMARK } from '../tools/inspection/InspectionWatermarkControl';
import ErrorBoundary from '../components/ErrorBoundary';

// Icons
import {
  ShieldCheck,
  Layers,
  ArrowLeft,
  Eye,
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Building2,
  Stamp,
  SlidersHorizontal,
  BookOpen,
  FolderKanban,
  AlertTriangle
} from 'lucide-react';

const DRAFT_KEY = 'bg_os_inspection_draft';
const LEGACY_DRAFT_KEY = 'bg_inspection_draft';
const REGISTER_KEY = INSPECTION_STORAGE_KEY || 'bg_os_inspection_reports_register';
const COMPANY_KEY = 'bg_inspection_company';
const WATERMARK_KEY = 'bg_inspection_watermark';

export default function InspectionReportingPage({
  currentSubTool = 'hub',
  activeSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const activeSub = currentSubTool || activeSubTool || 'hub';

  // Navigation dispatcher
  const nav = (sub) => {
    if (onNavigate) {
      onNavigate('inspection-reporting', sub);
    }
  };

  // Master Inspection State with localStorage caching
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY) || localStorage.getItem(LEGACY_DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse inspection draft:', e);
    }
    return createInitialInspectionState();
  });

  // Saved reports master register
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load inspection register:', e);
    }
    return [];
  });

  // Company Branding settings
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY) || localStorage.getItem('bg_company_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'BG GROUP INDUSTRIAL COATINGS LTD.',
      tagline: 'Surface Engineering, Protective Coating Inspection & QA/QC Digital Systems',
      address: 'Plot No. 44, Industrial Area, Sector-4, Gujarat, India',
      phone: '+91 98765 43210',
      email: 'qc@bgcoating.com',
      website: 'www.bgcoating.com',
      logo: null
    };
  });

  // Watermark settings
  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem(WATERMARK_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_WATERMARK || {
      enabled: false,
      text: 'CONFIDENTIAL QA/QC DOSSIER',
      opacity: 8,
      angle: -30
    };
  });

  // Active Stage ID (s1, s2, s3, s4)
  const [activeStageId, setActiveStageId] = useState(() => {
    if (['s1', 'stage-s1', 'stage_s1'].includes(activeSub)) return 's1';
    if (['s2', 'stage-s2', 'stage_s2'].includes(activeSub)) return 's2';
    if (['s3', 'stage-s3', 'stage_s3'].includes(activeSub)) return 's3';
    if (['s4', 'stage-s4', 'stage_s4'].includes(activeSub)) return 's4';
    return 's1';
  });

  // Sync activeStageId when subtool changes
  useEffect(() => {
    if (['s1', 'stage-s1', 'stage_s1'].includes(activeSub)) setActiveStageId('s1');
    else if (['s2', 'stage-s2', 'stage_s2'].includes(activeSub)) setActiveStageId('s2');
    else if (['s3', 'stage-s3', 'stage_s3'].includes(activeSub)) setActiveStageId('s3');
    else if (['s4', 'stage-s4', 'stage_s4'].includes(activeSub)) setActiveStageId('s4');
  }, [activeSub]);

  // Modal visibility states
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isWatermarkOpen, setIsWatermarkOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

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
      setPreviewRecord(null);
      setIsPreviewOpen(true);
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
    } else {
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
      setIsPreviewOpen(false);
    }
  }, [activeSub]);

  // Debounced auto-save draft to localStorage (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to auto-save inspection draft:', e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [state]);

  // Persist company profile
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (e) {}
  }, [company]);

  // Persist watermark
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (e) {}
  }, [watermark]);

  // State Updaters
  const handleUpdateStage = (stageId, updatedStage) => {
    setState((prev) => ({
      ...prev,
      stages: {
        ...(prev.stages || {}),
        [stageId]: updatedStage
      }
    }));
  };

  const handleUpdatePullOff = (updatedPullOff) => {
    setState((prev) => ({
      ...prev,
      pullOffAdhesion: updatedPullOff
    }));
    addToast('Pull-Off Adhesion Updated', 'Adhesion parameters saved.', 'success');
  };

  const handleUpdateCrossCut = (updatedCrossCut) => {
    setState((prev) => ({
      ...prev,
      crossCutAdhesion: updatedCrossCut
    }));
    addToast('Cross-Cut Adhesion Updated', 'Cross-cut parameters saved.', 'success');
  };

  const handleUpdatePhotoReport = (updatedPhotos) => {
    setState((prev) => ({
      ...prev,
      photoReport: updatedPhotos
    }));
    addToast('Photo Report Updated', 'Photographic evidence updated.', 'success');
  };

  const handleUpdateReworkLog = (updatedRework) => {
    setState((prev) => ({
      ...prev,
      reworkLog: updatedRework
    }));
    addToast('Rework Register Updated', 'NCR & rework log synchronized.', 'success');
  };

  const handleApplyPreset = (preset) => {
    if (!preset) return;
    if (window.confirm(`Apply Preset System: "${preset.name || preset.title}"? This will populate inspection stages with standard coating specifications.`)) {
      if (preset.stages) {
        setState((prev) => ({
          ...prev,
          stages: {
            ...prev.stages,
            ...preset.stages
          }
        }));
      }
      addToast('Preset Applied', `Loaded ${preset.name || preset.title} successfully.`, 'success');
      nav('coating-report');
    }
  };

  const handleLoadReport = (report) => {
    if (!report) return;
    const loadedData = report.data || report;
    setState(loadedData);
    addToast('Report Loaded', `Loaded report "${report.id || report.reportNo || 'Inspection Report'}" into active workspace.`, 'success');
    nav('coating-report');
  };

  const handlePreviewReport = (report) => {
    setPreviewRecord(report.data || report);
    setIsPreviewOpen(true);
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      addToast('Draft Saved', 'Active inspection report saved locally.', 'success');
    } catch (e) {
      addToast('Save Failed', 'Unable to save inspection draft.', 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all current inspection form fields? This will clear un-registered data.')) {
      const fresh = createInitialInspectionState();
      setState(fresh);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (e) {}
      addToast('Reset Complete', 'Initialized new inspection draft.', 'info');
      nav('hub');
    }
  };

  // Human-readable titles for breadcrumbs
  const getSubToolTitle = () => {
    switch (activeSub) {
      case 'coating-report':
      case 'stage':
      case 's1':
      case 'stage-s1':
        return 'Blasting & Priming Inspection';
      case 's2':
      case 'stage-s2':
        return '1st Intermediate Coat Inspection';
      case 's3':
      case 'stage-s3':
        return '2nd Intermediate Coat Inspection';
      case 's4':
      case 'stage-s4':
        return '3rd Topcoat Inspection';
      case 'pull-off-adhesion':
      case 'pull-off':
      case 'pull':
        return 'Pull-Off Adhesion Test (ASTM D4541)';
      case 'cross-cut-adhesion':
      case 'cross-cut':
      case 'cross':
        return 'Cross-Cut Adhesion Test (ASTM D3359)';
      case 'standards':
      case 'reference-standards':
      case 'std':
        return 'Technical References & Standards';
      case 'photo-report':
      case 'photo':
        return 'Photographic Evidence Report';
      case 'report-register':
      case 'register':
        return 'Saved Reports Register';
      case 'rework-register':
      case 'rework':
        return 'NCR & Rework Register';
      case 'dashboard':
        return 'Inspection Analytics Dashboard';
      case 'print':
      case 'report':
        return 'Certified Inspection Dossier';
      case 'master-list':
      case 'master':
        return 'Master Coating Systems Library';
      default:
        return 'Inspection Workspace';
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F3F5F8] text-[#1B222C] pb-16 font-sans">
        
        {/* Top Control FreezeBar (Hidden on Hub view) */}
        {activeSub !== 'hub' && activeSub !== 'home' && (
          <header className="sticky top-0 z-30 bg-[#131822]/95 backdrop-blur-md border-b border-white/[0.08] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => nav('hub')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition cursor-pointer"
                title="Return to Inspection Home"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Hub</span>
              </button>
              <div className="truncate">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Coating Inspection (CIR)
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {getSubToolTitle()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreviewRecord(null);
                  setIsPreviewOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#F7941D]" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
                <span className="text-[9px] font-mono bg-amber-500 text-slate-900 px-1 rounded font-bold">
                  PRO
                </span>
              </button>
            </div>
          </header>
        )}

        {/* Dynamic Tool Content Routing */}
        <div className={activeSub === 'hub' || activeSub === 'home' ? 'w-full px-4 sm:px-6 lg:px-8 pt-4' : 'w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-6'}>
          <main className="transition-all">
            {/* 1. Hub Overview */}
            {(activeSub === 'hub' || activeSub === 'home') && (
              <InspectionHub
                state={state}
                reports={reports}
                onNavigate={nav}
                onNewGeneration={() => {
                  setState(createInitialInspectionState());
                  nav('coating-report');
                }}
                onOpenPreview={() => {
                  setPreviewRecord(null);
                  setIsPreviewOpen(true);
                }}
                onOpenPrint={() => window.print()}
              />
            )}

            {/* 2. Coating Inspection Stages */}
            {['coating-report', 'stage', 's1', 'stage-s1', 'stage_s1', 's2', 'stage-s2', 'stage_s2', 's3', 'stage-s3', 'stage_s3', 's4', 'stage-s4', 'stage_s4'].includes(activeSub) && (
              <InspectionStage
                stageId={activeStageId}
                state={state}
                onChangeStageState={handleUpdateStage}
                onNavigateStage={(stgId) => {
                  setActiveStageId(stgId);
                  nav(stgId);
                }}
              />
            )}

            {/* 3. Pull-Off Adhesion */}
            {['pull-off-adhesion', 'pull-off', 'pull', 'pull_off_adhesion'].includes(activeSub) && (
              <InspectionPullOffAdhesion
                pullOffData={state.pullOffAdhesion || {}}
                onUpdatePullOff={handleUpdatePullOff}
              />
            )}

            {/* 4. Cross-Cut Adhesion */}
            {['cross-cut-adhesion', 'cross-cut', 'cross', 'cross_cut_adhesion'].includes(activeSub) && (
              <InspectionCrossCutAdhesion
                crossCutData={state.crossCutAdhesion || {}}
                onUpdateCrossCut={handleUpdateCrossCut}
              />
            )}

            {/* 5. References & Standards */}
            {['standards', 'reference-standards', 'reference_standards', 'std', 'refp', 'refc'].includes(activeSub) && (
              <InspectionStandardsReference
                initialTab={activeSub === 'refp' ? 'refp' : activeSub === 'refc' ? 'refc' : 'std'}
                onTabChange={(tabId) => nav(tabId)}
              />
            )}

            {/* 6. Photo Evidence Report */}
            {['photo-report', 'photo', 'photo_report'].includes(activeSub) && (
              <InspectionPhotoReport
                photoReport={state.photoReport || []}
                onUpdatePhotoReport={handleUpdatePhotoReport}
              />
            )}

            {/* 7. Saved Reports Register */}
            {['report-register', 'register', 'reports', 'report_register'].includes(activeSub) && (
              <InspectionReportRegister
                currentState={state}
                onLoadReport={handleLoadReport}
                onOpenPreview={handlePreviewReport}
              />
            )}

            {/* 8. Rework & NCR Register */}
            {['rework-register', 'rework', 'rework_register', 'rwkreg'].includes(activeSub) && (
              <InspectionReworkRegister
                reworkLog={state.reworkLog || []}
                onUpdateReworkLog={handleUpdateReworkLog}
              />
            )}

            {/* 9. Analytics Dashboard */}
            {activeSub === 'dashboard' && (
              <InspectionDashboard state={state} />
            )}

            {/* 10. Print / Certified Dossier View */}
            {['print', 'report', 'xlprint'].includes(activeSub) && (
              <div className="max-w-5xl mx-auto py-6">
                <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Certified Inspection Dossier (CIR)</h3>
                      <p className="text-xs text-slate-500">Official A4 Formatted Quality Documentation</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Dossier</span>
                  </button>
                </div>
                <InspectionReportView
                  state={state}
                  companyProfile={company}
                  watermarkSettings={watermark}
                />
              </div>
            )}

            {/* 11. Master Systems Library */}
            {['master-list', 'master', 'master-systems', 'master_systems', 'master_list'].includes(activeSub) && (
              <InspectionMasterList onApplyPreset={handleApplyPreset} />
            )}

            {/* 12. Watermark Control Inline View */}
            {activeSub === 'watermark' && (
              <InspectionWatermarkControl
                watermarkSettings={watermark}
                onUpdateWatermark={(wm) => {
                  setWatermark(wm);
                  addToast('Watermark Updated', 'Document overlay security updated.', 'success');
                }}
              />
            )}
          </main>
        </div>

        {/* Modal Dialogs Suite */}
        {/* Company Profile Modal */}
        <InspectionCompanyDetailsModal
          isOpen={isCompanyOpen}
          onClose={() => {
            setIsCompanyOpen(false);
            if (activeSub === 'company-details' || activeSub === 'company_details' || activeSub === 'company') {
              nav('hub');
            }
          }}
          companyProfile={company}
          onSaveProfile={(prof) => {
            setCompany(prof);
            setIsCompanyOpen(false);
            addToast('Company Profile Saved', 'Corporate branding details updated.', 'success');
            if (activeSub === 'company-details' || activeSub === 'company_details' || activeSub === 'company') {
              nav('hub');
            }
          }}
        />

        {/* Watermark Modal */}
        <div className={isWatermarkOpen ? 'block' : 'hidden'}>
          {isWatermarkOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <InspectionWatermarkControl
                  watermarkSettings={watermark}
                  onUpdateWatermark={(wm) => {
                    setWatermark(wm);
                    setIsWatermarkOpen(false);
                    addToast('Watermark Applied', 'Security stamp configuration saved.', 'success');
                    if (activeSub === 'watermark') nav('hub');
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <InspectionPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewRecord(null);
            if (activeSub === 'preview') nav('hub');
          }}
          state={previewRecord || state}
          companyProfile={company}
          watermarkSettings={watermark}
        />

      </div>
    </ErrorBoundary>
  );
}
