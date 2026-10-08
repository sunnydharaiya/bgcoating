import React, { useState, useEffect, useMemo } from 'react';
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

// Sub-tool components
import ManpowerFreezeBar from '../tools/manpower/ManpowerFreezeBar';
import ManpowerHub from '../tools/manpower/ManpowerHub';
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

export default function ManpowerEstimationPage({ currentSubTool = 'hub', onNavigate }) {
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
        setActiveTab(currentSubTool);
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

  // Modals
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_manpower_draft', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save manpower draft', e);
    }
  }, [state]);

  // Save records
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_manpower_records', JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save manpower records', e);
    }
  }, [reports]);

  // Save company
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_company_profile', JSON.stringify(company));
    } catch (e) {
      console.error('Failed to save company profile', e);
    }
  }, [company]);

  // Save watermark
  useEffect(() => {
    try {
      localStorage.setItem('bg_os_watermark_settings', JSON.stringify(watermark));
    } catch (e) {
      console.error('Failed to save watermark settings', e);
    }
  }, [watermark]);

  // Compute reactive engineering metrics
  const metrics = useMemo(() => {
    return calculateManpowerEstimation(state);
  }, [state]);

  // Navigation Handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onNavigate) {
      onNavigate('manpower-estimation', tabId);
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
  const handleReset = () => {
    if (window.confirm('Reset all estimation fields back to blank?')) {
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
      addToast('Estimation reset complete', 'info');
    }
  };

  // Save Report Record
  const handleSaveReport = (status = 'Draft') => {
    const reportId = state.id || `pe_${Date.now()}`;
    const newRecord = {
      id: reportId,
      estNo: state.estNo || 'EST-DRAFT',
      proj: state.projectName || 'Untitled Project',
      cust: state.customer || 'Untitled Customer',
      area: metrics.area,
      blast: metrics.blastTotal,
      paint: metrics.paintTotal,
      raw: metrics.rawTotal,
      grand: metrics.grandTotal,
      pm2: metrics.costPerM2,
      currency: state.currency || 'INR',
      status: status,
      savedAt: new Date().toISOString(),
      snap: state
    };

    setReports(prev => {
      const idx = prev.findIndex(r => r.id === reportId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });

    setState(prev => ({ ...prev, id: reportId }));
    addToast(status === 'Approved' ? '✓ Estimation marked as Approved & saved!' : '💾 Draft saved to Report Register', 'success');
  };

  // Handle header actions from top bar (Preview, Save Draft, Validate, Register, Reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const { action } = e.detail || {};
      if (action === 'save-draft') {
        handleSaveReport('Draft');
      } else if (action === 'preview') {
        setIsPreviewModalOpen(true);
      } else if (action === 'validate') {
        setIsApprovalModalOpen(true);
      } else if (action === 'register') {
        handleTabChange('register');
      } else if (action === 'reset') {
        handleReset();
      }
    };
    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [state, metrics]);

  // Load Report Record
  const handleLoadReport = (record) => {
    if (record.snap) {
      setState(record.snap);
      setActiveTab('summary');
      addToast(`Loaded estimation: ${record.estNo || record.proj}`, 'success');
    }
  };

  // Duplicate Report
  const handleCopyReport = (record) => {
    if (record.snap) {
      const cloned = {
        ...record.snap,
        id: `pe_${Date.now()}`,
        estNo: `${record.estNo || 'EST'} - COPY`,
        projectName: `${record.proj || 'Project'} (Copy)`
      };
      setState(cloned);
      handleSaveReport('Draft');
      addToast('Estimation duplicated as new draft', 'info');
    }
  };

  // Delete Report
  const handleDeleteReport = (id) => {
    if (window.confirm('Delete this estimation record from register?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      addToast('Record deleted from register', 'info');
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

  return (
    <div className="w-full text-[#1B222C] font-sans">
      
      {/* Top Sticky Freeze Dashboard Bar (Only in sub-tools) */}
      {activeTab !== 'hub' && (
        <ManpowerFreezeBar
          state={state}
          metrics={metrics}
          onReset={handleReset}
        />
      )}

      {/* Main Container */}
      <div className="w-full space-y-6">
        
        {/* Sub-Navigation Tabs & Top Action Strip (Only in sub-tools) */}
        {activeTab !== 'hub' && (
          <div className="bg-white border border-[#D8DEE5] rounded-xl p-2 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Horizontal Scrollable Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                        : 'text-[#4E5B6A] hover:text-[#1B222C] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#F3D2A0] bg-[#FFF4E3] text-xs font-semibold text-[#9E1B1E] hover:bg-[#FEE9C7] transition cursor-pointer"
                title="Configure Company Details & Logo"
              >
                <Building2 className="w-3.5 h-3.5 text-[#E87B1E]" />
                <span className="hidden sm:inline">Company</span>
              </button>

              <button
                onClick={() => setIsWatermarkModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#F3D2A0] bg-[#FFF4E3] text-xs font-semibold text-[#9E1B1E] hover:bg-[#FEE9C7] transition cursor-pointer"
                title="Watermark Security Control"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E87B1E]" />
                <span className="hidden sm:inline">Watermark</span>
              </button>

              <button
                onClick={handleOpenGuideline}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] text-xs font-semibold text-[#4E5B6A] hover:bg-[#E6E8EC] transition cursor-pointer"
                title="Engineering Guidelines & Formulas"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Norms</span>
              </button>

              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

          </div>
        )}

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

          {activeTab === 'project-info' && (
            <ManpowerProjectInfo
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'blasting' && (
            <ManpowerBlastingCost
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'painting' && (
            <ManpowerPaintingCost
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'raw-material' && (
            <ManpowerRawMaterial
              state={state}
              onChange={handleFieldChange}
              metrics={metrics}
              onNavigate={handleTabChange}
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
            />
          )}

          {activeTab === 'register' && (
            <ManpowerRegister
              reports={reports}
              onLoadReport={handleLoadReport}
              onPrintReport={(r) => {
                handleLoadReport(r);
                setTimeout(() => window.print(), 200);
              }}
              onPreviewReport={(r) => {
                handleLoadReport(r);
                setIsPreviewModalOpen(true);
              }}
              onCopyReport={handleCopyReport}
              onDeleteReport={handleDeleteReport}
              onNewEstimation={() => {
                handleReset();
                setActiveTab('project-info');
              }}
            />
          )}
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Preview Modal */}
      <ManpowerPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        state={state}
        metrics={metrics}
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
        state={state}
        metrics={metrics}
        company={company}
        watermark={watermark}
      />

    </div>
  );
}
