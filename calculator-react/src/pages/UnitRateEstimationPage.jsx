import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, 
  Coins, 
  Layers, 
  Building2, 
  Flame, 
  FileText, 
  BarChart3, 
  Printer, 
  Eye, 
  FolderArchive, 
  DollarSign, 
  Sparkles,
  RotateCcw,
  Save,
  CheckCircle2,
  Settings
} from 'lucide-react';

import { 
  CURRENCY_CONFIG, 
  DEFAULT_EST_ROWS, 
  INITIAL_UNITRATE_STATE 
} from '../data/unitRateDatabase';

import UnitRateHub from '../tools/unitrate/UnitRateHub';
import UnitRateProjectInfo from '../tools/unitrate/UnitRateProjectInfo';
import UnitRateScope from '../tools/unitrate/UnitRateScope';
import UnitRateSectionD from '../tools/unitrate/UnitRateSectionD';
import UnitRateSectionF from '../tools/unitrate/UnitRateSectionF';
import UnitRateCostMatrix from '../tools/unitrate/UnitRateCostMatrix';
import UnitRateRevisions from '../tools/unitrate/UnitRateRevisions';
import UnitRateReportView from '../tools/unitrate/UnitRateReportView';
import UnitRatePrintDossier from '../tools/unitrate/UnitRatePrintDossier';
import UnitRateRegister from '../tools/unitrate/UnitRateRegister';
import UnitRatePreviewModal from '../tools/unitrate/UnitRatePreviewModal';
import UnitRateCompanyModal from '../tools/unitrate/UnitRateCompanyModal';
import UnitRateWatermarkControl from '../tools/unitrate/UnitRateWatermarkControl';
import UnitRatePaintModal from '../tools/unitrate/UnitRatePaintModal';
import UnitRateAbrModal from '../tools/unitrate/UnitRateAbrModal';

const DRAFT_KEY = 'bg_os_unitrate_draft';
const RECORDS_KEY = 'bg_os_unitrate_records';
const COMPANY_KEY = 'bg_os_company_profile';
const WATERMARK_KEY = 'bg_os_watermark_settings';

