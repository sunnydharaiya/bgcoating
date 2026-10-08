import React, { useState, useEffect } from 'react';
import { 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Thermometer, 
  FlaskConical, 
  Palette, 
  Building2, 
  History, 
  FileSpreadsheet, 
  BookOpen, 
  RotateCcw, 
  Save, 
  Printer, 
  CheckCircle2, 
  LayoutDashboard, 
  Eye, 
  Stamp, 
  Sparkles, 
  Sliders 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';

// Import Modular Spec Sub-Components
import SpecHub from '../tools/spec/SpecHub';
import SpecProjectScope from '../tools/spec/SpecProjectScope';
import SpecGeneralReqs from '../tools/spec/SpecGeneralReqs';
import SpecOperatingTemp from '../tools/spec/SpecOperatingTemp';
import SpecSpecialDetails from '../tools/spec/SpecSpecialDetails';
import SpecCoatingDesign from '../tools/spec/SpecCoatingDesign';
import SpecTestingQC from '../tools/spec/SpecTestingQC';
import SpecManufacturers from '../tools/spec/SpecManufacturers';
import SpecRevisionNotes from '../tools/spec/SpecRevisionNotes';
import SpecReportView from '../tools/spec/SpecReportView';
import SpecReportRegister from '../tools/spec/SpecReportRegister';
import SpecWatermarkControl, { DEFAULT_WATERMARK } from '../tools/spec/SpecWatermarkControl';
import SpecCompanyDetailsModal, { DEFAULT_BG_COMPANY } from '../tools/spec/SpecCompanyDetailsModal';
import SpecPreviewModal from '../tools/spec/SpecPreviewModal';

const STORAGE_KEY = 'bg_os_spec_reading_draft';
const COMPANY_STORAGE_KEY = 'bg_company_profile';
const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';

export default function SpecificationReadingPage({ activeSubSection, onNavigateSubSection }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [currentSection, setCurrentSection] = useState(activeSubSection || 'hub');

  // Modals state
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Configuration state
  const [companyProfile, setCompanyProfile] = useState(DEFAULT_BG_COMPANY);
  const [watermarkSettings, setWatermarkSettings] = useState(DEFAULT_WATERMARK);

  // Sync external sub-route if provided
  useEffect(() => {
    if (activeSubSection) {
      if (activeSubSection === 'company_details' || activeSubSection === 'company-details' || activeSubSection === 'company') {
        setCompanyModalOpen(true);
        setPreviewModalOpen(false);
      } else if (activeSubSection === 'preview') {
        setPreviewModalOpen(true);
        setCompanyModalOpen(false);
      } else {
        setCompanyModalOpen(false);
        setPreviewModalOpen(false);
        setCurrentSection(activeSubSection);
      }
    }
  }, [activeSubSection]);

  // Listen to Global Top Header Action Events
  useEffect(() => {
    const handleAction = (e) => {
      const page = e.detail?.page;
      if (page === 'specification-reading' || page === 'design') {
        const action = e.detail?.action;
        if (action === 'preview') {
          setPreviewModalOpen(true);
        } else if (action === 'save-draft') {
          handleSaveDraft();
        } else if (action === 'validate') {
          handleSectionChange('coating_design');
        } else if (action === 'register') {
          handleSectionChange('register');
        } else if (action === 'reset') {
          handleGlobalReset();
        } else if (action === 'start-extraction' || action === 'new-generation') {
          handleSectionChange('scope');
        }
      }
    };
    window.addEventListener('bg_header_action', handleAction);
    return () => window.removeEventListener('bg_header_action', handleAction);
  }, []);

  const handleSectionChange = (secId) => {
    const aliasMap = {
      'secAB': 'scope',
      'project-info': 'scope',
      'scope': 'scope',
      'secC': 'environment',
      'general-requirements': 'environment',
      'environment': 'environment',
      'secD': 'temperatures',
      'temp': 'temperatures',
      'temperatures': 'temperatures',
      'secE': 'special_systems',
      'others': 'special_systems',
      'special_systems': 'special_systems',
      'secF': 'coating_design',
      'coating-system': 'coating_design',
      'coating_design': 'coating_design',
      'secG': 'testing_qc',
      'testing': 'testing_qc',
      'testing_qc': 'testing_qc',
      'secH': 'manufacturers',
      'approved-paint': 'manufacturers',
      'manufacturers': 'manufacturers',
      'secI': 'revisions_notes',
      'secN': 'revisions_notes',
      'revisions': 'revisions_notes',
      'revisions_notes': 'revisions_notes',
      'notes': 'revisions_notes',
      'validate': 'coating_design',
      'report': 'report_register',
      'register': 'report_register',
      'report_register': 'report_register',
      'xlprint': 'report',
      'print': 'report',
      'company': 'company_details',
      'company_details': 'company_details',
      'watermark': 'watermark',
      'hub': 'hub',
      'home': 'hub'
    };
    const target = aliasMap[secId] || secId;

    if (target === 'company_details') {
      setCompanyModalOpen(true);
      if (onNavigateSubSection) onNavigateSubSection('company_details');
      return;
    }
    if (target === 'preview') {
      setPreviewModalOpen(true);
      if (onNavigateSubSection) onNavigateSubSection('preview');
      return;
    }

    setCurrentSection(target);
    if (onNavigateSubSection) {
      onNavigateSubSection(target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Project Info & Scope State (Sections A & B)
  const [projectData, setProjectData] = useState({
    projNo: '',
    dinNo: '',
    projDesc: '',
    custName: '',
    preparedBy: '',
    scopeDesc: ''
  });

  const [scope, setScope] = useState({
    painting: 'YES',
    insulation: 'NO',
    fireproof: 'NO',
    tsa: 'NA',
    galv: 'NO',
    pickling: 'NO'
  });

  const [specs, setSpecs] = useState(['']);

  // 2. Environment & Corrosivity State (Section C)
  const [envData, setEnvData] = useState({
    envCategory: '',
    transpCond: '',
    validReq: '',
    moc: '',
    cyclicService: 'NO',
    cyclicDesc: '',
    designLife: 'H'
  });

  // 3. Operating & Design Temperature Rows (Section D)
  const [dRows, setDRows] = useState([]);

  // 4. Special Details State (Section E)
  const [specialData, setSpecialData] = useState({
    insThk: '',
    insType: '',
    insDesc: '',
    fpThk: '',
    fpType: '',
    fpDesc: '',
    tsaThk: '',
    tsaType: '',
    tsaDesc: '',
    galvThk: '',
    galvType: '',
    galvDesc: '',
    pickThk: '',
    pickType: '',
    pickDesc: ''
  });

  // 5. Coating System Design Rows (Section F)
  const [fRows, setFRows] = useState([]);

  // 6. QC & Testing Requirements (Section G)
  const [qcData, setQcData] = useState({
    labReq: '',
    testCert: '',
    appStd: '',
    appSystem: '',
    testRem: '',
    files: []
  });

  // 7. Approved Manufacturers Matrix (Section H)
  const [hRows, setHRows] = useState([]);
  const [otherColName, setOtherColName] = useState('Other');
  const [other2ColName, setOther2ColName] = useState('Other 2');
  const [specialComment, setSpecialComment] = useState('');

  // 8. Revisions & General Notes (Sections I & N)
  const [iRows, setIRows] = useState([]);
  const [genNotes, setGenNotes] = useState('');

  // Auto-load draft, company, and watermark from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.projectData) setProjectData(parsed.projectData);
        if (parsed.scope) setScope(parsed.scope);
        if (parsed.specs) setSpecs(parsed.specs);
        if (parsed.envData) setEnvData(parsed.envData);
        if (parsed.dRows) setDRows(parsed.dRows);
        if (parsed.specialData) setSpecialData(parsed.specialData);
        if (parsed.fRows) setFRows(parsed.fRows);
        if (parsed.qcData) setQcData(parsed.qcData);
        if (parsed.hRows) setHRows(parsed.hRows);
        if (parsed.otherColName) setOtherColName(parsed.otherColName);
        if (parsed.other2ColName) setOther2ColName(parsed.other2ColName);
        if (parsed.specialComment) setSpecialComment(parsed.specialComment);
        if (parsed.iRows) setIRows(parsed.iRows);
        if (parsed.genNotes) setGenNotes(parsed.genNotes);
      }

      const savedCompany = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (savedCompany) {
        setCompanyProfile(JSON.parse(savedCompany));
      }

      const savedWm = localStorage.getItem(WATERMARK_STORAGE_KEY);
      if (savedWm) {
        setWatermarkSettings(JSON.parse(savedWm));
      }
    } catch (e) {
      console.warn('Failed to load spec reading configuration:', e);
    }
  }, []);

  // Save Draft
  const handleSaveDraft = () => {
    try {
      const draftObj = {
        projectData,
        scope,
        specs,
        envData,
        dRows,
        specialData,
        fRows,
        qcData,
        hRows,
        otherColName,
        other2ColName,
        specialComment,
        iRows,
        genNotes,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftObj));
      addToast('Draft Saved', 'Specification reading draft saved locally.', 'success');
    } catch (e) {
      addToast('Save Error', 'Could not save draft.', 'error');
    }
  };

  const handleGlobalReset = () => {
    if (window.confirm('Clear all specification form inputs?')) {
      localStorage.removeItem(STORAGE_KEY);
      setProjectData({
        projNo: '',
        dinNo: '',
        projDesc: '',
        custName: '',
        preparedBy: '',
        scopeDesc: ''
      });
      setScope({
        painting: 'YES',
        insulation: 'NO',
        fireproof: 'NO',
        tsa: 'NA',
        galv: 'NO',
        pickling: 'NO'
      });
      setSpecs(['']);
      setEnvData({
        envCategory: '',
        transpCond: '',
        validReq: '',
        moc: '',
        cyclicService: 'NO',
        cyclicDesc: '',
        designLife: 'H'
      });
      setDRows([]);
      setSpecialData({
        insThk: '',
        insType: '',
        insDesc: '',
        fpThk: '',
        fpType: '',
        fpDesc: '',
        tsaThk: '',
        tsaType: '',
        tsaDesc: '',
        galvThk: '',
        galvType: '',
        galvDesc: '',
        pickThk: '',
        pickType: '',
        pickDesc: ''
      });
      setFRows([]);
      setQcData({
        labReq: '',
        testCert: '',
        appStd: '',
        appSystem: '',
        testRem: '',
        files: []
      });
      setHRows([]);
      setOtherColName('Other');
      setOther2ColName('Other 2');
      setSpecialComment('');
      setIRows([]);
      setGenNotes('');
      setCurrentSection('hub');
      addToast('Specification Reset', 'All form fields have been reset.', 'info');
    }
  };

  // Preset loader
  const handleApplyPreset = (preset) => {
    setEnvData(prev => ({
      ...prev,
      envCategory: preset.env,
      designLife: preset.durability
    }));

    const newSystemRow = {
      systemFor: 'Process Equipment & Structural Steel',
      surfacePrep: preset.surfacePrep,
      profile: preset.profile,
      primer: preset.primer,
      primerDft: preset.primerDft,
      intermediate: preset.intermediate,
      intermediateDft: preset.intermediateDft,
      finish: preset.finish,
      finishDft: preset.finishDft,
      area: ''
    };

    setFRows([newSystemRow]);
    handleSectionChange('coating_design');
  };

  // Restore spec from Register
  const handleLoadFromRegister = (savedData) => {
    if (savedData.projectData) setProjectData(savedData.projectData);
    if (savedData.scope) setScope(savedData.scope);
    if (savedData.specs) setSpecs(savedData.specs);
    if (savedData.envData) setEnvData(savedData.envData);
    if (savedData.dRows) setDRows(savedData.dRows);
    if (savedData.specialData) setSpecialData(savedData.specialData);
    if (savedData.fRows) setFRows(savedData.fRows);
    if (savedData.qcData) setQcData(savedData.qcData);
    if (savedData.hRows) setHRows(savedData.hRows);
    if (savedData.otherColName) setOtherColName(savedData.otherColName);
    if (savedData.other2ColName) setOther2ColName(savedData.other2ColName);
    if (savedData.specialComment) setSpecialComment(savedData.specialComment);
    if (savedData.iRows) setIRows(savedData.iRows);
    if (savedData.genNotes) setGenNotes(savedData.genNotes);
    setCurrentSection('scope');
  };

  // Sub-Navigation Tabs Rail
  const navTabs = [
    { id: 'hub', label: 'Hub Overview', icon: LayoutDashboard },
    { id: 'scope', label: 'A/B. Scope', icon: Layers },
    { id: 'environment', label: 'C. Environment', icon: ShieldCheck },
    { id: 'temperatures', label: 'D. Temperature', icon: Thermometer },
    { id: 'special_systems', label: 'E. Special Details', icon: FlaskConical },
    { id: 'coating_design', label: 'F. Coating System', icon: Palette },
    { id: 'testing_qc', label: 'G. QC Testing', icon: FlaskConical },
    { id: 'manufacturers', label: 'H. Manufacturers', icon: Building2 },
    { id: 'revisions_notes', label: 'I/N. Revisions', icon: History },
    { id: 'report_register', label: 'Report Register', icon: FileSpreadsheet },
    { id: 'report', label: 'Print Dossier', icon: Printer },
    { id: 'watermark', label: 'Watermark', icon: Stamp, isPro: true }
  ];

  const currentSpecPayload = {
    projectData,
    scope,
    specs,
    envData,
    dRows,
    specialData,
    fRows,
    qcData,
    hRows,
    otherColName,
    other2ColName,
    specialComment,
    iRows,
    genNotes
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Toolbar with Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D8DEE5] rounded-xl px-4 py-3 shadow-[0_2px_8px_rgba(20,24,32,0.06)] print:hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-[#7E8B99]">
          <span className="font-bold text-[#1B222C] font-rajdhani uppercase text-sm">02. Specification Reading</span>
          <span>/</span>
          <span className="text-[#E87B1E] font-bold font-rajdhani uppercase">
            {navTabs.find(t => t.id === currentSection)?.label || 'Hub Overview'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Company Details Pro Button */}
          <button
            type="button"
            onClick={() => setCompanyModalOpen(true)}
            className="px-3 py-1.5 bg-[#FFF4E3] hover:bg-[#FEE9C7] text-[#9E1B1E] border border-[#F3D2A0] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Configure custom company branding for reports"
          >
            <Building2 className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Company Details</span>
            <span className="text-[9px] font-mono px-1 rounded bg-[#F3D2A0] text-[#9E1B1E] font-bold">Pro</span>
          </button>

          {/* Quick Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Open read-only report preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Dossier</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Save draft to local storage"
          >
            <Save className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Save Draft</span>
          </button>

          {/* Reset All Button */}
          <button
            type="button"
            onClick={handleGlobalReset}
            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Clear all fields across all sections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Horizontal Sub-Navigation Tab Rail */}
      <div className="overflow-x-auto pb-1 print:hidden">
        <div className="flex items-center gap-1.5 min-w-max bg-white p-1.5 rounded-xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)]">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSectionChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                    : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7E8B99]'}`} />
                <span>{tab.label}</span>
                {tab.isPro && (
                  <span className={`text-[9px] font-mono px-1 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0]'
                  }`}>
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content View */}
      <div>
        {currentSection === 'hub' && (
          <SpecHub 
            onSelectSection={handleSectionChange}
            onApplyPreset={handleApplyPreset}
            specData={currentSpecPayload}
          />
        )}

        {currentSection === 'scope' && (
          <SpecProjectScope
            projectData={projectData}
            setProjectData={setProjectData}
            scope={scope}
            setScope={setScope}
            specs={specs}
            setSpecs={setSpecs}
            onNext={() => handleSectionChange('environment')}
          />
        )}

        {currentSection === 'environment' && (
          <SpecGeneralReqs
            envData={envData}
            setEnvData={setEnvData}
            onNext={() => handleSectionChange('temperatures')}
          />
        )}

        {currentSection === 'temperatures' && (
          <SpecOperatingTemp
            dRows={dRows}
            setDRows={setDRows}
            onNext={() => handleSectionChange('special_systems')}
          />
        )}

        {currentSection === 'special_systems' && (
          <SpecSpecialDetails
            specialData={specialData}
            setSpecialData={setSpecialData}
            onNext={() => handleSectionChange('coating_design')}
          />
        )}

        {currentSection === 'coating_design' && (
          <SpecCoatingDesign
            fRows={fRows}
            setFRows={setFRows}
            dRows={dRows}
            onNext={() => handleSectionChange('testing_qc')}
          />
        )}

        {currentSection === 'testing_qc' && (
          <SpecTestingQC
            qcData={qcData}
            setQcData={setQcData}
            onNext={() => handleSectionChange('manufacturers')}
          />
        )}

        {currentSection === 'manufacturers' && (
          <SpecManufacturers
            hRows={hRows}
            setHRows={setHRows}
            fRows={fRows}
            otherColName={otherColName}
            setOtherColName={setOtherColName}
            other2ColName={other2ColName}
            setOther2ColName={setOther2ColName}
            specialComment={specialComment}
            setSpecialComment={setSpecialComment}
            onNext={() => handleSectionChange('revisions_notes')}
          />
        )}

        {currentSection === 'revisions_notes' && (
          <SpecRevisionNotes
            iRows={iRows}
            setIRows={setIRows}
            genNotes={genNotes}
            setGenNotes={setGenNotes}
            onNext={() => handleSectionChange('report')}
          />
        )}

        {currentSection === 'report_register' && (
          <SpecReportRegister
            currentSpec={currentSpecPayload}
            onLoadSpec={handleLoadFromRegister}
            onNewGeneration={handleGlobalReset}
            onOpenPreview={(data) => setPreviewModalOpen(true)}
            onPrint={() => handleSectionChange('report')}
          />
        )}

        {(currentSection === 'report' || currentSection === 'preview') && (
          <SpecReportView
            projectData={projectData}
            scope={scope}
            specs={specs}
            envData={envData}
            dRows={dRows}
            specialData={specialData}
            fRows={fRows}
            qcData={qcData}
            hRows={hRows}
            otherColName={otherColName}
            other2ColName={other2ColName}
            specialComment={specialComment}
            iRows={iRows}
            genNotes={genNotes}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        )}

        {currentSection === 'watermark' && (
          <SpecWatermarkControl
            watermarkSettings={watermarkSettings}
            setWatermarkSettings={setWatermarkSettings}
          />
        )}

        {(currentSection === 'company_details' || currentSection === 'company') && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                    PRO CONFIGURATION
                  </span>
                  <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
                    Company Branding &amp; Dossier Configuration
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Configure your company profile, header contact details, and corporate logo applied across all exported dossiers and previews.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCompanyModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Edit Company Profile</span>
              </button>
            </div>

            {/* Active Company Profile Summary Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-700 mb-4">
                Active Corporate Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Company Name</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{companyProfile.name}</div>
                  <div className="text-slate-600 mt-1">{companyProfile.tagline}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div><span className="text-slate-500">Phone:</span> <span className="font-bold text-slate-900">{companyProfile.phone}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="font-bold text-slate-900">{companyProfile.email}</span></div>
                  <div><span className="text-slate-500">Website:</span> <span className="font-bold text-slate-900">{companyProfile.website}</span></div>
                  <div><span className="text-slate-500">Address:</span> <span className="text-slate-700">{companyProfile.address}</span></div>
                </div>
              </div>
            </div>

            <SpecHub 
              onSelectSection={handleSectionChange}
              onApplyPreset={handleApplyPreset}
              specData={currentSpecPayload}
            />
          </div>
        )}

        {/* Fallback for any unknown route */}
        {!['hub', 'scope', 'environment', 'temperatures', 'special_systems', 'coating_design', 'testing_qc', 'manufacturers', 'revisions_notes', 'report_register', 'report', 'preview', 'watermark', 'company_details', 'company'].includes(currentSection) && (
          <SpecHub 
            onSelectSection={handleSectionChange}
            onApplyPreset={handleApplyPreset}
            specData={currentSpecPayload}
          />
        )}
      </div>

      {/* Global Modals */}
      <SpecCompanyDetailsModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSaveCompany={(company) => setCompanyProfile(company)}
      />

      <SpecPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        specData={currentSpecPayload}
        companyProfile={companyProfile}
        watermarkSettings={watermarkSettings}
      />

    </div>
  );
}
