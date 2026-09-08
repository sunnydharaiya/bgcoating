import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Building2,
  Thermometer,
  Camera,
  ShieldCheck,
  FileSpreadsheet,
  HardHat,
  TrendingUp,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Save,
  Printer
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import {
  INITIAL_BLASTER_STATE,
  calculateBlasterQualification
} from '../data/blasterDatabase';

// Sub-Tool Components
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

// Modals
import BlasterTestCatalogModal from '../tools/blaster/BlasterTestCatalogModal';
import BlasterApprovalModal from '../tools/blaster/BlasterApprovalModal';
import BlasterCompanyModal from '../tools/blaster/BlasterCompanyModal';
import BlasterWatermarkControl from '../tools/blaster/BlasterWatermarkControl';
import BlasterPreviewModal from '../tools/blaster/BlasterPreviewModal';

const DRAFT_KEY = 'bg_blaster_draft';
const REGISTER_KEY = 'bgcoating.blaster.reports.v1';
const COMPANY_KEY = 'bg_blaster_company';
const WATERMARK_KEY = 'bg_blaster_watermark';

export default function BlasterQualificationPage({
  currentSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Working state
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BLASTER_STATE;
    } catch {
      return INITIAL_BLASTER_STATE;
    }
  });

  // Saved reports master register
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTER_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Company Branding settings
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY);
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
      const saved = localStorage.getItem(WATERMARK_KEY);
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
    if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
      setIsCompanyOpen(true);
      setIsWatermarkOpen(false);
      setIsPreviewOpen(false);
    } else if (currentSubTool === 'watermark') {
      setIsWatermarkOpen(true);
      setIsCompanyOpen(false);
      setIsPreviewOpen(false);
    } else if (currentSubTool === 'preview' || currentSubTool === 'report') {
      setIsPreviewOpen(true);
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
    } else {
      setIsCompanyOpen(false);
      setIsWatermarkOpen(false);
      setIsPreviewOpen(false);
    }
  }, [currentSubTool]);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [state]);

  // Save register to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTER_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save register:', e);
    }
  }, [reports]);

  // Save company settings
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company:', e);
    }
  }, [company]);

  // Save watermark settings
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (e) {
      console.error('Failed to save watermark:', e);
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
    if (onNavigate) onNavigate('blaster', 'info');
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

  // Add Inspection test from catalog
  const handleSelectCatalogTest = (item) => {
    const rows = state.inspRows || [];
    const newRow = {
      p: item.t,
      std: item.std,
      req: item.req,
      obs: 'Conforms to specification',
      res: 'Pass'
    };
    handleStateChange('inspRows', [...rows, newRow]);
    addToast(`Added "${item.t}" to inspection tests!`, 'success');
  };

  // Guideline helper
  const handleOpenGuideline = () => {
    openGuideline({
      title: 'Blaster / Operator Qualification Management System',
      standards: [
        'ISO 8501-1 (Pictorial Surface Cleanliness Standards)',
        'ISO 8502-3 (Pressure-Sensitive Tape Dust Rating)',
        'ASTM D 4228 (Qualification of Coating Applicators on Steel)',
        'ASTM D 4417 (Field Measurement of Surface Profile)',
        'ASTM D 4285 (Compressed Air Cleanliness / Blotter Test)',
        'SSPC-AB 1 / AB 3 (Mineral & Slag / Metallic Abrasives)',
        'NACE / AMPP Coating Inspector Standards'
      ],
      overview:
        'Module 06 establishes an end-to-end digital qualification workflow for industrial blast cleaning operators and coating applicators. It standardizes candidate identification, theoretical examination, practical skills verification, psychrometric environmental analysis, anchor pattern profile measurements, and official multi-tier signatory approval.',
      formula:
        'Psychrometric Dew Point: Magnus-Tetens Equation\nImprovement Delta: Post-Test % − Pre-Test %\nWeighted Qualification Score:\n• Post-Test Score: 30% Weight (Min 80%)\n• Improvement Delta: 10% Weight (Min 15%)\n• Checklist Compliance: 25% Weight (Min 80% & 0 Fails)\n• Inspection Pass Rate: 25% Weight (Min 80% & 0 Fails)\n• Environmental Compliance: 10% Weight (RH ≤ 85% & MT−DP ≥ 3°C)',
      rules: [
        'Operator photograph must be portrait-oriented and clearly identifiable.',
        'Compressed air supply must pass ASTM D 4285 blotter test (zero oil/water discoloration).',
        'Nozzle pressure must be verified using a hypodermic needle gauge at the blast nozzle tip and meet ≥ 90 PSI.',
        'Relative humidity must not exceed 85% and steel surface temperature must be at least 3.0°C above the dew point.',
        'Qualification certificate is valid for 12 months provided continuous blast operations are maintained.'
      ],
      advice:
        'All three signatory stamp fields accept high-resolution digital rubber stamp uploads (PNG with transparent background recommended) for complete MNC client submission compliance.'
    });
  };

  const navTabs = [
    { id: 'hub', label: 'Hub & Overview', icon: Sparkles },
    { id: 'dashboard', label: 'Analytics', icon: TrendingUp },
    { id: 'info', label: '01. Project & Operator', icon: Building2 },
    { id: 'train', label: '02. Training & Test', icon: BookOpen },
    { id: 'checklist', label: '03. Checklist', icon: CheckCircle2 },
    { id: 'blasting', label: '04. Blasting Process', icon: Thermometer },
    { id: 'photo', label: '05. Photo Report', icon: Camera },
    { id: 'verdict', label: '06. Verdict & Sign', icon: ShieldCheck },
    { id: 'summary', label: '07. Executive Summary', icon: FileSpreadsheet },
    { id: 'register', label: '08. Register', icon: HardHat },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#1B222C] font-sans pb-16">
      
      {/* Top Freeze Dashboard Bar */}
      <BlasterFreezeBar
        state={state}
        metrics={metrics}
        onReset={handleReset}
        onNavigate={(sub) => onNavigate('blaster', sub)}
        activeTab={currentSubTool}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        
        {/* Navigation Rail & Quick Actions */}
        <div className="bg-white border border-[#D8DEE5] rounded-xl p-2 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Subtool Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentSubTool === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate('blaster', tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                      : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D8DEE5] bg-[#F7F8FA] text-[#4E5B6A] hover:bg-[#FFF4E3] hover:text-[#9E1B1E] text-xs font-semibold transition cursor-pointer"
              title="Save Draft to Register"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white text-xs font-bold font-rajdhani uppercase tracking-wider shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Dossier</span>
            </button>

            <button
              onClick={handleOpenGuideline}
              className="p-1.5 rounded-lg border border-[#D8DEE5] text-[#7E8B99] hover:text-[#E87B1E] hover:bg-[#FFF4E3] transition cursor-pointer"
              title="Engineering Guidelines &amp; Standards Reference"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dynamic Tool Routing */}
        <main className="transition-all">
          {currentSubTool === 'hub' && (
            <BlasterHub
              state={state}
              metrics={metrics}
              reports={reports}
              onNavigate={(sub) => onNavigate('blaster', sub)}
              onApplyPreset={handleApplyPreset}
              onNewGeneration={() => {
                setState(INITIAL_BLASTER_STATE);
                if (onNavigate) onNavigate('blaster', 'info');
              }}
            />
          )}

          {currentSubTool === 'dashboard' && (
            <BlasterDashboard
              state={state}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
            />
          )}

          {currentSubTool === 'info' && (
            <BlasterProjectInfo
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
            />
          )}

          {currentSubTool === 'train' && (
            <BlasterTrainingTest
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
            />
          )}

          {currentSubTool === 'checklist' && (
            <BlasterChecklist
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
            />
          )}

          {currentSubTool === 'blasting' && (
            <BlasterProcess
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
              onOpenCatalog={() => setIsCatalogOpen(true)}
            />
          )}

          {currentSubTool === 'photo' && (
            <BlasterPhotoReport
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
            />
          )}

          {currentSubTool === 'verdict' && (
            <BlasterVerdictApproval
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
              onSaveDraft={handleSaveDraft}
              onApprove={() => setIsApprovalOpen(true)}
              onOpenPreview={() => setIsPreviewOpen(true)}
            />
          )}

          {currentSubTool === 'summary' && (
            <BlasterSummary
              state={state}
              onChange={handleStateChange}
              metrics={metrics}
              onNavigate={(sub) => onNavigate('blaster', sub)}
              onOpenPreview={() => setIsPreviewOpen(true)}
            />
          )}

          {currentSubTool === 'register' && (
            <BlasterRegister
              reports={reports}
              onLoadReport={handleLoadReport}
              onDuplicateReport={handleDuplicateReport}
              onDeleteReport={handleDeleteReport}
              onNewReport={() => {
                setState(INITIAL_BLASTER_STATE);
                if (onNavigate) onNavigate('blaster', 'info');
              }}
              onOpenPreview={() => setIsPreviewOpen(true)}
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
          if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
            if (onNavigate) onNavigate('blaster', 'hub');
          }
        }}
        company={company}
        onChange={(field, val) => setCompany((prev) => ({ ...prev, [field]: val }))}
      />

      <BlasterWatermarkControl
        isOpen={isWatermarkOpen}
        onClose={() => {
          setIsWatermarkOpen(false);
          if (currentSubTool === 'watermark') {
            if (onNavigate) onNavigate('blaster', 'hub');
          }
        }}
        watermark={watermark}
        onChange={(field, val) => setWatermark((prev) => ({ ...prev, [field]: val }))}
      />

      <BlasterPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          if (currentSubTool === 'preview' || currentSubTool === 'report') {
            if (onNavigate) onNavigate('blaster', 'hub');
          }
        }}
        state={state}
        metrics={metrics}
        company={company}
        watermark={watermark}
        onOpenCompany={() => setIsCompanyOpen(true)}
        onOpenWatermark={() => setIsWatermarkOpen(true)}
      />

    </div>
  );
}