export default function UnitRateEstimationPage({ currentSubTool = 'hub', onNavigate }) {
  // Form State
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load draft from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_UNITRATE_STATE));
  });

  // Saved Records in Register
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(RECORDS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load records from localStorage:', e);
    }
    return [];
  });

  // Company Information
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPANY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      companyName: 'BG COATING & CORROSION ENGINEERING',
      address: 'Industrial Zone, Marine & Offshore Division',
      email: 'commercial@bgcoating.com',
      phone: '+91 22 8899 0011',
      website: 'www.bgcoating.com',
      taxId: 'GSTIN / VAT: 27AABCB1234F1Z9'
    };
  });

  // Watermark Settings
  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem(WATERMARK_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      enabled: true,
      text: 'CONFIDENTIAL COMMERCIAL QUOTATION',
      opacity: 0.08,
      rotation: -30
    };
  });

  // Modals state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [watermarkOpen, setWatermarkOpen] = useState(false);
  const [paintModalOpen, setPaintModalOpen] = useState(false);
  const [abrModalOpen, setAbrModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Active sub-tool handling
  const activeSubTool = currentSubTool || 'hub';

  // Sync subTool routing for modals if routed directly
  useEffect(() => {
    if (activeSubTool === 'watermark') {
      setWatermarkOpen(true);
      setCompanyOpen(false);
      setPreviewOpen(false);
    } else if (activeSubTool === 'company-details' || activeSubTool === 'company_details') {
      setCompanyOpen(true);
      setWatermarkOpen(false);
      setPreviewOpen(false);
    } else if (activeSubTool === 'preview') {
      setPreviewOpen(true);
      setCompanyOpen(false);
      setWatermarkOpen(false);
    } else {
      setWatermarkOpen(false);
      setCompanyOpen(false);
      setPreviewOpen(false);
    }
  }, [activeSubTool]);

  const navigateTo = useCallback((subTool) => {
    if (onNavigate) {
      onNavigate('unit-rate-estimation', subTool);
    }
  }, [onNavigate]);

  // Persist form draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [formData]);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records:', e);
    }
  }, [records]);

  // Calculations Engine
  const metrics = useMemo(() => {
    const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

    // Total Area
    let totalArea = 0;
    (formData.fRows || []).forEach(r => {
      totalArea += parseFloat(r.area) || 0;
    });

    // Subtotals per category
    const subtotals = {
      blast: 0,
      rawpaint: 0,
      rawabr: 0,
      app: 0,
      misc: 0,
      markup: 0
    };

    let directCostTotal = 0;

    (formData.estRows || []).forEach(row => {
      if (row.type === 'row') {
        const rate = parseFloat(row.rate) || 0;
        const area = parseFloat(row.area) || 0;
        const cost = rate * area;
        if (row.cat && subtotals[row.cat] !== undefined) {
          subtotals[row.cat] += cost;
        }
        directCostTotal += cost;
      }
    });

    // Markups calculation (Overhead, Contingency, Profit on direct costs)
    let markupsTotal = 0;
    (formData.estRows || []).forEach(row => {
      if (row.type === 'markup') {
        const pct = parseFloat(row.pct) || 0;
        const markupAmt = directCostTotal * (pct / 100);
        markupsTotal += markupAmt;
      }
    });
    subtotals.markup = markupsTotal;

    const grandTotal = directCostTotal + markupsTotal;
    const costPerM2 = totalArea > 0 ? grandTotal / totalArea : 0;

    return {
      totalArea,
      directCostTotal,
      markupsTotal,
      subtotals,
      grandTotal,
      costPerM2,
      grandTotalFormatted: grandTotal.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      costPerM2Formatted: costPerM2.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  }, [formData]);

  // Completion Progress %
  const completionPct = useMemo(() => {
    const checks = [
      !!(formData.estNo && formData.estNo.trim()),
      !!(formData.projectName && formData.projectName.trim()),
      !!(formData.customer && formData.customer.trim()),
      (formData.specs || []).some(s => s && s.trim()),
      (formData.dRows || []).length > 0 && formData.dRows.some(r => r.comp && r.comp.trim()),
      (formData.fRows || []).length > 0 && formData.fRows.some(r => r.coatFor && r.coatFor.trim()),
      metrics.totalArea > 0,
      metrics.grandTotal > 0
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [formData, metrics]);

  // Helper updates
  const handleUpdateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sync Section D to Section F
  const handleSyncSectionF = () => {
    const dRows = formData.dRows || [];
    const existingF = formData.fRows || [];
    const newF = [];

    dRows
      .filter(d => d.painting === 'YES' && d.comp && d.comp.trim())
      .forEach(d => {
        const sfx = d.surface ? ` of ${d.surface}` : '';
        const coatFor = `${d.comp.trim()}${sfx}`;
        const match = existingF.find(f => f.coatFor === coatFor);
        if (match) {
          newF.push(match);
        } else {
          newF.push({
            coatFor,
            surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
            profile: '50-75 µm',
            primer: 'Zinc Rich Epoxy Primer',
            primerDft: '75',
            primerVs: 65,
            primerPrice: 450,
            inter: 'Epoxy High Build MIO',
            interDft: '125',
            interVs: 75,
            interPrice: 380,
            finish: 'Aliphatic Polyurethane Topcoat',
            finishDft: '50',
            finishVs: 60,
            finishPrice: 520,
            area: '1000'
          });
        }
      });

    setFormData(prev => ({ ...prev, fRows: newF.length ? newF : existingF }));
    setSaveToast('✓ Synced Section F from Section D');
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Rebuild / Sync Section F into Unit Rate Table
  const handleRebuildEstRows = () => {
    const fRows = formData.fRows || [];
    const totalArea = metrics.totalArea;

    // Collect paint generic types & areas
    const paintMap = {};
    fRows.forEach(r => {
      const a = parseFloat(r.area) || 0;
      [r.primer, r.inter, r.finish].forEach(p => {
        if (p && p.trim() && p.toUpperCase() !== 'NA') {
          const name = p.trim();
          paintMap[name] = (paintMap[name] || 0) + a;
        }
      });
    });

    const updatedEst = JSON.parse(JSON.stringify(formData.estRows || DEFAULT_EST_ROWS));

    // Update areas for prep rows
    updatedEst.forEach(r => {
      if (r.type === 'row' && r.src === 'prep') {
        r.area = totalArea;
      }
    });

    // Update Raw Material Paint Category
    const paintCatIdx = updatedEst.findIndex(r => r.type === 'cat' && r.cat === 'rawpaint');
    const paintSubIdx = updatedEst.findIndex((r, idx) => idx > paintCatIdx && r.type === 'subtot' && r.cat === 'rawpaint');

    if (paintCatIdx >= 0 && paintSubIdx >= 0) {
      const paintRows = Object.entries(paintMap).map(([pName, pArea]) => ({
        type: 'row',
        desc: `${pName} Material`,
        rate: 85,
        area: pArea,
        src: 'paint',
        cat: 'rawpaint'
      }));
      updatedEst.splice(paintCatIdx + 1, paintSubIdx - paintCatIdx - 1, ...paintRows);
    }

    // Update Paint Application Category
    const appCatIdx = updatedEst.findIndex(r => r.type === 'cat' && r.cat === 'app');
    const appSubIdx = updatedEst.findIndex((r, idx) => idx > appCatIdx && r.type === 'subtot' && r.cat === 'app');

    if (appCatIdx >= 0 && appSubIdx >= 0) {
      const appRows = Object.entries(paintMap).map(([pName, pArea]) => ({
        type: 'row',
        desc: `Application of ${pName}`,
        rate: 40,
        area: pArea,
        src: 'paint',
        cat: 'app'
      }));
      updatedEst.splice(appCatIdx + 1, appSubIdx - appCatIdx - 1, ...appRows);
    }

    setFormData(prev => ({ ...prev, estRows: updatedEst }));
    setSaveToast('✓ Unit-Rate table synchronized with Section F');
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Save current to Register
  const handleSaveToRegister = (status = 'Draft') => {
    const id = formData.draftId || `est_${Date.now()}`;
    const newEntry = {
      ...formData,
      id,
      status,
      totalArea: metrics.totalArea,
      grandTotal: metrics.grandTotal,
      costPerM2: metrics.costPerM2,
      savedAt: new Date().toISOString()
    };

    setRecords(prev => {
      const idx = prev.findIndex(r => r.id === id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newEntry;
        return updated;
      }
      return [newEntry, ...prev];
    });

    setFormData(prev => ({ ...prev, draftId: id, status }));
    setSaveToast(`✓ Saved to Register as ${status}`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Register callbacks
  const handleLoadRecord = (rec) => {
    setFormData(JSON.parse(JSON.stringify(rec)));
    navigateTo('project-info');
    setSaveToast(`Loaded: ${rec.estNo || 'Estimation'}`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleDuplicateRecord = (rec) => {
    const dup = {
      ...JSON.parse(JSON.stringify(rec)),
      id: `est_${Date.now()}`,
      estNo: `${rec.estNo || 'EST'}-COPY`,
      status: 'Draft',
      savedAt: new Date().toISOString()
    };
    setRecords(prev => [dup, ...prev]);
    setSaveToast(`Duplicated: ${dup.estNo}`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Permanently delete this quotation record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
      setSaveToast('Record deleted');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const handleNewEstimation = () => {
    setFormData(JSON.parse(JSON.stringify(INITIAL_UNITRATE_STATE)));
    navigateTo('project-info');
    setSaveToast('New estimation take-off started');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleResetCurrent = () => {
    if (window.confirm('Reset current fields to defaults?')) {
      setFormData(JSON.parse(JSON.stringify(INITIAL_UNITRATE_STATE)));
      setSaveToast('Fields reset to defaults');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  // Handle header actions from top bar (Preview, Save Draft, Validate, Register, Reset)
  useEffect(() => {
    const handleHeaderAction = (e) => {
      const { action } = e.detail || {};
      if (action === 'save-draft') {
        try {
          const newRec = {
            id: Date.now().toString(),
            estNo: formData.estNo || `EST-${Date.now().toString().slice(-4)}`,
            projectName: formData.projectName || 'Untitled Estimation',
            customer: formData.customer || 'Standard Client',
            status: 'Draft',
            date: new Date().toISOString().slice(0, 10),
            data: JSON.parse(JSON.stringify(formData))
          };
          setRecords(prev => [newRec, ...prev]);
          setSaveToast('✓ Saved Draft to Register');
          setTimeout(() => setSaveToast(''), 3000);
        } catch {}
      } else if (action === 'preview') {
        setPreviewOpen(true);
      } else if (action === 'validate') {
        setSaveToast(`✓ Validation: ${completionPct}% complete`);
        setTimeout(() => setSaveToast(''), 3000);
      } else if (action === 'register') {
        navigateTo('register');
      } else if (action === 'reset') {
        handleResetCurrent();
      }
    };
    window.addEventListener('bg_header_action', handleHeaderAction);
    return () => window.removeEventListener('bg_header_action', handleHeaderAction);
  }, [formData, completionPct, navigateTo]);

  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const subTabs = [
    { id: 'hub', label: 'Hub Overview' },
    { id: 'project-info', label: '01. Project Info' },
    { id: 'scope', label: '02. Scope' },
    { id: 'section-d', label: '03. Temp Data' },
    { id: 'section-f', label: '04. Coating Design' },
    { id: 'cost-matrix', label: '05. Unit-Rate Table' },
    { id: 'revisions', label: '06. Revisions' },
    { id: 'report-view', label: '📊 Executive Report' },
    { id: 'xlprint', label: '📄 Print Quotation' },
    { id: 'register', label: '📁 Register' }
  ];

  return (
    <div className="w-full text-[#1B222C] flex flex-col font-sans">
      
      {/* Sub-Navigation Rail (Only visible when activeSubTool !== 'hub') */}
      {activeSubTool !== 'hub' && (
        <div className="bg-white border-b border-[#E6E8EC] sticky top-0 z-30 shadow-2xs -mt-4 -mx-4 md:-mx-6 mb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
              {subTabs.map((tab) => {
                const isActive = activeSubTool === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateTo(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs">
              <span className="font-mono font-bold text-[#D97706]">
                {completionPct}% Complete
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-mono font-bold text-[#1B222C]">
                {metrics.totalArea.toFixed(1)} m²
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2E7D32] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full">
        {activeSubTool === 'hub' && (
          <UnitRateHub
            formData={formData}
            onUpdateForm={setFormData}
            onNavigateSubTool={navigateTo}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenPrint={() => navigateTo('xlprint')}
            completionPct={completionPct}
            metrics={metrics}
            records={records}
          />
        )}

        {activeSubTool === 'project-info' && (
          <UnitRateProjectInfo
            formData={formData}
            onUpdateField={handleUpdateField}
            onNavigateNext={() => navigateTo('scope')}
            onReset={handleResetCurrent}
          />
        )}

        {activeSubTool === 'scope' && (
          <UnitRateScope
            formData={formData}
            onUpdateField={handleUpdateField}
            onNavigateNext={() => navigateTo('section-d')}
            onNavigatePrev={() => navigateTo('project-info')}
            onReset={handleResetCurrent}
          />
        )}

        {activeSubTool === 'section-d' && (
          <UnitRateSectionD
            formData={formData}
            onUpdateField={handleUpdateField}
            onSyncSectionF={handleSyncSectionF}
            onNavigateNext={() => navigateTo('section-f')}
            onNavigatePrev={() => navigateTo('scope')}
            onReset={handleResetCurrent}
          />
        )}

        {activeSubTool === 'section-f' && (
          <UnitRateSectionF
            formData={formData}
            onUpdateField={handleUpdateField}
            onOpenPaintCalc={() => setPaintModalOpen(true)}
            onNavigateNext={() => navigateTo('cost-matrix')}
            onNavigatePrev={() => navigateTo('section-d')}
            onReset={handleResetCurrent}
          />
        )}

        {activeSubTool === 'cost-matrix' && (
          <UnitRateCostMatrix
            formData={formData}
            onUpdateField={handleUpdateField}
            onRebuildRows={handleRebuildEstRows}
            onOpenPaintCalc={() => setPaintModalOpen(true)}
            onOpenAbrCalc={() => setAbrModalOpen(true)}
            onNavigateNext={() => navigateTo('revisions')}
            onNavigatePrev={() => navigateTo('section-f')}
            onReset={handleResetCurrent}
            metrics={metrics}
          />
        )}

        {activeSubTool === 'revisions' && (
          <UnitRateRevisions
            formData={formData}
            onUpdateField={handleUpdateField}
            onNavigatePrev={() => navigateTo('cost-matrix')}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenPrint={() => navigateTo('xlprint')}
            onReset={handleResetCurrent}
          />
        )}

        {activeSubTool === 'report-view' && (
          <UnitRateReportView
            formData={formData}
            metrics={metrics}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenPrint={() => navigateTo('xlprint')}
            onNavigateSubTool={navigateTo}
          />
        )}

        {activeSubTool === 'xlprint' && (
          <UnitRatePrintDossier
            formData={formData}
            metrics={metrics}
            companyInfo={companyInfo}
            watermark={watermark}
            onBack={() => navigateTo('hub')}
          />
        )}

        {activeSubTool === 'register' && (
          <UnitRateRegister
            records={records}
            onLoadRecord={handleLoadRecord}
            onDuplicateRecord={handleDuplicateRecord}
            onDeleteRecord={handleDeleteRecord}
            onOpenPreviewRecord={(rec) => {
              setFormData(rec);
              setPreviewOpen(true);
            }}
            onOpenPrintRecord={(rec) => {
              setFormData(rec);
              navigateTo('xlprint');
            }}
            onNewEstimation={handleNewEstimation}
          />
        )}

        {/* Fallback */}
        {!subTabs.some(t => t.id === activeSubTool) && (
          <UnitRateHub
            formData={formData}
            onUpdateForm={setFormData}
            onNavigateSubTool={navigateTo}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenPrint={() => navigateTo('xlprint')}
            completionPct={completionPct}
            metrics={metrics}
          />
        )}
      </div>

      {/* Floating Modals */}
      <UnitRatePreviewModal
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          if (activeSubTool === 'preview') navigateTo('hub');
        }}
        formData={formData}
        metrics={metrics}
        companyInfo={companyInfo}
        watermark={watermark}
        onOpenPrint={() => {
          setPreviewOpen(false);
          navigateTo('xlprint');
        }}
      />

      <UnitRateCompanyModal
        isOpen={companyOpen}
        onClose={() => {
          setCompanyOpen(false);
          if (activeSubTool === 'company-details' || activeSubTool === 'company_details') navigateTo('hub');
        }}
        companyInfo={companyInfo}
        onSaveCompanyInfo={(info) => {
          setCompanyInfo(info);
          try {
            localStorage.setItem(COMPANY_KEY, JSON.stringify(info));
          } catch (e) {}
          setSaveToast('✓ Company Profile Updated');
          setTimeout(() => setSaveToast(''), 3000);
        }}
      />

      <UnitRateWatermarkControl
        isOpen={watermarkOpen}
        onClose={() => {
          setWatermarkOpen(false);
          if (activeSubTool === 'watermark') navigateTo('hub');
        }}
        watermark={watermark}
        onSaveWatermark={(wm) => {
          setWatermark(wm);
          try {
            localStorage.setItem(WATERMARK_KEY, JSON.stringify(wm));
          } catch (e) {}
          setSaveToast('✓ Watermark Settings Updated');
          setTimeout(() => setSaveToast(''), 3000);
        }}
      />

      <UnitRatePaintModal
        isOpen={paintModalOpen}
        onClose={() => setPaintModalOpen(false)}
        currency={formData.currency}
        onApplyRate={(appliedRate) => {
          const est = [...(formData.estRows || [])];
          // Find first paint material row or prompt
          const paintRow = est.find(r => r.type === 'row' && r.cat === 'rawpaint');
          if (paintRow) {
            paintRow.rate = appliedRate;
            setFormData(prev => ({ ...prev, estRows: est }));
            setSaveToast(`✓ Applied paint rate: ${currencyObj.sym} ${appliedRate}/m²`);
          } else {
            setSaveToast(`Calculated rate: ${currencyObj.sym} ${appliedRate}/m²`);
          }
          setTimeout(() => setSaveToast(''), 3000);
        }}
      />

      <UnitRateAbrModal
        isOpen={abrModalOpen}
        onClose={() => setAbrModalOpen(false)}
        currency={formData.currency}
        totalProjectArea={metrics.totalArea || 1000}
        onApplyRate={(appliedRate) => {
          const est = [...(formData.estRows || [])];
          const abrRow = est.find(r => r.type === 'row' && r.cat === 'rawabr');
          if (abrRow) {
            abrRow.rate = appliedRate;
            setFormData(prev => ({ ...prev, estRows: est }));
            setSaveToast(`✓ Applied abrasive rate: ${currencyObj.sym} ${appliedRate}/m²`);
          } else {
            setSaveToast(`Calculated rate: ${currencyObj.sym} ${appliedRate}/m²`);
          }
          setTimeout(() => setSaveToast(''), 3000);
        }}
      />
    </div>
  );
}
