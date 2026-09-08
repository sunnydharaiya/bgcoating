// src/pages/PainterQualificationPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Paintbrush, 
  RotateCcw, 
  Sparkles, 
  Save, 
  Printer,
  Layers,
  Sliders
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import { 
  INITIAL_PAINTER_STATE, 
  calculatePainterQualification,
  PAINTER_PRESETS,
  COAT_SIDS
} from '../data/painterDatabase';

// Sub-Tool Components
import PainterFreezeBar from '../tools/painter/PainterFreezeBar';
import PainterHub from '../tools/painter/PainterHub';
import PainterDashboard from '../tools/painter/PainterDashboard';
import PainterProjectInfo from '../tools/painter/PainterProjectInfo';
import PainterTrainingTest from '../tools/painter/PainterTrainingTest';
import PainterChecklist from '../tools/painter/PainterChecklist';
import PainterCoatStage from '../tools/painter/PainterCoatStage';
import PainterPhotoReport from '../tools/painter/PainterPhotoReport';
import PainterVerdictApproval from '../tools/painter/PainterVerdictApproval';
import PainterSummary from '../tools/painter/PainterSummary';
import PainterRegister from '../tools/painter/PainterRegister';

// Modals
import PainterTestCatalogModal from '../tools/painter/PainterTestCatalogModal';
import PainterApprovalModal from '../tools/painter/PainterApprovalModal';
import PainterCompanyModal from '../tools/painter/PainterCompanyModal';
import PainterWatermarkControl from '../tools/painter/PainterWatermarkControl';
import PainterPreviewModal from '../tools/painter/PainterPreviewModal';

const DRAFT_KEY = 'bg_painter_draft';
const REGISTER_KEY = 'bgcoating.spray.reports.v1';
const COMPANY_KEY = 'bg_painter_company';
const WATERMARK_KEY = 'bg_painter_watermark';

