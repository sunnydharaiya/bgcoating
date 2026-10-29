import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import { 
  INITIAL_TSA_STATE, 
  calcTsaEvaluation, 
  calcCoatDFT, 
  TSA_COATING_SYSTEM_DEFAULTS, 
  TSA_MAT_DEFAULTS,
  TSA_PRESETS 
} from '../data/tsaDatabase';

// Sub-components
import TsaFreezeBar from '../tools/tsa/TsaFreezeBar';
import TsaHub from '../tools/tsa/TsaHub';
import TsaDashboard from '../tools/tsa/TsaDashboard';
import TsaProjectInfo from '../tools/tsa/TsaProjectInfo';
import TsaChecklist from '../tools/tsa/TsaChecklist';
import TsaCoatStage from '../tools/tsa/TsaCoatStage';
import TsaPhotoReport from '../tools/tsa/TsaPhotoReport';
import TsaVerdictApproval from '../tools/tsa/TsaVerdictApproval';
import TsaSummary from '../tools/tsa/TsaSummary';
import TsaRegister from '../tools/tsa/TsaRegister';

// Modals
import TsaTestCatalogModal from '../tools/tsa/TsaTestCatalogModal';
import TsaApprovalModal from '../tools/tsa/TsaApprovalModal';
import TsaCompanyModal from '../tools/tsa/TsaCompanyModal';
import TsaWatermarkControl from '../tools/tsa/TsaWatermarkControl';
import TsaPreviewModal from '../tools/tsa/TsaPreviewModal';

const DRAFT_KEY = 'bg_tsa_draft';
const REPORTS_KEY = 'bgcoating.tsa.reports.v1';
const COMPANY_KEY = 'bg_tsa_company';
const WATERMARK_KEY = 'bg_tsa_watermark';

