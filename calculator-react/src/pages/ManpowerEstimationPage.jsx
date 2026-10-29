import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Building2,
  Flame,
  Paintbrush,
  Layers,
  Users,
  Gauge,
  FileSpreadsheet,
  HardHat,
  Printer,
  ShieldCheck,
  Eye,
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen,
  RotateCcw,
  Sliders,
  Award
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import {
  INITIAL_MANPOWER_STATE,
  calculateManpowerEstimation
} from '../data/manpowerDatabase';
import { manpowerService } from '../services/manpowerService';

// Sub-tool components
import ManpowerFreezeBar from '../tools/manpower/ManpowerFreezeBar';
import ManpowerHub from '../tools/manpower/ManpowerHub';
import ManpowerDashboard from '../tools/manpower/ManpowerDashboard';
import ManpowerProjectInfo from '../tools/manpower/ManpowerProjectInfo';
import ManpowerBlastingCost from '../tools/manpower/ManpowerBlastingCost';
import ManpowerPaintingCost from '../tools/manpower/ManpowerPaintingCost';
import ManpowerRawMaterial from '../tools/manpower/ManpowerRawMaterial';
import ManpowerWorkerCTC from '../tools/manpower/ManpowerWorkerCTC';
import ManpowerAbrasiveDiesel from '../tools/manpower/ManpowerAbrasiveDiesel';
import ManpowerSummary from '../tools/manpower/ManpowerSummary';
import ManpowerRegister from '../tools/manpower/ManpowerRegister';
import ManpowerPreviewModal from '../tools/manpower/ManpowerPreviewModal';
import ManpowerPrintDossier from '../tools/manpower/ManpowerPrintDossier';
import ManpowerCompanyModal from '../tools/manpower/ManpowerCompanyModal';
import ManpowerWatermarkControl from '../tools/manpower/ManpowerWatermarkControl';
import ManpowerApprovalModal from '../tools/manpower/ManpowerApprovalModal';

