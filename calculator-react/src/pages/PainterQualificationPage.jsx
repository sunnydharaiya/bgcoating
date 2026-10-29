// src/pages/PainterQualificationPage.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';
import { painterService } from '../services/painterService';
import { 
  INITIAL_PAINTER_STATE, 
  calculatePainterQualification,
  PAINTER_PRESETS,
  COAT_SIDS
} from '../data/painterDatabase';

// Sub-Tool Components
import PainterFreezeBar from '../tools/painter/PainterFreezeBar';
import PainterHub from '../tools/painter/PainterHub';
import PainterProjectInfo from '../tools/painter/PainterProjectInfo';
import PainterTrainingTest from '../tools/painter/PainterTrainingTest';
import PainterChecklist from '../tools/painter/PainterChecklist';
import PainterCoatStage from '../tools/painter/PainterCoatStage';
import PainterPhotoReport from '../tools/painter/PainterPhotoReport';
import PainterVerdictApproval from '../tools/painter/PainterVerdictApproval';
import PainterSummary from '../tools/painter/PainterSummary';
import PainterRegister from '../tools/painter/PainterRegister';
import PainterCompanySheet from '../tools/painter/PainterCompanySheet';
import PainterWatermarkSheet from '../tools/painter/PainterWatermarkSheet';

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
  const [previewRecord, setPreviewRecord] = useState(null);

  // Dynamic preview evaluation for read-only preview modal
  const previewEvaluation = useMemo(() => {
    return calculatePainterQualification(previewRecord || state);
  }, [previewRecord, state]);

  // Evaluate current state
  const evaluation = calculatePainterQualification(state);

  // Initial remote hydration for working draft and register
  useEffect(() => {
    let isMounted = true;

    // 1. Hydrate active draft
    painterService.getDraft().then(remoteDraft => {
      if (isMounted && remoteDraft && Object.keys(remoteDraft).length > 0) {
        setState(remoteDraft);
      }
    }).catch(err => {
      console.warn('[PainterPage] Remote draft fetch error:', err);
    });

    // 2. Hydrate saved reports register
    painterService.getReports().then(remoteReports => {
      if (isMounted && Array.isArray(remoteReports) && remoteReports.length > 0) {
        setReports(remoteReports);
      }
    }).catch(err => {
      console.warn('[PainterPage] Remote reports fetch error:', err);
    });

    return () => { isMounted = false; };
  }, []);

  // Debounced auto-save (800ms) to backend draft endpoint
  const debounceTimerRef = useRef(null);
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      painterService.saveDraft(state, evaluation).catch(() => {});
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state, evaluation]);

  // Persist reports
  useEffect(() => {
    try {
      localStorage.setItem(REGISTER_KEY, JSON.stringify(reports));
    } catch (err) {
      console.warn('Failed to save reports to localStorage:', err);
    }
  }, [reports]);

  // Persist company
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (err) {
      console.warn('Failed to save company to localStorage:', err);
    }
  }, [company]);

  // Persist watermark
  useEffect(() => {
    try {
      localStorage.setItem(WATERMARK_KEY, JSON.stringify(watermark));
    } catch (err) {
      console.warn('Failed to save watermark to localStorage:', err);
    }
  }, [watermark]);

  // Handle field update in state
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

  // Reset working state and clear active draft
  const handleResetState = async () => {
    if (window.confirm('Are you sure you want to reset the current Spray Painter Qualification report to a blank template? All unsaved data will be cleared.')) {
      setState(INITIAL_PAINTER_STATE);
      await painterService.clearDraft();
      addToast('Draft Reset', 'Working draft has been cleared from local storage and server.', 'info');
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
        shade: cs.color || updatedSheets[sid]?.shade || '',
        dftMin: cs.min || updatedSheets[sid]?.dftMin || '',
        dftMax: cs.max || updatedSheets[sid]?.dftMax || '',
        cumDFTRequired: `${cumMin} – ${cumMax} µm`
      };

      // Also sync into coatDFT bounds
      updatedDFT[sid] = {
        ...(updatedDFT[sid] || {}),
        min: cs.min || updatedDFT[sid]?.min || '',
        max: cs.max || updatedDFT[sid]?.max || ''
      };
    });

    setState(prev => ({
      ...prev,
      _coatSheets: updatedSheets,
      _coatDFT: updatedDFT
    }));

    addToast('System Synchronized', 'Coating system pushed into Stages 1 through 4.', 'success');
  };

  const handleSelectCatalogTest = (test) => {
    if (!test || !activeCatalogCoatSID) return;
    const coatSheet = state._coatSheets?.[activeCatalogCoatSID] || {};
    const existingTests = coatSheet.tests || [];
    const newTest = {
      t: test.t,
      std: test.std,
      req: test.req,
      act: '',
      res: ''
    };

    const updatedSheets = { ...(state._coatSheets || {}) };
    updatedSheets[activeCatalogCoatSID] = {
      ...coatSheet,
      tests: [...existingTests, newTest]
    };

    setState(prev => ({
      ...prev,
      _coatSheets: updatedSheets
    }));

    addToast('Test Added', `Added "${test.t}" to ${activeCatalogCoatSID.toUpperCase()}.`, 'info');
  };

  const handleOpenTestCatalog = (sid) => {
    setActiveCatalogCoatSID(sid);
    setIsTestCatalogOpen(true);
  };

  // Save report to master register and remote database
  const handleSaveDraft = async () => {
    try {
      const saved = await painterService.saveReport(state, 'Draft', evaluation);
      setReports(prev => [saved, ...prev.filter(r => r.repNo !== saved.repNo)]);
      addToast('Draft Saved', `Qualification report "${saved.repNo}" saved to master register.`, 'success');
    } catch (err) {
      console.warn('Failed to save painter draft to backend:', err);
      addToast('Save Failed', 'Saved locally, but server sync failed.', 'warning');
    }
  };

  const handleValidateAndApprove = () => {
    setIsApprovalModalOpen(true);
  };

  const handleApproveReport = async (status = 'Approved') => {
    try {
      const approved = await painterService.saveReport(state, status, evaluation);
      setReports(prev => [approved, ...prev.filter(r => r.repNo !== approved.repNo)]);
      addToast('Report Issued', `Report "${approved.repNo}" officially marked as ${status}.`, 'success');
    } catch (err) {
      console.warn('Failed to approve report on backend:', err);
      addToast('Approval Failed', 'Marked locally, but server sync failed.', 'warning');
    }
  };

  const handleLoadReport = (record) => {
    if (record && record.data) {
      if (window.confirm(`Load report "${record.repNo}" for ${record.name}? This will replace current draft.`)) {
        setState(record.data);
        addToast('Report Loaded', `Loaded "${record.repNo}".`, 'info');
        handleNavigateSub('info');
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
    handleNavigateSub('info');
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Delete this qualification report record from register?')) {
      await painterService.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
      addToast('Record Deleted', 'Qualification report removed from register.', 'info');
    }
  };

  // 1-Click Benchmark Sample Dossier Loader
  const handleLoadSampleRecord = async () => {
    try {
      const existing = await painterService.getReports({ search: 'SP-QR-2026-TARIQ-001' });
      let sample = existing.find(r => r.repNo === 'SP-QR-2026-TARIQ-001');
      if (!sample) {
        sample = await painterService.saveReport({
          'f-rep-no': 'SP-QR-2026-TARIQ-001',
          'f-name': 'Mohammad Tariq',
          'f-category': 'Airless Spray Painter',
          'f-civil': 'CID-8829471',
          'f-proj': 'Offshore Topsides Gas Flare Platform',
          'f-proj-no': 'PRJ-2026-FLARE-09',
          'f-client': 'Aramco / Offshore Energy Corp',
          'f-contractor': 'BG Engineering & Contracting Ltd',
          'f-location': 'Fabrication Yard 4 · Blast & Paint Bay',
          'f-qual-date': '2026-10-28',
          'f-next-date': '2027-10-28',
          overall: 95.5,
          verdict: 'PASS',
          status: 'Approved',
          data: INITIAL_PAINTER_STATE
        }, 'Approved', { overall: 95.5, verdict: 'PASS' });
      }
      setReports(prev => [sample, ...prev.filter(r => r.repNo !== sample.repNo)]);
      addToast('Sample Loaded', 'Loaded benchmark qualification dossier SP-QR-2026-TARIQ-001 into register.', 'success');
    } catch (err) {
      console.warn('Failed to load sample painter record:', err);
      addToast('Load Failed', 'Could not load benchmark record.', 'error');
    }
  };

  const handleClearAllReports = () => {
    if (window.confirm('Clear all saved reports from register? This cannot be undone.')) {
      setReports([]);
      addToast('Register Cleared', 'All qualification records have been removed.', 'info');
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

  // Flexible navigator helper for subtool navigation
  const handleNavigateSub = (arg1, arg2) => {
    const targetSub = arg2 || arg1;
    if (onNavigate) {
      onNavigate('painter-qualification', targetSub);
    }
  };

  // Listen for Top Header Actions (preview, save-draft, validate, register, reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const action = e.detail?.action;
      if (action === 'save' || action === 'save-draft') handleSaveDraft();
      else if (action === 'validate') handleValidateAndApprove();
      else if (action === 'preview') setIsPreviewModalOpen(true);
      else if (action === 'register') handleNavigateSub('register');
      else if (action === 'reset') handleResetState();
    };

    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [state, evaluation]);

  // Toggle sidebar event dispatcher
  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('bg_toggle_sidebar'));
  };

  // Sub-Tool View Router
  const renderSubTool = () => {
    const commonProps = {
      formData: state,
      onChange: handleFieldChange,
      evaluation,
      onSaveDraft: handleSaveDraft,
      onValidate: handleValidateAndApprove,
      onValidateApprove: handleValidateAndApprove,
      onReset: handleResetState,
      onNavigate: handleNavigateSub
    };

    switch (currentSubTool) {
      case 'hub':
      case 'home':
        return (
          <PainterHub
            reports={reports}
            evaluation={evaluation}
            onNavigate={handleNavigateSub}
            onLoadPreset={handleLoadPreset}
            onNewGeneration={() => {
              setState(INITIAL_PAINTER_STATE);
              handleNavigateSub('info');
            }}
            onOpenPreview={() => setIsPreviewModalOpen(true)}
            onOpenPrint={() => window.print()}
          />
        );

      case 'info':
      case 'project-info':
      case 'project_info':
      case 'project-operator':
      case 'project_operator':
        return (
          <PainterProjectInfo
            {...commonProps}
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
            {...commonProps}
          />
        );

      case 'checklist':
        return (
          <PainterChecklist
            {...commonProps}
          />
        );

      case 's1':
      case 'coat-stage-s1':
      case 'coat_stage_s1':
        return (
          <PainterCoatStage
            sid="s1"
            {...commonProps}
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
            {...commonProps}
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
            {...commonProps}
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
            {...commonProps}
            onOpenTestCatalog={handleOpenTestCatalog}
            onSyncCoatingSystem={handleSyncCoatingSystem}
          />
        );

      case 'photo':
      case 'photo-report':
      case 'photo_report':
        return (
          <PainterPhotoReport
            {...commonProps}
          />
        );

      case 'verdict':
      case 'verdict-approval':
      case 'verdict_approval':
        return (
          <PainterVerdictApproval
            {...commonProps}
            onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
            onStampUpload={handleStampUpload}
            onStampRemove={handleStampRemove}
          />
        );

      case 'summary':
      case 'preview':
        return (
          <PainterSummary
            {...commonProps}
          />
        );

      case 'reports':
      case 'register':
      case 'report-register':
      case 'report_register':
      case 'saved-reports':
      case 'saved_reports':
        return (
          <PainterRegister
            reports={reports}
            onLoadReport={handleLoadReport}
            onViewReport={(r) => {
              setPreviewRecord(r.data || r);
              setIsPreviewModalOpen(true);
            }}
            onDuplicateReport={handleDuplicateReport}
            onDeleteReport={handleDeleteReport}
            onPrintReport={(r) => {
              setPreviewRecord(r.data || r);
              setIsPreviewModalOpen(true);
            }}
            onExportCSV={handleExportCSV}
            onNewGeneration={() => {
              setState(INITIAL_PAINTER_STATE);
              handleNavigateSub('info');
            }}
            onSaveActiveReport={handleSaveDraft}
            onLoadSampleRecord={handleLoadSampleRecord}
            onClearAll={handleClearAllReports}
          />
        );

      case 'company':
      case 'company-details':
      case 'company_details':
        return (
          <PainterCompanySheet
            company={company}
            onChange={handleCompanyChange}
            onNavigate={handleNavigateSub}
            onSaveDraft={handleSaveDraft}
            onValidate={handleValidateAndApprove}
          />
        );

      case 'watermark':
        return (
          <PainterWatermarkSheet
            watermark={watermark}
            onChange={handleWatermarkChange}
            onNavigate={handleNavigateSub}
            onSaveDraft={handleSaveDraft}
            onValidate={handleValidateAndApprove}
          />
        );

      case 'print':
      case 'report':
        // Show summary and trigger print
        return (
          <PainterSummary
            {...commonProps}
          />
        );

      default:
        return (
          <PainterHub
            reports={reports}
            evaluation={evaluation}
            onNavigate={handleNavigateSub}
            onLoadPreset={handleLoadPreset}
            onNewGeneration={() => {
              setState(INITIAL_PAINTER_STATE);
              handleNavigateSub('info');
            }}
            onOpenPreview={() => setIsPreviewModalOpen(true)}
            onOpenPrint={() => window.print()}
          />
        );
    }
  };

  const isWorkflowStage = [
    'info', 'project-info', 'project_info',
    'train', 'training-test', 'training_test',
    'checklist',
    's1', 'coat-stage-s1', 'coat_stage_s1',
    's2', 'coat-stage-s2', 'coat_stage_s2',
    's3', 'coat-stage-s3', 'coat_stage_s3',
    's4', 'coat-stage-s4', 'coat_stage_s4',
    'photo', 'photo-report', 'photo_report',
    'verdict', 'verdict-approval', 'verdict_approval'
  ].includes(currentSubTool);

  return (
    <div className="coatingos-root w-full">
      {/* 2. Authentic CoatingOS Hero Banner */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-in">
          <div>
            <div className="hkick">
              <span className="hdot" />Operator Qualification · Spray Painter · Paint Applicator
            </div>
            <h1 className="htit">
              Spray Painter Qualification &amp;<br />
              <em>Coating Application Report System</em>
            </h1>
            <p className="hsub">
              Enterprise-grade digital qualification platform for paint applicators with real-time DFT/WFT compliance per SSPC PA-2 (80%-120% rule), dew-point monitoring, pot-life tracking, 3-coat system management, defect identification, adhesion &amp; holiday testing, multi-stage approval workflow, operator-photo certificates and MNC-grade printable reports for EPC, refinery, offshore &amp; petrochemical operations.
            </p>
            <div className="hstds">
              <span className="hstd">ASTM D4228</span>
              <span className="hstd">SSPC PA-2</span>
              <span className="hstd">ASTM D4414 (WFT)</span>
              <span className="hstd">ASTM D7091 (DFT)</span>
              <span className="hstd">ISO 19840</span>
              <span className="hstd">ISO 2808</span>
              <span className="hstd">ASTM D3359 (Adh.)</span>
              <span className="hstd">ASTM D4541 (Pull-Off)</span>
              <span className="hstd">ASTM D5162 (Holiday)</span>
              <span className="hstd">ASTM D3276</span>
              <span className="hstd">NACE / AMPP</span>
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-card">
              <div className="hero-card-ic">📋</div>
              <div>
                <div className="hero-card-l">Report ID</div>
                <div className="hero-card-v" id="hero-rep-id">
                  {state['f-rep-no'] || 'Pending — Save / Validate'}
                </div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-ic">🎯</div>
              <div>
                <div className="hero-card-l">Status</div>
                <div className="hero-card-v" id="hero-status">
                  {evaluation?.verdict === 'PASS'
                    ? 'Qualified'
                    : evaluation?.verdict === 'FAIL'
                    ? 'Rejected'
                    : 'In Progress'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Wrap Container */}
      <div className="wrap">
        {/* Sticky Freeze Progress Bar (Shown during workflow sheets) */}
        {isWorkflowStage && (
          <PainterFreezeBar
            currentSubTool={currentSubTool}
            evaluation={evaluation}
            formData={state}
            onNavigate={handleNavigateSub}
          />
        )}

        {/* Sub-Tool Active Sheet */}
        {renderSubTool()}
      </div>

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
        onClose={() => setIsCompanyModalOpen(false)}
        company={company}
        onChange={handleCompanyChange}
      />

      <PainterWatermarkControl
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        watermark={watermark}
        onChange={handleWatermarkChange}
      />

      <PainterPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewRecord(null);
        }}
        formData={previewRecord || state}
        evaluation={previewEvaluation}
        company={company}
        watermark={watermark}
        onPrint={handlePrint}
      />
    </div>
  );
}
