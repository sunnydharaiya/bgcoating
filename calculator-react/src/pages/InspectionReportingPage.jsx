// src/pages/InspectionReportingPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Layers, 
  Thermometer, 
  Camera, 
  ShieldCheck, 
  SlidersHorizontal, 
  AlertTriangle, 
  BarChart3, 
  History, 
  FileSpreadsheet, 
  Printer, 
  Building2, 
  Stamp, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  Save, 
  Eye, 
  CheckCircle2, 
  Sliders,
  ChevronDown,
  Hammer
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';

// Import Master Database & Initial State
import { 
  createInitialInspectionState, 
  INDUSTRY_PRESETS 
} from '../data/inspectionDatabase';

// Import Modular Sub-Tools
import InspectionHub from '../tools/inspection/InspectionHub';
import InspectionStage from '../tools/inspection/InspectionStage';
import InspectionPhotoReport from '../tools/inspection/InspectionPhotoReport';
import InspectionPullOffAdhesion from '../tools/inspection/InspectionPullOffAdhesion';
import InspectionCrossCutAdhesion from '../tools/inspection/InspectionCrossCutAdhesion';
import InspectionStandardsReference from '../tools/inspection/InspectionStandardsReference';
import InspectionReworkRegister from '../tools/inspection/InspectionReworkRegister';
import InspectionDashboard from '../tools/inspection/InspectionDashboard';
import InspectionReportRegister from '../tools/inspection/InspectionReportRegister';
import InspectionMasterList from '../tools/inspection/InspectionMasterList';
import InspectionCompanyDetailsModal, { DEFAULT_BG_COMPANY } from '../tools/inspection/InspectionCompanyDetailsModal';
import InspectionWatermarkControl, { DEFAULT_WATERMARK } from '../tools/inspection/InspectionWatermarkControl';
import InspectionPreviewModal from '../tools/inspection/InspectionPreviewModal';
import InspectionReportView from '../tools/inspection/InspectionReportView';
import ErrorBoundary from '../components/ErrorBoundary';

const STORAGE_DRAFT_KEY = 'bg_os_inspection_draft';
const COMPANY_STORAGE_KEY = 'bg_company_profile';
const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';