export default function ManpowerEstimationPage({ activePage = 'manpower-estimation', currentSubTool = 'hub', onNavigate }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [activeTab, setActiveTab] = useState(currentSubTool || 'hub');

  // Synchronize activeTab when currentSubTool prop changes (e.g. from Sidebar or direct URL)
  useEffect(() => {
    if (currentSubTool) {
      if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
        setIsCompanyModalOpen(true);
        setIsWatermarkModalOpen(false);
        setIsPreviewModalOpen(false);
        setIsApprovalModalOpen(false);
      } else if (currentSubTool === 'watermark' || currentSubTool === 'watermark_control') {
        setIsWatermarkModalOpen(true);
        setIsCompanyModalOpen(false);
        setIsPreviewModalOpen(false);
        setIsApprovalModalOpen(false);
      } else if (currentSubTool === 'preview' || currentSubTool === 'report' || currentSubTool === 'xlprint') {
        setIsPreviewModalOpen(true);
        setIsCompanyModalOpen(false);
        setIsWatermarkModalOpen(false);
        setIsApprovalModalOpen(false);
      } else {
        setIsCompanyModalOpen(false);
        setIsWatermarkModalOpen(false);
        setIsPreviewModalOpen(false);
        setIsApprovalModalOpen(false);

        // Normalize aliases & modal triggers
        if (currentSubTool === 'company-details' || currentSubTool === 'company') {
          setIsCompanyModalOpen(true);
        } else if (currentSubTool === 'watermark') {
          setIsWatermarkModalOpen(true);
        } else if (currentSubTool === 'preview') {
          setIsPreviewModalOpen(true);
        } else if (currentSubTool === 'print' || currentSubTool === 'xlprint') {
          handleDirectPrint();
        } else if (currentSubTool === 'blasting-cost' || currentSubTool === 'blasting_cost') {
          setActiveTab('blasting');
        } else if (currentSubTool === 'paint-application' || currentSubTool === 'paint_application') {
          setActiveTab('painting');
        } else if (currentSubTool === 'paint-raw-material' || currentSubTool === 'raw_material') {
          setActiveTab('raw-material');
        } else if (currentSubTool === 'front-page-summary') {
          setActiveTab('summary');
        } else if (currentSubTool === 'report-register') {
          setActiveTab('register');
        } else {
          setActiveTab(currentSubTool);
        }
      }
    }
  }, [currentSubTool]);

  // Persistent estimation draft
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_os_manpower_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load manpower draft', e);
    }
    return INITIAL_MANPOWER_STATE;
  });

  // Persistent register records
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_os_manpower_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load manpower records', e);
    }
    return [];
  });

  // Corporate Profile & Watermark
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_os_company_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load company profile', e);
    }
    return {
      name: 'BG GROUP OF PAINT & COATINGS CONSULTANT',
      tagline: 'ISO 9001:2015 Certified Corrosion Protection Specialists',
      phone: '+91 98765 43210',
      email: 'projects@bgcoating.com',
      website: 'www.bgcoating.com',
      address: 'Plot 42, Industrial Engineering Zone, Hazira, Gujarat',
      logo: ''
    };
  });

  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_os_watermark_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load watermark settings', e);
    }
    return {
      enabled: false,
      text: 'CONFIDENTIAL OFFER',
      opacity: 0.08,
      angle: -30
    };
  });

  // Modals & Preview Record state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const hasLoadedInitialDraftRef = useRef(false);
  const saveDraftTimeoutRef = useRef(null);

  // Load remote working draft or fallback to localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadDraft = async () => {
      try {
        const draft = await manpowerService.getActiveDraft();
        if (draft && isMounted) {
          setState(draft);
        }
      } catch (e) {
        console.warn('[ManpowerEstimationPage] Error fetching remote draft:', e);
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

  // Fetch registered records from backend API
  const fetchReports = useCallback(async () => {
    try {
      const list = await manpowerService.getReports();
      setReports(list);
    } catch (e) {
      console.warn('[ManpowerEstimationPage] Failed to fetch records:', e);
    }
  }, []);

  useEffect(() => {
    fetchReports();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchReports();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchReports]);

  // Compute reactive engineering metrics for active form
  const metrics = useMemo(() => {
    return calculateManpowerEstimation(state);
  }, [state]);

  // Compute reactive engineering metrics for preview modal / print dossier
  const previewMetrics = useMemo(() => {
    return calculateManpowerEstimation(previewRecord || state);
  }, [previewRecord, state]);

  // Debounced auto-save working draft (800ms) to backend + localStorage
  useEffect(() => {
    if (!hasLoadedInitialDraftRef.current) return;

    if (saveDraftTimeoutRef.current) {
      clearTimeout(saveDraftTimeoutRef.current);
    }

    saveDraftTimeoutRef.current = setTimeout(() => {
      manpowerService.saveActiveDraft(state, metrics);
    }, 800);

    return () => {
      if (saveDraftTimeoutRef.current) {
        clearTimeout(saveDraftTimeoutRef.current);
      }
    };
  }, [state, metrics]);

  // Save company profile locally
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_company_profile', JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company profile', e);
    }
  }, [company]);

  // Save watermark settings locally
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_watermark_settings', JSON.stringify(watermark));
    } catch (e) {
      console.error('Failed to save watermark settings', e);
    }
  }, [watermark]);

  // Navigation Handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onNavigate) {
      onNavigate(activePage, tabId);
    }
  };

  // Field change handler
  const handleFieldChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Apply Industry Template Preset
  const handleApplyPreset = (preset) => {
    setState(prev => ({
      ...prev,
      ...preset
    }));
    addToast('Template applied successfully!', 'success');
  };

  // Reset entire form
  const handleReset = async () => {
    if (window.confirm('Reset all estimation fields back to defaults? This will clear the active working draft.')) {
      setState({
        ...INITIAL_MANPOWER_STATE,
        estNo: '',
        projectName: '',
        customer: '',
        location: '',
        area: 0,
        tonnage: '',
        rawRows: [
          { name: '', dft: 0, vs: 0, thinner: 0, loss: 0, paintPrice: 0, thinnerPrice: 0 }
        ]
      });
      await manpowerService.clearActiveDraft();
      addToast('Estimation reset complete', 'info');
    }
  };

  // Save Report Record to Database
  const handleSaveReport = async (status = 'Draft') => {
    try {
      await manpowerService.saveReport(state, status, metrics);
      await fetchReports();
      addToast(
        status === 'Approved'
          ? '✓ Estimation marked as Approved & saved to database!'
          : '💾 Draft saved to database register',
        'success'
      );
    } catch (e) {
      addToast('Failed to save to database', 'error');
    }
  };

  // Handle header actions from top bar (Preview, Save Draft, Validate, Register, Reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const { action } = e.detail || {};
      if (action === 'save-draft') {
        handleSaveReport('Draft');
      } else if (action === 'preview') {
        setPreviewRecord(null);
        setIsPreviewModalOpen(true);
      } else if (action === 'validate') {
        setIsApprovalModalOpen(true);
      } else if (action === 'company' || action === 'company-details') {
        setIsCompanyModalOpen(true);
      } else if (action === 'watermark') {
        setIsWatermarkModalOpen(true);
      } else if (action === 'print' || action === 'xlprint') {
        handleDirectPrint();
      } else if (action === 'register') {
        handleTabChange('register');
      } else if (action === 'reset') {
        handleReset();
      }
    };
    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [state, metrics, fetchReports]);

  // Load Report Record
  const handleLoadReport = (record) => {
    const data = record.snap || record.data || record;
    setState(data);
    setActiveTab('summary');
    addToast(`Loaded estimation: ${record.estNo || record.projectName || record.proj}`, 'success');
  };

  // View Record in Preview Modal
  const handlePreviewReport = (record) => {
    setPreviewRecord(record.snap || record.data || record);
    setIsPreviewModalOpen(true);
  };

  // Print Record directly
  const handlePrintReport = (record) => {
    setPreviewRecord(record.snap || record.data || record);
    setTimeout(() => window.print(), 200);
  };

  // Duplicate Report
  const handleCopyReport = async (record) => {
    const data = record.snap || record.data || record;
    const cloned = {
      ...data,
      id: undefined,
      estNo: `${record.estNo || 'EST'}-COPY`,
      projectName: `${record.proj || record.projectName || 'Project'} (Copy)`,
      status: 'Draft'
    };
    try {
      await manpowerService.saveReport(cloned, 'Draft');
      await fetchReports();
      addToast('Estimation duplicated as new draft', 'info');
    } catch (e) {
      addToast('Failed to duplicate estimation', 'error');
    }
  };

  // Delete Report
  const handleDeleteReport = async (id) => {
    if (window.confirm('Delete this estimation record from register?')) {
      try {
        await manpowerService.deleteReport(id);
        await fetchReports();
        addToast('Record permanently deleted from register', 'info');
      } catch (e) {
        addToast('Delete failed', 'error');
      }
    }
  };

  // 1-Click Load Sample Refinery Record
  const handleLoadSampleRecord = async () => {
    try {
      const sampleRecord = {
        ...INITIAL_MANPOWER_STATE,
        estNo: 'EST-MP-2026-001',
        projectName: 'Petrochemical Expansion Phase-II Process Equipment & Piping',
        customer: 'National Refining & Petrochemicals Corp.',
        location: 'Coastal Industrial Complex, Hazira',
        area: 20000,
        months: 6,
        wdays: 26,
        shifts: 2,
        blastOutput: 65,
        paintOutput: 45,
        currency: 'INR',
        status: 'Approved',
        revisions: [
          { no: 'R0', date: new Date().toISOString().split('T')[0], details: 'Tender Baseline Estimation', prep: 'Lead Estimator', rev: 'Engineering Head', appr: 'Commercial Director' }
        ]
      };
      const sampleMetrics = calculateManpowerEstimation(sampleRecord);
      await manpowerService.saveReport(sampleRecord, 'Approved', sampleMetrics);
      await fetchReports();
      addToast('✓ 20,000 m² Standard Refinery Estimation loaded into register!', 'success');
    } catch (e) {
      addToast('Failed to load sample record', 'error');
    }
  };

  // Print direct trigger
  const handleDirectPrint = () => {
    window.print();
  };

  const handleOpenGuideline = () => {
    openGuideline({
      title: 'Manpower & Equipment Coating Estimation Standards',
      standards: [
        'ISO 12944 Protective Paint Systems',
        'ISO 8501-1 Visual Assessment of Surface Cleanliness',
        'SSPC / NACE / AMPP Industrial Coating Manual',
        'IPCA Standard Estimating Norms'
      ],
      overview: 'Comprehensive costing methodology integrating surface prep blasting production, multi-pass spray painting crew requirements, theoretical/practical paint spreading coverage, statutory labor burdens, and equipment rental rates.',
      formula: 'Grand Total = Blasting Total + Paint Application Total + Paint Raw Material Total\nTC (Theoretical Coverage) = (VS% \u00d7 10) \u00f7 DFT (µm)\nPS (Practical Spreading) = TC - (TC \u00d7 Loss% \u00f7 100)\nWorker CTC = (Basic + Overtime + Govt Liabilities + Camp/Misc) \u00d7 (1 + Profit Margin%)',
      rules: [
        'Abrasive Media Consumption: 12-16 kg/m² for Garnet, 20-30 kg/m² for Copper Slag on Sa 2.5 baseline.',
        'Diesel fuel consumption norms: Blasting 0.8-1.2 L/m²; Spray Painting 0.1-0.2 L/m² per pass.',
        'Statutory liabilities: PF (12.16%), Bonus (8.33%), paid leave provisions must be factored in monthly labor CTC.',
        'Subcontractor overheads & profits are applied on combined consumable, labor, and equipment allocations.'
      ]
    });
  };

  const tabs = [
    { id: 'hub', label: 'Overview Hub', icon: Sparkles },
    { id: 'project-info', label: '01. Project Info', icon: Building2 },
    { id: 'blasting', label: '02. Blasting Cost', icon: Flame },
    { id: 'painting', label: '03. Paint Application', icon: Paintbrush },
    { id: 'raw-material', label: '04. Raw Material', icon: Layers },
    { id: 'worker-ctc', label: '05. Worker CTC', icon: Users },
    { id: 'abrasive-diesel', label: '06. Abrasive & Diesel', icon: Gauge },
    { id: 'summary', label: '07. Cost Summary', icon: FileSpreadsheet },
    { id: 'register', label: '08. Register', icon: HardHat },
  ];

  const showFreezeBar = ['project-info', 'blasting', 'painting', 'raw-material', 'summary'].includes(activeTab);

  return (
    <div className="w-full max-w-[1240px] mx-auto text-[#1B222C] font-sans pb-12">
      
      {/* Top Sticky Freeze Dashboard Bar (Only in estimation workflow tabs, matching 1.png - 4.png) */}
      {showFreezeBar && (
        <div className="sticky top-[56px] md:top-[60px] z-20 pt-0.5 pb-2 -mt-1 bg-[#F3F5F8]/95 backdrop-blur-xs transition-all">
          <ManpowerFreezeBar
            state={state}
            metrics={metrics}
            onReset={handleReset}
            onSaveDraft={() => handleSaveReport('Draft')}
            onPreview={() => setIsPreviewModalOpen(true)}
          />
        </div>
      )}

      {/* Main Container */}
      <div className="w-full space-y-4">
        
        {/* Active Sub-Tool Rendering */}
        <div>
          {activeTab === 'hub' && (
            <ManpowerHub
              state={state}
              metrics={metrics}
              onNavigate={handleTabChange}
              onApplyPreset={handleApplyPreset}
              reports={reports}
              onOpenPreview={() => setIsPreviewModalOpen(true)}
              onOpenPrint={() => handleTabChange('report')}
            />
          )}

          {activeTab === 'dashboard' && (
            <ManpowerDashboard
              state={state}
              metrics={metrics}
              reports={reports}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'project-info' && (
            <ManpowerProjectInfo
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
              onSaveDraft={() => handleSaveReport('Draft')}
              onValidate={() => setIsApprovalModalOpen(true)}
              onReset={handleReset}
            />
          )}

          {activeTab === 'blasting' && (
            <ManpowerBlastingCost
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
              onSaveDraft={() => handleSaveReport('Draft')}
              onValidate={() => setIsApprovalModalOpen(true)}
              onReset={handleReset}
            />
          )}

          {activeTab === 'painting' && (
            <ManpowerPaintingCost
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
              onSaveDraft={() => handleSaveReport('Draft')}
              onValidate={() => setIsApprovalModalOpen(true)}
              onReset={handleReset}
            />
          )}

          {activeTab === 'raw-material' && (
            <ManpowerRawMaterial
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
              onSaveDraft={() => handleSaveReport('Draft')}
              onValidate={() => setIsApprovalModalOpen(true)}
              onReset={handleReset}
            />
          )}

          {activeTab === 'worker-ctc' && (
            <ManpowerWorkerCTC
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'abrasive-diesel' && (
            <ManpowerAbrasiveDiesel
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'summary' && (
            <ManpowerSummary
              state={state}
              metrics={metrics}
              onSaveReport={handleSaveReport}
              onOpenApproval={() => setIsApprovalModalOpen(true)}
              onOpenPreview={() => setIsPreviewModalOpen(true)}
              onNavigate={handleTabChange}
              onReset={handleReset}
            />
          )}

          {activeTab === 'register' && (
            <ManpowerRegister
              reports={reports}
              onLoadReport={handleLoadReport}
              onPrintReport={handlePrintReport}
              onPreviewReport={handlePreviewReport}
              onCopyReport={handleCopyReport}
              onDeleteReport={handleDeleteReport}
              onNewEstimation={() => {
                handleReset();
                setActiveTab('project-info');
              }}
              onSaveActiveEstimation={() => handleSaveReport('Draft')}
              onLoadSampleRecord={handleLoadSampleRecord}
            />
          )}
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Preview Modal */}
      <ManpowerPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewRecord(null);
        }}
        state={previewRecord || state}
        metrics={previewMetrics}
        company={company}
        watermark={watermark}
        onPrint={handleDirectPrint}
      />

      {/* 2. Company Details Modal */}
      <ManpowerCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        company={company}
        onSave={(c) => {
          setCompany(c);
          addToast('Company details saved successfully', 'success');
        }}
      />

      {/* 3. Watermark Modal */}
      <ManpowerWatermarkControl
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        watermark={watermark}
        onSave={(w) => {
          setWatermark(w);
          addToast('Watermark preferences updated', 'success');
        }}
      />

      {/* 4. Validate & Approval Modal */}
      <ManpowerApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        state={state}
        metrics={metrics}
        onConfirmApproval={() => {
          handleSaveReport('Approved');
          setIsApprovalModalOpen(false);
        }}
      />

      {/* Hidden Print Dossier for @media print */}
      <ManpowerPrintDossier
        state={previewRecord || state}
        metrics={previewMetrics}
        company={company}
        watermark={watermark}
      />

    </div>
  );
}