export default function PainterQualificationPage({
  currentSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Working state
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PAINTER_STATE;
    } catch {
      return INITIAL_PAINTER_STATE;
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

  // Company branding
  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            name: 'BG Group of Paint & Coating Consultant',
            tagline: 'Corrosion Engineering & Protective Coating Qualification System',
            email: 'support@bgcoating.com',
            web: 'www.bgcoating.com',
            phone: '+91 99258 10408',
            logo: null
          };
    } catch {
      return {
        name: 'BG Group of Paint & Coating Consultant',
        tagline: 'Corrosion Engineering & Protective Coating Qualification System',
        email: 'support@bgcoating.com',
        web: 'www.bgcoating.com',
        phone: '+91 99258 10408',
        logo: null
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
            text: 'BG Group of Paint and Coating Consultant',
            opacity: 6
          };
    } catch {
      return {
        enabled: true,
        text: 'BG Group of Paint and Coating Consultant',
        opacity: 6
      };
    }
  });

  // Modals state
  const [isTestCatalogOpen, setIsTestCatalogOpen] = useState(false);
  const [activeCatalogCoatSID, setActiveCatalogCoatSID] = useState('s1');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Sync modal routing when navigated from sidebar or direct URL
  useEffect(() => {
    if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
      setIsCompanyModalOpen(true);
      setIsWatermarkModalOpen(false);
      setIsPreviewModalOpen(false);
    } else if (currentSubTool === 'watermark') {
      setIsWatermarkModalOpen(true);
      setIsCompanyModalOpen(false);
      setIsPreviewModalOpen(false);
    } else if (currentSubTool === 'preview' || currentSubTool === 'report') {
      setIsPreviewModalOpen(true);
      setIsCompanyModalOpen(false);
      setIsWatermarkModalOpen(false);
    } else {
      setIsCompanyModalOpen(false);
      setIsWatermarkModalOpen(false);
      setIsPreviewModalOpen(false);
    }
  }, [currentSubTool]);

  // Auto-save draft on changes
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to auto-save painter draft:', e);
    }
  }, [state]);

  // Persist reports register
  useEffect(() => {
    try {
      localStorage.setItem(REGISTER_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports register:', e);
    }
  }, [reports]);

  // Persist company branding
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company settings:', e);
    }
  }, [company]);

  // Persist watermark
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (e) {
      console.error('Failed to save watermark settings:', e);
    }
  }, [watermark]);

  // Calculate live qualification metrics
  const evaluation = calculatePainterQualification(state);

  // Field change handler
  const handleFieldChange = (field, value) => {
    setState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Company change handler
  const handleCompanyChange = (field, value) => {
    setCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Watermark change handler
  const handleWatermarkChange = (field, value) => {
    setWatermark(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset working state
  const handleResetState = () => {
    if (window.confirm('Are you sure you want to reset the current Spray Painter Qualification report to a blank template? All unsaved data will be cleared.')) {
      setState(INITIAL_PAINTER_STATE);
      addToast('Draft Reset', 'Working draft has been cleared.', 'info');
    }
  };

  // Load Industry Preset
  const handleLoadPreset = (preset) => {
    if (!preset || !preset.data) return;
    if (window.confirm(`Load preset: "${preset.name}"? This will populate the draft with standard qualification parameters.`)) {
      setState(preset.data);
      addToast('Preset Loaded', `Loaded ${preset.name} qualification dataset.`, 'success');
    }
  };

  // Operator Photo Handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleFieldChange('_opPhoto', event.target.result);
      addToast('Photo Uploaded', 'Operator portrait updated successfully.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = () => {
    handleFieldChange('_opPhoto', null);
    addToast('Photo Removed', 'Operator portrait removed.', 'info');
  };

  // Signature / Stamp Handlers
  const handleStampUpload = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const updated = { ...(state._sigStamps || { 1: null, 2: null, 3: null }) };
      updated[index] = event.target.result;
      handleFieldChange('_sigStamps', updated);
      addToast('Stamp Affixed', `Signatory stamp ${index} attached.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleStampRemove = (index) => {
    const updated = { ...(state._sigStamps || { 1: null, 2: null, 3: null }) };
    updated[index] = null;
    handleFieldChange('_sigStamps', updated);
    addToast('Stamp Removed', `Signatory stamp ${index} removed.`, 'info');
  };

  // Sync Coating System to Coat Stages (s1 to s4)
  const handleSyncCoatingSystem = () => {
    const csRows = state._coatingSystem || [];
    if (csRows.length === 0) {
      addToast('No System Defined', 'Add rows to Section C Coating System first.', 'warning');
      return;
    }

    const updatedSheets = { ...(state._coatSheets || {}) };
    const updatedDFT = { ...(state._coatDFT || {}) };

    let cumMin = 0;
    let cumMax = 0;

    COAT_SIDS.forEach((sid, idx) => {
      const cs = csRows[idx];
      if (!cs) return;

      const coats = parseInt(cs.coats) || 1;
      const mn = parseFloat(cs.min);
      const mx = parseFloat(cs.max);
      if (!isNaN(mn)) cumMin += mn * coats;
      if (!isNaN(mx)) cumMax += mx * coats;

      // Update coat sheet specs
      updatedSheets[sid] = {
        ...(updatedSheets[sid] || {}),
        mfr: cs.mfr || updatedSheets[sid]?.mfr || '',
        product: cs.brand || updatedSheets[sid]?.product || '',
        generic: cs.generic || updatedSheets[sid]?.generic || '',
        shade: cs.shade || updatedSheets[sid]?.shade || '',
        dftspec_min: cs.min || '',
        dftspec_max: cs.max || '',
        cum_min: cumMin.toFixed(0),
        cum_max: cumMax.toFixed(0)
      };

      // Update DFT range for that stage
      updatedDFT[sid] = {
        ...(updatedDFT[sid] || {}),
        min: isNaN(cumMin) ? '' : cumMin.toFixed(0),
        max: isNaN(cumMax) ? '' : cumMax.toFixed(0)
      };
    });

    setState(prev => ({
      ...prev,
      _coatSheets: updatedSheets,
      _coatDFT: updatedDFT
    }));

    addToast('Stages Synced', 'Coating System specification pushed to Stages s1–s4.', 'success');
  };

  // Test catalog selection handler
  const handleSelectCatalogTest = (testItem) => {
    const sid = activeCatalogCoatSID;
    const currentCoatSheet = state._coatSheets?.[sid] || {};
    const currentTests = currentCoatSheet.tests || [];

    const newTest = {
      t: testItem.t,
      std: testItem.std,
      req: testItem.req,
      act: '',
      res: 'Pass'
    };

    const updatedSheets = { ...state._coatSheets };
    updatedSheets[sid] = {
      ...currentCoatSheet,
      tests: [...currentTests, newTest]
    };

    handleFieldChange('_coatSheets', updatedSheets);
    addToast('Test Added', `Added "${testItem.t}" to ${sid.toUpperCase()}.`, 'success');
  };

  const handleOpenTestCatalog = (sid) => {
    setActiveCatalogCoatSID(sid);
    setIsTestCatalogOpen(true);
  };

  // Save report to master register
  const handleSaveDraft = () => {
    const repNo = state['f-rep-no'] || `SP-QR-${Date.now().toString().slice(-6)}`;
    const newRecord = {
      id: Date.now().toString(),
      repNo,
      repDate: state['f-rep-date'] || new Date().toISOString().split('T')[0],
      name: state['f-name'] || 'Operator',
      civil: state['f-civil'] || '—',
      proj: state['f-proj'] || 'Project',
      projNo: state['f-proj-no'] || '—',
      client: state['f-client'] || '—',
      contractor: state['f-contractor'] || '—',
      preparedBy: state['sig2-name'] || 'QA/QC Inspector',
      overall: evaluation.overall,
      verdict: evaluation.verdict,
      status: 'Draft',
      savedAt: new Date().toISOString(),
      data: state
    };

    setReports(prev => [newRecord, ...prev.filter(r => r.repNo !== repNo)]);
    addToast('Draft Saved', `Qualification report "${repNo}" saved to register.`, 'success');
  };

  const handleApproveReport = (status = 'Approved') => {
    const repNo = state['f-rep-no'] || `SP-QR-${Date.now().toString().slice(-6)}`;
    const approvedRecord = {
      id: Date.now().toString(),
      repNo,
      repDate: state['f-rep-date'] || new Date().toISOString().split('T')[0],
      name: state['f-name'] || 'Operator',
      civil: state['f-civil'] || '—',
      proj: state['f-proj'] || 'Project',
      projNo: state['f-proj-no'] || '—',
      client: state['f-client'] || '—',
      contractor: state['f-contractor'] || '—',
      preparedBy: state['sig2-name'] || 'QA/QC Inspector',
      overall: evaluation.overall,
      verdict: evaluation.verdict,
      status,
      savedAt: new Date().toISOString(),
      data: state
    };

    setReports(prev => [approvedRecord, ...prev.filter(r => r.repNo !== repNo)]);
    addToast('Report Issued', `Report "${repNo}" officially marked as ${status}.`, 'success');
  };

  const handleLoadReport = (record) => {
    if (record && record.data) {
      if (window.confirm(`Load report "${record.repNo}" for ${record.name}? This will replace current draft.`)) {
        setState(record.data);
        addToast('Report Loaded', `Loaded "${record.repNo}".`, 'info');
        if (onNavigate) onNavigate('dashboard');
      }
    }
  };

  const handleDuplicateReport = (record) => {
    if (!record || !record.data) return;
    const dupState = JSON.parse(JSON.stringify(record.data));
    const newRepNo = `${record.repNo || 'SP-QR'}-COPY-${Date.now().toString().slice(-4)}`;
    dupState['f-rep-no'] = newRepNo;
    setState(dupState);
    addToast('Report Duplicated', `Duplicated as new draft: ${newRepNo}`, 'success');
    if (onNavigate) onNavigate('project-info');
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Delete this qualification report record from register?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      addToast('Record Deleted', 'Qualification report removed from register.', 'info');
    }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      addToast('Register Empty', 'No saved qualification records to export.', 'warning');
      return;
    }

    const headers = [
      'Report No',
      'Report Date',
      'Operator Name',
      'Civil ID',
      'Category',
      'Project',
      'Client',
      'Contractor',
      'Inspector',
      'Overall Score %',
      'Final Verdict',
      'Status',
      'Saved At'
    ];

    const rows = reports.map(r => [
      `"${r.repNo || ''}"`,
      `"${r.repDate || ''}"`,
      `"${r.name || ''}"`,
      `"${r.civil || ''}"`,
      `"${r.data?.['f-category'] || 'Spray Painter'}"`,
      `"${r.proj || ''}"`,
      `"${r.client || ''}"`,
      `"${r.contractor || ''}"`,
      `"${r.preparedBy || ''}"`,
      `"${r.overall ? r.overall.toFixed(1) : ''}"`,
      `"${r.verdict || ''}"`,
      `"${r.status || 'Draft'}"`,
      `"${r.savedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Painter_Qualification_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Exported', 'Downloaded master qualification register CSV.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenGuideline = () => {
    openGuideline({
      title: 'Module 07 · Spray Painter Qualification (PQR)',
      standards: [
        'ASTM D 4228: Standard Practice for Qualification of Coating Applicators',
        'SSPC PA-2: Measurement of Dry Coating Thickness with Magnetic Gages (80%–120% Rule)',
        'ASTM D 7091: Nondestructive Measurement of Dry Film Thickness of Nonmagnetic Coatings',
        'ASTM D 3359: Standard Test Methods for Rating Adhesion by Tape Test',
        'ASTM D 4541: Pull-Off Strength of Coatings Using Portable Adhesion Testers',
        'ISO 12944-7: Protective Paint Systems Execution and Supervision'
      ],
      overview:
        'Standardized technical system for industrial spray painter evaluation. Enforces a 6-tier weighted scoring matrix, 4-stage coating chronology (s1 Blasting & Primer, s2 1st Intermediate, s3 2nd Intermediate, s4 3rd Topcoat), 4-mini-table DFT matrices (Plane, Pipe, T-Beam, Flange), and multi-party digital sign-off.',
      formula:
        'Weighted Composite Score = (Post-Test × 25%) + (Improvement Gain Δ × 10%) + (Checklist Compliance × 20%) + (DFT SSPC PA-2 × 20%) + (Process Inspection × 15%) + (Environmental Psychrometric × 10%)\n\nPassing Qualification Threshold: Composite Score ≥ 80.0% with 0 critical defects.',
      rules: [
        'Stage 1 (s1): Substrate cleanliness must meet Sa 2.5 (Near-White Metal) before primer application.',
        'Overcoating Intervals: Recoat gap between consecutive coats must strictly adhere to product Technical Data Sheets (TDS).',
        'DFT SSPC PA-2: Spot readings must be within 80% to 120% of specified thickness band across all 4 substrate configurations.',
        'Environmental Limit: Relative Humidity (RH) ≤ 85% and Steel Metal Temp (MT) must exceed Dew Point (DP) by at least 3.0°C.'
      ],
      advice:
        'Ensure stripe coating is thoroughly applied on all welds, edges, bolts, and tight angles prior to full airless spray fan application.'
    });
  };

  // Sub-Tool View Router
  const renderSubTool = () => {
    switch (currentSubTool) {
      case 'hub':
        return (
          <PainterHub
            reports={reports}
            evaluation={evaluation}
            onNavigate={onNavigate}
            onLoadPreset={handleLoadPreset}
          />
        );

      case 'dashboard':
        return (
          <PainterDashboard
            formData={state}
            evaluation={evaluation}
            onNavigate={onNavigate}
          />
        );

      case 'info':
      case 'project-info':
      case 'project_info':
        return (
          <PainterProjectInfo
            formData={state}
            onChange={handleFieldChange}
            onPhotoUpload={handlePhotoUpload}
            onPhotoRemove={handlePhotoRemove}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 'train':
      case 'training-test':
      case 'training_test':
        return (
          <PainterTrainingTest
            formData={state}
            onChange={handleFieldChange}
            evaluation={evaluation}
          />
        );

      case 'checklist':
        return (
          <PainterChecklist
            formData={state}
            onChange={handleFieldChange}
            evaluation={evaluation}
          />
        );

      case 's1':
      case 'coat-stage-s1':
      case 'coat_stage_s1':
        return (
          <PainterCoatStage
            sid="s1"
            formData={state}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 's2':
      case 'coat-stage-s2':
      case 'coat_stage_s2':
        return (
          <PainterCoatStage
            sid="s2"
            formData={state}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 's3':
      case 'coat-stage-s3':
      case 'coat_stage_s3':
        return (
          <PainterCoatStage
            sid="s3"
            formData={state}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 's4':
      case 'coat-stage-s4':
      case 'coat_stage_s4':
        return (
          <PainterCoatStage
            sid="s4"
            formData={state}
            onChange={handleFieldChange}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 'photo':
      case 'photo-report':
      case 'photo_report':
        return (
          <PainterPhotoReport
            formData={state}
            onChange={handleFieldChange}
          />
        );

      case 'verdict':
      case 'verdict-approval':
      case 'verdict_approval':
        return (
          <PainterVerdictApproval
            formData={state}
            onChange={handleFieldChange}
            evaluation={evaluation}
            onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
            onStampUpload={handleStampUpload}
            onStampRemove={handleStampRemove}
          />
        );

      case 'summary':
        return (
          <PainterSummary
            formData={state}
            evaluation={evaluation}
            onNavigate={onNavigate}
          />
        );

      case 'register':
        return (
          <PainterRegister
            reports={reports}
            onLoadReport={handleLoadReport}
            onDuplicateReport={handleDuplicateReport}
            onDeleteReport={handleDeleteReport}
            onPrintReport={(r) => {
              setState(r.data);
              setIsPreviewModalOpen(true);
            }}
            onExportCSV={handleExportCSV}
          />
        );

      case 'preview':
        return (
          <PainterSummary
            formData={state}
            evaluation={evaluation}
            onNavigate={onNavigate}
          />
        );

      default:
        return (
          <PainterHub
            reports={reports}
            evaluation={evaluation}
            onNavigate={onNavigate}
            onLoadPreset={handleLoadPreset}
          />
        );
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200 font-sans">
      
      {/* Sticky Progress Freeze Bar */}
      <PainterFreezeBar
        currentSubTool={currentSubTool}
        evaluation={evaluation}
        formData={state}
        onNavigate={onNavigate}
        onReset={handleResetState}
      />

      {/* Action Toolbar */}
      <div className="bg-white rounded-2xl border border-[#D8DEE5] p-3.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#4E5B6A] bg-[#F7F8FA] hover:bg-[#FFF4E3] hover:text-[#9E1B1E] border border-[#D8DEE5] transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider text-white bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier (A4)</span>
          </button>

          <button
            type="button"
            onClick={handleSyncCoatingSystem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#9E1B1E] bg-[#FFF4E3] hover:bg-[#FEE9C7] border border-[#F3D2A0] transition cursor-pointer"
            title="Push Coating System spec into Stages s1..s4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Sync System to Stages</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCompanyModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4E5B6A] hover:text-[#9E1B1E] hover:bg-[#FFF4E3] border border-[#D8DEE5] transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Company Branding</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWatermarkModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4E5B6A] hover:text-[#9E1B1E] hover:bg-[#FFF4E3] border border-[#D8DEE5] transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Watermark</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGuideline}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#9E1B1E] bg-[#FFF4E3] hover:bg-[#FEE9C7] border border-[#F3D2A0] transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Standards &amp; Guideline</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-Tool Component */}
      {renderSubTool()}

      {/* Modals Suite */}
      <PainterTestCatalogModal
        isOpen={isTestCatalogOpen}
        onClose={() => setIsTestCatalogOpen(false)}
        onSelectTest={handleSelectCatalogTest}
        activeCoatSID={activeCatalogCoatSID}
      />

      <PainterApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirmApprove={handleApproveReport}
        formData={state}
        evaluation={evaluation}
      />

      <PainterCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          if (currentSubTool === 'company-details' || currentSubTool === 'company_details') {
            if (onNavigate) onNavigate('painter-qualification', 'hub');
          }
        }}
        company={company}
        onChange={handleCompanyChange}
      />

      <PainterWatermarkControl
        isOpen={isWatermarkModalOpen}
        onClose={() => {
          setIsWatermarkModalOpen(false);
          if (currentSubTool === 'watermark') {
            if (onNavigate) onNavigate('painter-qualification', 'hub');
          }
        }}
        watermark={watermark}
        onChange={handleWatermarkChange}
      />

      <PainterPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          if (currentSubTool === 'preview' || currentSubTool === 'report') {
            if (onNavigate) onNavigate('painter-qualification', 'hub');
          }
        }}
        formData={state}
        evaluation={evaluation}
        company={company}
        watermark={watermark}
        onPrint={handlePrint}
      />

    </div>
  );
}