export default function InspectionReportingPage({ 
  currentSubTool = 'hub', 
  activeSubTool = 'hub',
  onNavigate 
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const activeSub = currentSubTool || activeSubTool || 'hub';
  const [currentSection, setCurrentSection] = useState(activeSub);

  // Modals state
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Master Inspection State with localStorage draft caching
  const [state, setState] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error('Error loading cached inspection draft:', err);
    }
    return createInitialInspectionState();
  });

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_BG_COMPANY;
  });

  // Watermark Settings State
  const [watermarkSettings, setWatermarkSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(WATERMARK_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_WATERMARK;
  });

  // Sync external routing
  useEffect(() => {
    if (activeSub) {
      if (activeSub === 'company_details' || activeSub === 'company-details' || activeSub === 'company') {
        setCompanyModalOpen(true);
        setPreviewModalOpen(false);
      } else if (activeSub === 'preview') {
        setPreviewModalOpen(true);
        setCompanyModalOpen(false);
      } else {
        setCompanyModalOpen(false);
        setPreviewModalOpen(false);
        setCurrentSection(activeSub);
      }
    }
  }, [activeSub]);

  // Autosave draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to autosave inspection draft:', e);
    }
  }, [state]);

  const handleSectionChange = (secId) => {
    if (secId === 'company_details' || secId === 'company-details' || secId === 'company') {
      setCompanyModalOpen(true);
      if (onNavigate) onNavigate('inspection-reporting', 'company');
      return;
    }
    if (secId === 'preview') {
      setPreviewModalOpen(true);
      if (onNavigate) onNavigate('inspection-reporting', 'preview');
      return;
    }

    setCurrentSection(secId);
    if (onNavigate) {
      onNavigate('inspection-reporting', secId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State Updaters
  const handleUpdateStage = (stageId, updatedStage) => {
    setState(prev => ({
      ...prev,
      stages: {
        ...(prev.stages || {}),
        [stageId]: updatedStage
      }
    }));
  };

  const handleUpdatePhotoReport = (nextPhotos) => {
    setState(prev => ({ ...prev, photoReport: nextPhotos }));
  };

  const handleUpdatePullOff = (nextPullOff) => {
    setState(prev => ({ ...prev, pullOffAdhesion: nextPullOff }));
  };

  const handleUpdateCrossCut = (nextCrossCut) => {
    setState(prev => ({ ...prev, crossCutAdhesion: nextCrossCut }));
  };

  const handleUpdateReworkLog = (nextRework) => {
    setState(prev => ({ ...prev, reworkLog: nextRework }));
  };

  const handleSaveCompanyProfile = (newProfile) => {
    setCompanyProfile(newProfile);
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(newProfile));
  };

  const handleSaveWatermark = (newWatermark) => {
    setWatermarkSettings(newWatermark);
    localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(newWatermark));
  };

  // Apply 1-Click Industry Preset
  const handleApplyPreset = (preset) => {
    setState(prev => {
      const nextStages = { ...(prev.stages || {}) };
      
      // Update stage 1
      if (preset.stages.s1) {
        nextStages.s1 = {
          ...nextStages.s1,
          surfacePrep: {
            ...nextStages.s1.surfacePrep,
            abrasiveType: preset.stages.s1.abrasive || nextStages.s1.surfacePrep?.abrasiveType,
            meshSize: preset.stages.s1.mesh || nextStages.s1.surfacePrep?.meshSize
          },
          paintDetails: {
            ...nextStages.s1.paintDetails,
            manufacturer: preset.stages.s1.paintMfr || nextStages.s1.paintDetails?.manufacturer,
            productName: preset.stages.s1.paintName || nextStages.s1.paintDetails?.productName,
            shadeRal: preset.stages.s1.ral || nextStages.s1.paintDetails?.shadeRal,
            batchA: preset.stages.s1.batchA || nextStages.s1.paintDetails?.batchA,
            batchB: preset.stages.s1.batchB || nextStages.s1.paintDetails?.batchB
          },
          dftRecord: {
            ...nextStages.s1.dftRecord,
            minDft: preset.stages.s1.dftMin || nextStages.s1.dftRecord?.minDft,
            maxDft: preset.stages.s1.dftMax || nextStages.s1.dftRecord?.maxDft
          }
        };
      }

      // Update stage 2
      if (preset.stages.s2) {
        nextStages.s2 = {
          ...nextStages.s2,
          paintDetails: {
            ...nextStages.s2.paintDetails,
            manufacturer: preset.stages.s2.paintMfr || nextStages.s2.paintDetails?.manufacturer,
            productName: preset.stages.s2.paintName || nextStages.s2.paintDetails?.productName,
            shadeRal: preset.stages.s2.ral || nextStages.s2.paintDetails?.shadeRal,
            batchA: preset.stages.s2.batchA || nextStages.s2.paintDetails?.batchA,
            batchB: preset.stages.s2.batchB || nextStages.s2.paintDetails?.batchB
          },
          dftRecord: {
            ...nextStages.s2.dftRecord,
            minDft: preset.stages.s2.dftMin || nextStages.s2.dftRecord?.minDft,
            maxDft: preset.stages.s2.dftMax || nextStages.s2.dftRecord?.maxDft
          }
        };
      }

      // Update stage 3
      if (preset.stages.s3) {
        nextStages.s3 = {
          ...nextStages.s3,
          paintDetails: {
            ...nextStages.s3.paintDetails,
            manufacturer: preset.stages.s3.paintMfr || nextStages.s3.paintDetails?.manufacturer,
            productName: preset.stages.s3.paintName || nextStages.s3.paintDetails?.productName,
            shadeRal: preset.stages.s3.ral || nextStages.s3.paintDetails?.shadeRal,
            batchA: preset.stages.s3.batchA || nextStages.s3.paintDetails?.batchA,
            batchB: preset.stages.s3.batchB || nextStages.s3.paintDetails?.batchB
          },
          dftRecord: {
            ...nextStages.s3.dftRecord,
            minDft: preset.stages.s3.dftMin || nextStages.s3.dftRecord?.minDft,
            maxDft: preset.stages.s3.dftMax || nextStages.s3.dftRecord?.maxDft
          }
        };
      }

      return {
        ...prev,
        stages: nextStages
      };
    });

    addToast('Preset Specs Applied', `Loaded "${preset.title}" into all inspection stages.`, 'success');
  };

  const handleResetWorkspace = () => {
    if (window.confirm('Reset all inspection sheets and return to clean default values?')) {
      const fresh = createInitialInspectionState();
      setState(fresh);
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(fresh));
      addToast('Workspace Reset', 'Inspection sheets restored to default state.', 'info');
    }
  };

  const handleOpenGuideline = () => {
    openGuideline({
      title: 'Daily Coating Inspection Report (CIR) Standards',
      standards: [
        'ISO 8501-1 Visual Cleanliness',
        'ISO 8502-4 Climatic Condition Monitoring',
        'SSPC-PA 2 Dry Film Thickness Protocol',
        'ASTM D4541 Hydraulic Pull-off Adhesion',
        'ASTM D3359 Cross-Cut Tape Adhesion',
        'ISO 19840 Rough Surface DFT Measurement'
      ],
      overview: 'Module 09 digitizes daily QA/QC inspection records, 24-hour ambient psychrometric logs, multi-coat DFT spot distributions, ASTM D4541 hydraulic pull-off adhesion, and photo reporting.',
      formula: 'Dew Point Margin: ΔT = T_steel - T_dewpoint ≥ 3.0°C\nSSPC-PA 2 Spot Rule: 5 spots (≤ 10 m²), 10 spots (10–30 m²), 15 spots (30–100 m²)\nLower Bound: 0.80 × Min NDFT | Upper Bound: 1.20 × Max Allowable',
      rules: [
        'Steel temperature must be at least 3.0°C above the dew point at all times during abrasive blasting and coating application.',
        'SSPC-PA 2 Level 3 requires spot readings to average within specified NDFT range with no spot below 80% or above 120%.',
        'Hydraulic pull-off dollies must be allowed to cure for at least 24 hours before tensile pull.',
        'If glue failure exceeds 50% on ASTM D4541 pull-off dolly, the test is invalid and must be re-tested.'
      ],
      advice: 'Ensure all gauge serial numbers and probe calibration expiry dates are recorded before sign-off.'
    });
  };

  // Listen for Top Header Actions (preview, save-draft, register, reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const action = e.detail?.action;
      if (action === 'save-draft') {
        try {
          localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(state));
          addToast('Draft Saved', 'Daily Coating Inspection draft saved to storage.', 'success');
        } catch (err) {
          console.error(err);
        }
      } else if (action === 'preview') {
        setPreviewModalOpen(true);
      } else if (action === 'register') {
        handleSectionChange('report_register');
      } else if (action === 'reset') {
        handleResetWorkspace();
      }
    };

    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [state]);

  // Sub-Navigation Rail Items
  const railItems = [
    { id: 'hub', label: 'Hub Overview', icon: Sparkles },
    { id: 's1', label: 's1 · Blasting & Primer', icon: Hammer, badge: 'Stage 1' },
    { id: 's2', label: 's2 · 1st Intermediate', icon: Layers, badge: 'Stage 2' },
    { id: 's3', label: 's3 · 2nd Intermediate', icon: Layers, badge: 'Stage 3' },
    { id: 's4', label: 's4 · 3rd Topcoat', icon: Layers, badge: 'Stage 4' },
    { id: 'photo', label: 'Photo Evidence Grid', icon: Camera, badge: '5-Col' },
    { id: 'pull', label: 'Pull-Off Adhesion', icon: ShieldCheck, badge: 'D4541' },
    { id: 'cross', label: 'Cross-Cut Adhesion', icon: SlidersHorizontal, badge: 'D3359' },
    { id: 'std', label: 'Standards Matrix', icon: BookOpen },
    { id: 'refp', label: 'Pull-Off Guide', icon: ShieldCheck, badge: 'Ref' },
    { id: 'refc', label: 'Cross-Cut Guide', icon: SlidersHorizontal, badge: 'Ref' },
    { id: 'rwkreg', label: 'Rework Register', icon: AlertTriangle, badge: 'NCR PRO' },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3, badge: 'BI PRO' },
    { id: 'master', label: 'Master Systems', icon: Layers, badge: 'PRO' },
    { id: 'report_register', label: 'Reports Register', icon: History },
    { id: 'report', label: 'Print Dossier', icon: Printer, isPro: true }
  ];

  return (
    <div className={`space-y-6 ${currentSection === 'hub' ? 'max-w-6xl mx-auto' : 'max-w-7xl mx-auto'} pb-16 animate-in fade-in duration-200`}>
      
      {/* 1. Master Header Action Bar (Hidden on Hub view) */}
      {currentSection !== 'hub' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                QA/QC Module 09 · Coating Inspection &amp; Reporting
              </span>
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
                Coating Inspection, Adhesion Test &amp; Photo Reporting
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Standardized inspection suite for surface prep, 24-hr psychrometrics, multi-coat DFT, ASTM D4541 pull-off adhesion, and photo reporting.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenGuideline}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Standards Guide
            </button>

            <button
              onClick={() => setCompanyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] text-xs font-bold transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#E87B1E]" />
              Company Details
            </button>

            <button
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white text-xs font-bold font-rajdhani uppercase tracking-wider shadow-xs transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Dossier
            </button>

            <button
              onClick={handleResetWorkspace}
              className="p-2 rounded-xl border border-[#D8DEE5] text-[#7E8B99] hover:text-[#C62828] hover:bg-red-50 transition cursor-pointer"
              title="Reset Workspace"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Horizontal Scrollable Sub-Navigation Rail (Hidden on Hub view) */}
      {currentSection !== 'hub' && (
        <div className="bg-white border border-[#D8DEE5] rounded-2xl p-1.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] overflow-x-auto select-none flex items-center gap-1">
          {railItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id || (item.id === 'report_register' && currentSection === 'register');

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                    : 'text-[#4E5B6A] hover:text-[#1B222C] hover:bg-[#F7F8FA]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7E8B99]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F7F8FA] border border-[#CBD5E1] text-[#4E5B6A]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Sub-Component Router Switcher with Error Boundary */}
      <ErrorBoundary title="Inspection Section">
        <div className="min-h-[500px]">
          {currentSection === 'hub' && (
            <InspectionHub
              state={state}
              onNavigate={handleSectionChange}
              onApplyPreset={handleApplyPreset}
              onOpenCompany={() => setCompanyModalOpen(true)}
              onOpenPreview={() => setPreviewModalOpen(true)}
              onOpenPrint={() => window.print()}
              onNewGeneration={() => {
                handleResetWorkspace();
                handleSectionChange('s1');
              }}
            />
          )}

          {(currentSection === 's1' || currentSection === 's2' || currentSection === 's3' || currentSection === 's4') && (
            <InspectionStage
              stageId={currentSection}
              state={state}
              onChangeStageState={handleUpdateStage}
              onNavigateStage={handleSectionChange}
            />
          )}

          {currentSection === 'photo' && (
            <InspectionPhotoReport
              photoReport={state.photoReport}
              onUpdatePhotoReport={handleUpdatePhotoReport}
            />
          )}

          {currentSection === 'pull' && (
            <InspectionPullOffAdhesion
              pullOffData={state.pullOffAdhesion}
              onUpdatePullOff={handleUpdatePullOff}
            />
          )}

          {currentSection === 'cross' && (
            <InspectionCrossCutAdhesion
              crossCutData={state.crossCutAdhesion}
              onUpdateCrossCut={handleUpdateCrossCut}
            />
          )}

          {currentSection === 'rwkreg' && (
            <InspectionReworkRegister
              reworkLog={state.reworkLog}
              onUpdateReworkLog={handleUpdateReworkLog}
            />
          )}

          {currentSection === 'dashboard' && (
            <InspectionDashboard state={state} />
          )}

          {(currentSection === 'std' || currentSection === 'refp' || currentSection === 'refc') && (
            <InspectionStandardsReference 
              key={currentSection}
              initialTab={currentSection} 
              onTabChange={handleSectionChange}
            />
          )}

          {currentSection === 'master' && (
            <InspectionMasterList onApplyPreset={handleApplyPreset} />
          )}

          {(currentSection === 'report_register' || currentSection === 'register') && (
            <InspectionReportRegister
              currentState={state}
              onLoadReport={(loaded) => setState(loaded)}
              onOpenPreview={() => setPreviewModalOpen(true)}
            />
          )}

          {(currentSection === 'report' || currentSection === 'xlprint' || currentSection === 'print') && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Technical Print Dossier Preview</h3>
                  <p className="text-xs text-slate-500">Official ISO format ready for client submission &amp; PDF generation.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
              <InspectionReportView
                state={state}
                companyProfile={companyProfile}
                watermarkSettings={watermarkSettings}
              />
            </div>
          )}

          {currentSection === 'watermark' && (
            <InspectionWatermarkControl
              watermarkSettings={watermarkSettings}
              onUpdateWatermark={handleSaveWatermark}
            />
          )}
        </div>
      </ErrorBoundary>

      {/* Global Modals */}
      <InspectionCompanyDetailsModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        companyProfile={companyProfile}
        onSaveProfile={handleSaveCompanyProfile}
      />

      <InspectionPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        state={state}
        companyProfile={companyProfile}
        watermarkSettings={watermarkSettings}
      />

    </div>
  );
}