export default function TsaQualificationPage({
  currentSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // 1. Form Data State
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading TSA draft:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_TSA_STATE));
  });

  // 2. Master Reports Register State
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading TSA reports register:', e);
    }
    return [];
  });

  // 3. Company Branding State
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading TSA company:', e);
    }
    return {
      name: 'BG Group of Paint & Coating Consultant',
      tagline: 'TSA Operator Qualification Report — Twin Wire Arc / Thermal Spray — Technical Dossier',
      email: 'support@bgcoating.com',
      web: 'www.bgcoating.com',
      phone: '+91 99258 10408',
      logo: null
    };
  });

  // 4. Watermark State
  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem(WATERMARK_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading TSA watermark:', e);
    }
    return {
      enabled: true,
      text: 'BG Group of Paint and Coating Consultant',
      opacity: 6
    };
  });

  // Modals state
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [activeCoatForCatalog, setActiveCoatForCatalog] = useState('s1');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Sync sub-tool route with modals
  useEffect(() => {
    if (currentSubTool === 'company-details' || currentSubTool === 'company_details' || currentSubTool === 'company') {
      setIsCompanyModalOpen(true);
      setIsWatermarkModalOpen(false);
      setIsPreviewModalOpen(false);
    } else if (currentSubTool === 'watermark') {
      setIsWatermarkModalOpen(true);
      setIsCompanyModalOpen(false);
      setIsPreviewModalOpen(false);
    } else if (currentSubTool === 'preview' || currentSubTool === 'report' || currentSubTool === 'print') {
      setIsPreviewModalOpen(true);
      setIsCompanyModalOpen(false);
      setIsWatermarkModalOpen(false);
    } else {
      setIsCompanyModalOpen(false);
      setIsWatermarkModalOpen(false);
      setIsPreviewModalOpen(false);
    }
  }, [currentSubTool]);

  // Auto-save form draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving TSA draft:', e);
    }
  }, [formData]);

  // Auto-save master reports
  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving TSA reports:', e);
    }
  }, [reports]);

  // Save company
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (e) {
      console.error('Error saving TSA company:', e);
    }
  }, [company]);

  // Save watermark
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (e) {
      console.error('Error saving TSA watermark:', e);
    }
  }, [watermark]);

  // Navigation helper for TSA sub-tools
  const navigateSub = (subToolId) => {
    if (onNavigate) {
      onNavigate('tsa-qualification', subToolId);
    }
  };

  // Live evaluation calculation
  const evaluation = calcTsaEvaluation(formData);

  // Handler: Update form field
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler: Apply Preset
  const handleApplyPreset = (presetKey) => {
    const preset = TSA_PRESETS[presetKey];
    if (!preset) return;
    if (window.confirm(`Load "${preset.title}" preset data into current working draft?`)) {
      setFormData(prev => ({
        ...prev,
        'f-proj': preset.proj,
        'f-proj-no': preset.projNo,
        'f-client': preset.client,
        'f-epc': preset.epc,
        'f-contractor': preset.contractor,
        'f-category': preset.category,
        'f-location': preset.location,
        'f-ref': preset.ref,
        coatingSystem: JSON.parse(JSON.stringify(preset.system))
      }));
      addToast('Preset Applied', `Loaded "${preset.title}" configuration.`, 'success');
    }
  };

  // Handler: Reset Draft
  const handleResetDraft = () => {
    if (window.confirm('Reset current qualification draft to blank default state? All unsaved edits will be lost.')) {
      setFormData(JSON.parse(JSON.stringify(INITIAL_TSA_STATE)));
      addToast('Draft Reset', 'Form reset to blank initial state.', 'info');
    }
  };

  // Handler: Sync Coating System to Coat Stages
  const handleSyncCoatingSystem = () => {
    const cs = formData.coatingSystem || TSA_COATING_SYSTEM_DEFAULTS;
    const stages = { ...(formData.coatStages || {}) };

    cs.forEach((row, idx) => {
      const sid = idx === 0 ? 's1' : idx === 1 ? 's2' : idx === 2 ? 's3' : 's4';
      if (stages[sid]) {
        stages[sid] = {
          ...stages[sid],
          generic: row.generic || stages[sid].generic,
          mfr: row.mfr || stages[sid].mfr,
          product: row.brand || stages[sid].product,
          dftSpecMin: row.min || stages[sid].dftSpecMin,
          dftSpecMax: row.max || stages[sid].dftSpecMax,
          shade: row.shade || stages[sid].shade
        };
      }
    });

    handleFieldChange('coatStages', stages);
    addToast('Coating System Synced', 'Product generics and DFT tolerances pushed to coat stages.', 'success');
  };

  // Handler: Stamp upload / remove
  const handleStampUpload = (slot, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const sigStamps = { ...(formData.sigStamps || {}) };
      sigStamps[slot] = e.target.result;
      handleFieldChange('sigStamps', sigStamps);
      addToast('Stamp Uploaded', `Signatory slot 0${slot} stamp saved.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleStampRemove = (slot) => {
    const sigStamps = { ...(formData.sigStamps || {}) };
    sigStamps[slot] = null;
    handleFieldChange('sigStamps', sigStamps);
  };

  // Handler: Catalog Add Test
  const handleOpenTestCatalog = (sid) => {
    setActiveCoatForCatalog(sid);
    setIsCatalogModalOpen(true);
  };

  const handleSelectTestFromCatalog = (testItem) => {
    const coatStages = { ...(formData.coatStages || {}) };
    const currStage = coatStages[activeCoatForCatalog] || {};
    const currTests = currStage.tests || [];
    coatStages[activeCoatForCatalog] = {
      ...currStage,
      tests: [...currTests, testItem]
    };
    handleFieldChange('coatStages', coatStages);
    setIsCatalogModalOpen(false);
    addToast('Test Added', `Added "${testItem.t}" to ${activeCoatForCatalog.toUpperCase()}.`, 'success');
  };

  // Handler: Validate & Approve
  const handleConfirmApprove = () => {
    const repId = 'REP-' + Date.now();
    const repNo = formData['f-rep-no'] && !formData['f-rep-no'].includes('DRAFT')
      ? formData['f-rep-no']
      : `BG-TSA-${new Date().getFullYear()}-${String(reports.length + 1).padStart(4, '0')}`;

    const updatedFormData = {
      ...formData,
      'f-rep-no': repNo,
      'f-status': 'Approved'
    };

    setFormData(updatedFormData);

    const reportRecord = {
      id: repId,
      repNo: repNo,
      name: formData['f-name'] || 'Operator',
      civil: formData['f-civil'] || '',
      category: formData['f-category'] || 'TSA Operator',
      proj: formData['f-proj'] || 'Project',
      projNo: formData['f-proj-no'] || '',
      client: formData['f-client'] || '',
      contractor: formData['f-contractor'] || '',
      verdict: evaluation.verdict,
      overall: evaluation.overall,
      status: 'Approved',
      savedAt: new Date().toISOString(),
      preparedBy: formData['sig2-name'] || 'BG Group QA/QC Lead',
      data: JSON.parse(JSON.stringify(updatedFormData))
    };

    setReports(prev => [reportRecord, ...prev.filter(r => r.id !== repId)]);
    addToast('Dossier Approved', `Report ${repNo} has been officially issued and registered.`, 'success');
  };

  // Register Handlers
  const handleLoadReport = (rep) => {
    if (window.confirm(`Load report "${rep.repNo}" into editor? Any unsaved edits in current draft will be overwritten.`)) {
      setFormData(JSON.parse(JSON.stringify(rep.data)));
      navigateSub('dashboard');
      addToast('Report Loaded', `Loaded dossier ${rep.repNo}.`, 'info');
    }
  };

  const handleDuplicateReport = (rep) => {
    const duplicated = JSON.parse(JSON.stringify(rep.data));
    duplicated['f-rep-no'] = '';
    duplicated['f-status'] = 'Draft';
    setFormData(duplicated);
    navigateSub('project-info');
    addToast('Report Duplicated', 'Duplicated as new working draft.', 'info');
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Permanently delete this qualification record from the Master Register?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      addToast('Record Deleted', 'Report removed from register.', 'info');
    }
  };

  const handlePrintReport = (rep) => {
    if (rep?.data) {
      setFormData(JSON.parse(JSON.stringify(rep.data)));
    }
    setIsPreviewModalOpen(true);
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      addToast('No Reports', 'No reports available to export.', 'info');
      return;
    }
    const headers = ['Report No', 'Operator Name', 'Civil ID', 'Category', 'Project', 'Client', 'Verdict', 'Overall Score', 'Status', 'Date'];
    const rows = reports.map(r => [
      `"${r.repNo}"`,
      `"${r.name}"`,
      `"${r.civil}"`,
      `"${r.category}"`,
      `"${r.proj}"`,
      `"${r.client}"`,
      `"${r.verdict}"`,
      `"${(r.overall || 0).toFixed(1)}%"`,
      `"${r.status}"`,
      `"${r.savedAt ? r.savedAt.slice(0, 10) : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TSA_Qualification_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Exported', 'Downloaded Master Register CSV.', 'success');
  };

  const handleNewReport = () => {
    if (window.confirm('Start a new qualification report? Current unsaved draft will be reset.')) {
      setFormData(JSON.parse(JSON.stringify(INITIAL_TSA_STATE)));
      navigateSub('project-info');
    }
  };

  // Guideline helper
  const handleOpenGuideline = () => {
    openGuideline({
      title: 'TSA Thermal Spray Operator Qualification (AWS C2.23M / ISO 2063-2)',
      standards: ['AWS C2.23M / SSPC-CS 23.00 / NACE No. 12', 'AWS C2.16 Guide for Thermal Spray Operator Qualification', 'ISO 2063-2 Metallic Coatings', 'SSPC-PA 2 Measurement of Dry Coating Thickness'],
      overview: 'Module 08 provides a 4-tier practical qualification workflow for Twin-Wire Arc Thermal Spray Aluminium (TSA) operators protecting high-temperature offshore flare headers and CUI piping.',
      formula: 'Overall Score = (Checklist × 35%) + (DFT × 30%) + (Process Tests × 20%) + (Environment × 15%)\nPassing Benchmark: Overall ≥ 80.0% with Zero Gating Fails.',
      rules: [
        'Mandrel 180° bend test on a 1.5mm mild steel coupon must show zero flaking or macro-spalling.',
        'Pull-off adhesion (ASTM D4541) must achieve at least 7.0 MPa with cohesive or substrate failure.',
        'Silicone aluminium sealer must be applied within 4 hours before any moisture absorption.',
        'SSPC PA-2 DFT spot readings across 4 substrates must satisfy the 80%–120% rule.'
      ],
      advice: 'The TSA qualification certificate is valid for 12 months, subject to satisfactory ongoing field audit compliance.'
    });
  };

  // Listen for Top Header Actions (preview, save-draft, validate, register, reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const action = e.detail?.action;
      if (action === 'save-draft') {
        const repNo = formData['f-rep-no'] || `BG-TSA-${new Date().getFullYear()}-${String(reports.length + 1).padStart(4, '0')}`;
        const newRecord = {
          id: 'REP-' + Date.now(),
          repNo,
          name: formData['f-name'] || 'Operator',
          civil: formData['f-civil'] || '',
          category: formData['f-category'] || 'TSA Operator',
          proj: formData['f-proj'] || 'Project',
          projNo: formData['f-proj-no'] || '',
          client: formData['f-client'] || '',
          contractor: formData['f-contractor'] || '',
          verdict: evaluation.verdict,
          overall: evaluation.overall,
          status: 'Draft',
          savedAt: new Date().toISOString(),
          preparedBy: formData['sig2-name'] || 'QA/QC Inspector',
          data: JSON.parse(JSON.stringify(formData))
        };
        setReports(prev => [newRecord, ...prev.filter(r => r.repNo !== repNo)]);
        addToast('Draft Saved', `Saved draft qualification record (${repNo}).`, 'success');
      } else if (action === 'preview') {
        setIsPreviewModalOpen(true);
      } else if (action === 'validate') {
        setIsApprovalModalOpen(true);
      } else if (action === 'register') {
        navigateSub('register');
      } else if (action === 'reset') {
        handleResetDraft();
      }
    };

    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [formData, reports, evaluation]);

  // Render SubTool view
  const renderCurrentView = () => {
    switch (currentSubTool) {
      case 'dashboard':
        return (
          <TsaDashboard
            formData={formData}
            evaluation={evaluation}
            onNavigate={navigateSub}
          />
        );
      case 'project-info':
      case 'project-operator':
      case 'project_operator':
      case 'project_info':
      case 'info':
        return (
          <TsaProjectInfo
            formData={formData}
            onChange={handleFieldChange}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );
      case 'checklist':
        return (
          <TsaChecklist
            formData={formData}
            onChange={handleFieldChange}
            evaluation={evaluation}
          />
        );
      case 's1':
      case 'coat-stage-s1':
      case 'coat_stage_s1':
        return (
          <TsaCoatStage
            sid="s1"
            formData={formData}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );
      case 's2':
      case 'coat-stage-s2':
      case 'coat_stage_s2':
        return (
          <TsaCoatStage
            sid="s2"
            formData={formData}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );
      case 's3':
      case 'coat-stage-s3':
      case 'coat_stage_s3':
        return (
          <TsaCoatStage
            sid="s3"
            formData={formData}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );
      case 's4':
      case 'coat-stage-s4':
      case 'coat_stage_s4':
        return (
          <TsaCoatStage
            sid="s4"
            formData={formData}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );
      case 'photo':
      case 'photo-report':
      case 'photo_report':
        return (
          <TsaPhotoReport
            formData={formData}
            onChange={handleFieldChange}
          />
        );
      case 'verdict':
      case 'verdict-approval':
      case 'verdict_approval':
        return (
          <TsaVerdictApproval
            formData={formData}
            onChange={handleFieldChange}
            evaluation={evaluation}
            onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
            onStampUpload={handleStampUpload}
            onStampRemove={handleStampRemove}
          />
        );
      case 'summary':
      case 'preview':
        return (
          <TsaSummary
            formData={formData}
            evaluation={evaluation}
            onNavigate={navigateSub}
          />
        );
      case 'register':
      case 'report-register':
      case 'report_register':
      case 'saved-reports':
      case 'reports':
        return (
          <TsaRegister
            reports={reports}
            onLoadReport={handleLoadReport}
            onDuplicateReport={handleDuplicateReport}
            onDeleteReport={handleDeleteReport}
            onPrintReport={handlePrintReport}
            onExportCSV={handleExportCSV}
            onNewReport={handleNewReport}
          />
        );
      case 'hub':
      default:
        return (
          <TsaHub
            formData={formData}
            evaluation={evaluation}
            reports={reports}
            onNavigate={navigateSub}
            onApplyPreset={handleApplyPreset}
            onNewGeneration={() => {
              setFormData(JSON.parse(JSON.stringify(INITIAL_TSA_STATE)));
              navigateSub('project-info');
            }}
            onOpenPreview={() => setIsPreviewModalOpen(true)}
            onOpenPrint={() => window.print()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#1B222C] pb-16 font-sans">
      
      {/* Top Sticky FreezeBar (Hidden on Hub view) */}
      {currentSubTool !== 'hub' && (
        <TsaFreezeBar
          formData={formData}
          evaluation={evaluation}
          currentSubTool={currentSubTool}
          onNavigate={navigateSub}
          onResetDraft={handleResetDraft}
          onOpenPreview={() => setIsPreviewModalOpen(true)}
          onOpenGuideline={handleOpenGuideline}
        />
      )}

      {/* Main Container */}
      <div className={currentSubTool === 'hub' ? 'w-full px-4 sm:px-6 lg:px-8 pt-4' : 'w-full px-4 sm:px-6 lg:px-8 pt-6'}>
        {renderCurrentView()}
      </div>

      {/* Test Catalog Modal */}
      <TsaTestCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelectTest={handleSelectTestFromCatalog}
        activeCoatSID={activeCoatForCatalog}
      />

      {/* Approval Modal */}
      <TsaApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirmApprove={handleConfirmApprove}
        formData={formData}
        evaluation={evaluation}
      />

      {/* Company Branding Modal */}
      <TsaCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          if (currentSubTool === 'company-details') navigateSub('hub');
        }}
        company={company}
        onChange={(field, val) => setCompany(prev => ({ ...prev, [field]: val }))}
      />

      {/* Watermark Control Modal */}
      <TsaWatermarkControl
        isOpen={isWatermarkModalOpen}
        onClose={() => {
          setIsWatermarkModalOpen(false);
          if (currentSubTool === 'watermark') navigateSub('hub');
        }}
        watermark={watermark}
        onChange={(field, val) => setWatermark(prev => ({ ...prev, [field]: val }))}
      />

      {/* A4 Print Dossier Preview Modal */}
      <TsaPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          if (currentSubTool === 'preview') navigateSub('hub');
        }}
        formData={formData}
        evaluation={evaluation}
        company={company}
        watermark={watermark}
        onPrint={() => window.print()}
      />

    </div>
  );
}
