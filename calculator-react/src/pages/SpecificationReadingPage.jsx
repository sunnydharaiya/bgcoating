import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  Eye, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  RefreshCw, 
  FileSpreadsheet, 
  Printer, 
  Stamp, 
  Sliders, 
  Download,
  Search,
  CheckCircle2,
  Check,
  Clock,
  XCircle,
  Copy,
  Edit3
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useGuideline } from '../context/GuidelineContext';

// Modals
import SpecCompanyDetailsModal, { DEFAULT_BG_COMPANY } from '../tools/spec/SpecCompanyDetailsModal';
import SpecWatermarkControl, { DEFAULT_WATERMARK } from '../tools/spec/SpecWatermarkControl';
import SpecPreviewModal from '../tools/spec/SpecPreviewModal';
import SpecReportView from '../tools/spec/SpecReportView';
import { specificationService } from '../services/specificationService';

const STORAGE_KEY = 'bg_os_spec_reading_draft';
const REGISTER_STORAGE_KEY = 'bg_os_spec_reports_register';
const COMPANY_STORAGE_KEY = 'bg_company_profile';
const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';

// Returns current date in Indian Standard Time (YYYY-MM-DD)
const getIndianDateString = () => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
};

export default function SpecificationReadingPage({ activeSubSection, onNavigateSubSection }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Mode: 'form' (all-in-one accordion), 'report_register', 'report', 'watermark'
  const [currentSection, setCurrentSection] = useState(() => {
    if (
      activeSubSection === 'report_register' || 
      activeSubSection === 'report-register' || 
      activeSubSection === 'register' || 
      activeSubSection === 'saved-reports' ||
      activeSubSection === 'saved_reports'
    ) {
      return 'report_register';
    }
    if (activeSubSection === 'report' || activeSubSection === 'print') {
      return 'report';
    }
    if (activeSubSection === 'watermark') {
      return 'watermark';
    }
    return 'form';
  });

  // Navigate section helper that synchronizes internal view and browser URL via onNavigateSubSection
  const handleNavigateSection = (sec, subSec = 'hub') => {
    setCurrentSection(sec);
    if (onNavigateSubSection) {
      if (sec === 'report_register') {
        onNavigateSubSection('register');
      } else if (sec === 'report') {
        onNavigateSubSection('report');
      } else if (sec === 'watermark') {
        onNavigateSubSection('watermark');
      } else if (sec === 'form') {
        onNavigateSubSection(subSec || 'hub');
      }
    }
  };
  const [selectedReportForView, setSelectedReportForView] = useState(null);

  // Accordion collapsed state for sections
  const [collapsed, setCollapsed] = useState({
    secAB: false, // Section A-B open by default
    secC: true,
    secD: true,
    secE: true,
    secF: true,
    secG: true,
    secH: true,
    secI: true,
    secN: true
  });

  const toggleSec = (secId) => {
    setCollapsed(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const expandAndScroll = (secId) => {
    setCollapsed(prev => ({ ...prev, [secId]: false }));
    setTimeout(() => {
      const el = document.getElementById(secId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Modals state
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);

  // Configuration state
  const [companyProfile, setCompanyProfile] = useState(DEFAULT_BG_COMPANY);
  const [watermarkSettings, setWatermarkSettings] = useState(DEFAULT_WATERMARK);

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
    envRef: '',
    transport: '',
    voyage: '',
    paintValid: '',
    paintReq: 'NA',
    paintReqDoc: '',
    moc: '',
    cyclic: 'NA',
    cyclicDesc: ''
  });

  // 3. Operating & Design Temperature Rows (Section D)
  const [dRows, setDRows] = useState([
    {
      component: '',
      opTemp: '',
      designTemp: '',
      painting: 'YES',
      galv: 'NO',
      tsa: 'NA',
      insulation: 'NO',
      fireproof: 'NO',
      surface: 'External'
    }
  ]);

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

  // 9. Report Register Records State
  const [reports, setReports] = useState([]);
  const [repSearch, setRepSearch] = useState('');
  const [colFilters, setColFilters] = useState({
    dinNo: '',
    projNo: '',
    projDesc: '',
    cust: '',
    prep: '',
    status: ''
  });

  // Debounce & Auto-Save Tracking Refs
  const isInitialLoadedRef = useRef(false);
  const isResettingRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const [autoSaveState, setAutoSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  // Sync external sub-route if provided
  useEffect(() => {
    if (activeSubSection) {
      if (activeSubSection === 'company_details' || activeSubSection === 'company') {
        setCompanyModalOpen(true);
      } else if (activeSubSection === 'preview') {
        setPreviewModalOpen(true);
      } else if (
        activeSubSection === 'report_register' || 
        activeSubSection === 'report-register' || 
        activeSubSection === 'register' ||
        activeSubSection === 'saved-reports' ||
        activeSubSection === 'saved_reports'
      ) {
        handleNavigateSection('report_register');
      } else if (activeSubSection === 'report' || activeSubSection === 'print') {
        handleNavigateSection('report');
      } else if (activeSubSection === 'watermark') {
        handleNavigateSection('watermark');
      } else {
        // Sections in accordion form
        setCurrentSection('form');
        const targetMap = {
          'scope': 'secAB',
          'secAB': 'secAB',
          'project-info': 'secAB',
          'environment': 'secC',
          'secC': 'secC',
          'general-requirements': 'secC',
          'temperatures': 'secD',
          'secD': 'secD',
          'temp': 'secD',
          'special_systems': 'secE',
          'secE': 'secE',
          'others': 'secE',
          'coating_design': 'secF',
          'secF': 'secF',
          'coating-system': 'secF',
          'testing_qc': 'secG',
          'secG': 'secG',
          'testing': 'secG',
          'manufacturers': 'secH',
          'secH': 'secH',
          'approved-paint': 'secH',
          'revisions_notes': 'secI',
          'secI': 'secI',
          'revisions': 'secI',
          'notes': 'secN',
          'secN': 'secN',
          'validate': 'secValidate',
          'secValidate': 'secValidate'
        };
        const secId = targetMap[activeSubSection];
        if (secId) {
          expandAndScroll(secId);
        }
      }
    }
  }, [activeSubSection]);

  // 1-Minute Guest Preview Timer: If user is not logged in after 1 minute on Specification Reading,
  // trigger static backdrop login modal to preserve and claim their specification dossier.
  useEffect(() => {
    const isLogged = Boolean(
      localStorage.getItem('bg_auth_logged_in') === 'true'
    );
    if (isLogged) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('bg_guest_calc_start');
        sessionStorage.removeItem('bg_guest_timer_done');
      }
      return;
    }

    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bg_guest_timer_done') === 'true') {
      window.dispatchEvent(new CustomEvent('bg_open_auth_modal', { 
        detail: { isCompulsory: true } 
      }));
      return;
    }

    let startTime = 0;
    if (typeof sessionStorage !== 'undefined') {
      const storedStart = sessionStorage.getItem('bg_guest_calc_start');
      if (storedStart) {
        startTime = parseInt(storedStart, 10);
      }
      if (!startTime || isNaN(startTime)) {
        startTime = Date.now();
        sessionStorage.setItem('bg_guest_calc_start', startTime.toString());
      }
    } else {
      startTime = Date.now();
    }

    const ONE_MINUTE_MS = 60 * 1000;
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(0, ONE_MINUTE_MS - elapsed);

    const timer = setTimeout(() => {
      const stillLogged = Boolean(
        localStorage.getItem('bg_auth_logged_in') === 'true'
      );
      if (!stillLogged) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('bg_guest_timer_done', 'true');
        }
        window.dispatchEvent(new CustomEvent('bg_open_auth_modal', { 
          detail: { isCompulsory: true } 
        }));
      }
    }, remainingMs);

    return () => clearTimeout(timer);
  }, []);

  // Load draft & register from backend service with localStorage fallback
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      // 1. Load active working draft from database/service
      try {
        const draft = await specificationService.getActiveDraft();
        if (draft && isMounted) {
          if (draft.projectData) setProjectData(draft.projectData);
          if (draft.scope) setScope(draft.scope);
          if (draft.specs) setSpecs(draft.specs);
          if (draft.envData) setEnvData(draft.envData);
          if (draft.dRows) setDRows(draft.dRows);
          if (draft.specialData) setSpecialData(draft.specialData);
          if (draft.fRows) setFRows(draft.fRows);
          if (draft.qcData) setQcData(draft.qcData);
          if (draft.hRows) setHRows(draft.hRows);
          if (draft.otherColName) setOtherColName(draft.otherColName);
          if (draft.other2ColName) setOther2ColName(draft.other2ColName);
          if (draft.specialComment) setSpecialComment(draft.specialComment);
          if (draft.iRows) setIRows(draft.iRows);
          if (draft.genNotes) setGenNotes(draft.genNotes);
          if (draft.companyProfile) setCompanyProfile(draft.companyProfile);
          if (draft.watermarkSettings) setWatermarkSettings(draft.watermarkSettings);
        }
      } catch (e) {
        console.warn('Failed to load spec draft:', e);
      }

      // 2. Load reports register from database/service
      try {
        const fetchedReports = await specificationService.getReports();
        if (fetchedReports && isMounted && fetchedReports.length > 0) {
          setReports(fetchedReports);
        } else {
          const savedReports = localStorage.getItem(REGISTER_STORAGE_KEY);
          if (savedReports && isMounted) {
            setReports(JSON.parse(savedReports));
          }
        }
      } catch (e) {
        console.warn('Failed to load reports register:', e);
      }

      // 3. Load company profile & watermark settings
      try {
        const savedCompany = localStorage.getItem(COMPANY_STORAGE_KEY);
        if (savedCompany && isMounted) setCompanyProfile(JSON.parse(savedCompany));

        const savedWm = localStorage.getItem(WATERMARK_STORAGE_KEY);
        if (savedWm && isMounted) setWatermarkSettings(JSON.parse(savedWm));
      } catch (e) {}

      // Enable debounced auto-saving after initial data has hydrated into React state
      setTimeout(() => {
        if (isMounted) {
          isInitialLoadedRef.current = true;
        }
      }, 250);
    };

    loadInitialData();

    // Listen for background user auth state updates (e.g. login/logout)
    const handleUserUpdated = () => {
      specificationService.getReports().then(fetchedReports => {
        if (fetchedReports && isMounted) setReports(fetchedReports);
      }).catch(() => {});
    };
    window.addEventListener('bg_user_updated', handleUserUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('bg_user_updated', handleUserUpdated);
    };
  }, []);

  // Auto-refresh reports whenever opening the report register view
  useEffect(() => {
    if (currentSection === 'report_register') {
      specificationService.getReports().then(fetchedReports => {
        if (fetchedReports && fetchedReports.length > 0) {
          setReports(fetchedReports);
        }
      }).catch(() => {});
    }
  }, [currentSection]);

  // Debounced Auto-Save: Automatically persists any section input to database and storage
  useEffect(() => {
    // Avoid saving during hydration or active reset
    if (!isInitialLoadedRef.current || isResettingRef.current) return;

    setAutoSaveState('saving');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
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
          companyProfile,
          watermarkSettings,
          lastSaved: new Date().toISOString()
        };

        await specificationService.saveActiveDraft(draftObj);
        setAutoSaveState('saved');
        setTimeout(() => {
          setAutoSaveState(prev => prev === 'saved' ? 'idle' : prev);
        }, 2500);
      } catch (err) {
        console.warn('[AutoSave] Debounced save failed:', err);
        setAutoSaveState('error');
      }
    }, 700);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
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
    companyProfile,
    watermarkSettings
  ]);

  // Save Draft (Manual trigger fallback + Register Upsert)
  const handleSaveDraft = async () => {
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
        companyProfile,
        watermarkSettings,
        lastSaved: new Date().toISOString()
      };
      // 1. Save active working draft
      await specificationService.saveActiveDraft(draftObj);

      // 2. Also register/upsert this draft in the Reports Register
      const draftProjNo = projectData.projNo || 'DRAFT-PROJECT';
      const draftRecord = {
        spec_id: projectData.projNo ? `DRAFT-${projectData.projNo}` : `DRAFT-${Date.now().toString().slice(-6)}`,
        dinNo: projectData.dinNo || 'DIN-DRAFT',
        projNo: draftProjNo,
        projDesc: projectData.projDesc || 'Coating Specification Draft',
        custName: projectData.custName || 'Confidential Client',
        preparedBy: projectData.preparedBy || 'Coating Specialist',
        date: getIndianDateString(),
        status: 'Draft',
        revision: projectData.revNo || 'Rev. 0',
        data: draftObj
      };

      try {
        const saved = await specificationService.saveReport(draftRecord);
        const updated = [saved, ...reports.filter(r => r.projNo !== saved.projNo && r.id !== saved.id)];
        setReports(updated);
        localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        const updated = [draftRecord, ...reports.filter(r => r.projNo !== draftRecord.projNo)];
        setReports(updated);
        localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
      }

      setAutoSaveState('saved');
      addToast('Draft Saved', `Draft "${draftProjNo}" saved to database and added to Report Register.`, 'success');
    } catch (e) {
      addToast('Save Error', 'Could not save draft.', 'error');
    }
  };

  // Load Demonstration Sample Record
  const handleLoadSampleRecord = async () => {
    const sampleRecord = {
      id: 'SAMPLE-01',
      spec_id: 'SPEC-994821',
      dinNo: 'DIN-2026-ARAMCO-09',
      projNo: 'PRJ-4029-REFINERY',
      projDesc: 'Ras Tanura Clean Fuels Project — Package 4 Piping & Columns',
      custName: 'Saudi Aramco / Saipem EPC',
      preparedBy: 'M. Dharaiya (NACE Level 3 #41920)',
      date: getIndianDateString(),
      status: 'Approved',
      revision: 'Rev. 1',
      data: {
        projectData: {
          dinNo: 'DIN-2026-ARAMCO-09',
          projNo: 'PRJ-4029-REFINERY',
          projDesc: 'Ras Tanura Clean Fuels Project — Package 4 Piping & Columns',
          custName: 'Saudi Aramco / Saipem EPC',
          preparedBy: 'M. Dharaiya (NACE Level 3 #41920)',
          revNo: 'Rev. 1',
          status: 'Approved'
        },
        scope: {
          blasting: 'YES',
          painting: 'YES',
          galv: 'NO',
          tsa: 'YES',
          insulation: 'YES',
          fireproof: 'NO',
          pickling: 'NA'
        },
        specs: ['SAES-H-001', 'SAES-H-101V System APCS-1B', 'ISO 12944-5 C5-Very High'],
        envData: {
          envCategory: 'C5-M (Marine & Offshore Industrial Heavy)',
          transport: 'Marine Freight & Coastal Storage',
          moc: 'Carbon Steel CS-A106 Gr. B & Stainless Steel SS316L'
        },
        dRows: [
          { component: 'Process Piping Header', opTemp: '160', designTemp: '220', painting: 'YES', galv: 'NO', tsa: 'NA', insulation: 'YES', fireproof: 'NO', surface: 'External' },
          { component: 'Atmospheric Distillation Column', opTemp: '280', designTemp: '340', painting: 'YES', galv: 'NO', tsa: 'YES', insulation: 'YES', fireproof: 'NO', surface: 'External' },
          { component: 'Cooling Water Return Lines', opTemp: '45', designTemp: '85', painting: 'YES', galv: 'NO', tsa: 'NA', insulation: 'NO', fireproof: 'NO', surface: 'Both' }
        ],
        specialData: {
          insThk: '50mm Mineral Wool + SS304 Jacketing',
          insType: 'Thermal Insulation under Cladding',
          fpThk: 'NA',
          fpType: 'None',
          tsaThk: '250 µm Thermal Spray Aluminium (99.5% Al) + Silicone Sealer',
          tsaType: 'Flame Spray TSA per SAES-H-004',
          galvThk: 'NA',
          galvType: 'None',
          pickThk: 'Pickling & Passivation ASTM A380',
          pickType: 'Stainless Steel Lines'
        },
        fRows: [
          {
            coatingType: 'High Temp Silicone Aluminum',
            primer: 'Inorganic Zinc Silicate (IOZ)',
            primerBrand: 'Carbozinc 11',
            primerDft: '75',
            mid: 'High Heat Silicone Intermediate',
            midBrand: 'Therma-Sote 400',
            midDft: '50',
            top: 'Silicone Topcoat Silver',
            topBrand: 'Carboline Thermaline 400',
            topDft: '30',
            totalDft: '155',
            area: '4850',
            lossFactor: '30',
            paintVol: '1240',
            unitRate: '18.50',
            totalCost: '89725'
          }
        ],
        qcData: {
          appStd: 'SSPC-SP 10 / NACE No. 2 Near-White Blast Cleaning (Profile 50-75 µm)',
          testRem: 'Pull-off adhesion ASTM D4541 > 7 MPa; Holiday testing NACE SP0188 100% on TSA lines',
          files: []
        },
        hRows: [
          { primer: 'Carboline India Pvt Ltd', intermediate: 'AkzoNobel Protective Coatings', topcoat: 'Jotun Paints', thinnner: 'Thinner #21 / #33' },
          { primer: 'Hempel Paints', intermediate: 'Hempel Paints', topcoat: 'Hempel Silicone Acrylic', thinnner: 'Hempel Thinner 08080' }
        ],
        iRows: [
          { revNo: 'Rev. 0', date: '2026-09-15', desc: 'Initial Tender Submission', prepBy: 'M. Dharaiya', appBy: 'Eng. Director' },
          { revNo: 'Rev. 1', date: '2026-10-28', desc: 'Updated with client comments on TSA & CUI insulation', prepBy: 'M. Dharaiya', appBy: 'Saudi Aramco Insp.' }
        ],
        genNotes: '1. All surface preparation to SSPC-SP 10 before primer application.\n2. Ambient temperature must be >= 5°C and relative humidity <= 85% during coating application.\n3. Dew point delta must be >= 3°C throughout blast and curing cycles.'
      }
    };

    try {
      const saved = await specificationService.saveReport(sampleRecord);
      const updated = [saved, ...reports.filter(r => r.projNo !== saved.projNo)];
      setReports(updated);
      localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
      addToast('Sample Record Loaded', 'Demonstration record loaded into register.', 'success');
    } catch (e) {
      const updated = [sampleRecord, ...reports.filter(r => r.projNo !== sampleRecord.projNo)];
      setReports(updated);
      localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
      addToast('Sample Record Loaded', 'Demonstration record loaded locally.', 'success');
    }
  };

  // Reset All Data & Purge from Database and Storage
  const handleGlobalReset = async () => {
    if (window.confirm('Clear all input data across the specification reading form?')) {
      isResettingRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      try {
        await specificationService.clearActiveDraft();
      } catch (e) {
        console.warn('Failed to clear remote draft:', e);
      }

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
        painting: 'NO',
        insulation: 'NO',
        fireproof: 'NO',
        tsa: 'NA',
        galv: 'NO',
        pickling: 'NO'
      });
      setSpecs(['']);
      setEnvData({
        envCategory: '',
        envRef: '',
        transport: '',
        voyage: '',
        paintValid: '',
        paintReq: 'NA',
        paintReqDoc: '',
        moc: '',
        cyclic: 'NA',
        cyclicDesc: ''
      });
      setDRows([
        {
          component: '',
          opTemp: '',
          designTemp: '',
          painting: 'YES',
          galv: 'NO',
          tsa: 'NA',
          insulation: 'NO',
          fireproof: 'NO',
          surface: 'External'
        }
      ]);
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
      setAutoSaveState('idle');

      setTimeout(() => {
        isResettingRef.current = false;
        isInitialLoadedRef.current = true;
      }, 300);

      addToast('Specification Cleared', 'All input fields cleared from database and storage.', 'info');
    }
  };

  // Synchronize Section D -> Section F
  const handleSyncFFromD = () => {
    const validD = dRows.filter(r => (r.painting === 'YES' || r.painting === true) && (r.component || '').trim());
    if (validD.length === 0) {
      addToast('No Painting Rows Found', 'Section D has no components with Painting = YES.', 'warning');
      return;
    }
    const newF = [...fRows];
    let addedCount = 0;
    validD.forEach(d => {
      const exists = newF.some(f => (f.systemFor || '').trim().toLowerCase() === d.component.trim().toLowerCase());
      if (!exists) {
        newF.push({
          systemFor: d.component,
          surfacePrep: 'ISO 8501-1 Sa 2½',
          profile: '50-75',
          primer: 'Inorganic Zinc Silicate',
          primerDft: '75',
          intermediate: 'High Build Epoxy MIO',
          intermediateDft: '150',
          finish: 'Aliphatic Polyurethane',
          finishDft: '50',
          area: ''
        });
        addedCount++;
      }
    });
    setFRows(newF);
    addToast('Synced from Section D', `Imported ${addedCount} painting component(s) into Section F.`, 'success');
  };

  // Synchronize Section F -> Section H
  const handleSyncHFromF = () => {
    const genericTypes = new Set();
    fRows.forEach(f => {
      if (f.primer && f.primer.trim()) genericTypes.add(f.primer.trim());
      if (f.intermediate && f.intermediate.trim()) genericTypes.add(f.intermediate.trim());
      if (f.finish && f.finish.trim()) genericTypes.add(f.finish.trim());
    });

    if (genericTypes.size === 0) {
      addToast('No Paint Types in Section F', 'Please define Primer, Intermediate or Finish coats in Section F.', 'warning');
      return;
    }

    const newH = [...hRows];
    let added = 0;
    genericTypes.forEach(t => {
      const exists = newH.some(h => (h.genericType || '').trim().toLowerCase() === t.toLowerCase());
      if (!exists) {
        newH.push({
          genericType: t,
          intl: '',
          jotun: '',
          asian: '',
          carboline: '',
          hempel: '',
          sigma: '',
          other: '',
          other2: ''
        });
        added++;
      }
    });
    setHRows(newH);
    addToast('Synced from Section F', `Added ${added} generic paint type(s) into Section H matrix.`, 'success');
  };

  // Area Summary Computations for Section F
  const areaSummary = useMemo(() => {
    let totalPrepArea = 0;
    let totalCoatArea = 0;
    const paintBreakdown = {};

    fRows.forEach(r => {
      const a = parseFloat(r.area) || 0;
      totalPrepArea += a;
      totalCoatArea += a;

      ['primer', 'intermediate', 'finish'].forEach(coatKey => {
        const pName = r[coatKey];
        if (pName && pName.trim()) {
          paintBreakdown[pName] = (paintBreakdown[pName] || 0) + a;
        }
      });
    });

    return { totalPrepArea, totalCoatArea, paintBreakdown };
  }, [fRows]);

  // Dynamic Progress Calculation
  const progressData = useMemo(() => {
    const checks = [
      { sec: 'AB', w: 5, ok: !!projectData.projNo },
      { sec: 'AB', w: 5, ok: !!projectData.projDesc },
      { sec: 'AB', w: 3, ok: !!projectData.custName },
      { sec: 'AB', w: 2, ok: specs.some(s => s && s.trim()) },
      { sec: 'C', w: 5, ok: !!envData.envCategory },
      { sec: 'C', w: 3, ok: !!envData.transport },
      { sec: 'C', w: 2, ok: !!envData.moc },
      { sec: 'D', w: 10, ok: dRows.length > 0 },
      { sec: 'E', w: 2, ok: !!specialData.insThk || !!specialData.insType },
      { sec: 'E', w: 2, ok: !!specialData.fpThk || !!specialData.fpType },
      { sec: 'E', w: 2, ok: !!specialData.tsaThk || !!specialData.tsaType },
      { sec: 'E', w: 2, ok: !!specialData.galvThk || !!specialData.galvType },
      { sec: 'E', w: 2, ok: !!specialData.pickThk || !!specialData.pickType },
      { sec: 'F', w: 10, ok: fRows.length > 0 },
      { sec: 'F', w: 10, ok: fRows.some(r => r.primer && r.area) },
      { sec: 'G', w: 3, ok: !!qcData.appStd },
      { sec: 'G', w: 2, ok: !!qcData.testRem || (qcData.files && qcData.files.length > 0) },
      { sec: 'H', w: 10, ok: hRows.length > 0 },
      { sec: 'I', w: 5, ok: iRows.length > 0 }
    ];

    const total = checks.reduce((s, c) => s + c.w, 0);
    const done = checks.filter(c => c.ok).reduce((s, c) => s + c.w, 0);
    const pct = Math.round((done / total) * 100);

    const secStatus = {
      secAB: checks.filter(x => x.sec === 'AB').every(x => x.ok),
      secC: checks.filter(x => x.sec === 'C').every(x => x.ok),
      secD: checks.filter(x => x.sec === 'D').every(x => x.ok),
      secE: checks.filter(x => x.sec === 'E').some(x => x.ok),
      secF: checks.filter(x => x.sec === 'F').every(x => x.ok),
      secG: checks.filter(x => x.sec === 'G').some(x => x.ok),
      secH: checks.filter(x => x.sec === 'H').every(x => x.ok),
      secI: checks.filter(x => x.sec === 'I').every(x => x.ok)
    };

    return { pct, secStatus };
  }, [projectData, specs, envData, dRows, specialData, fRows, qcData, hRows, iRows]);

  // Register an entry to the database register
  const handleSaveToRegister = async () => {
    if (!projectData.projNo && !projectData.projDesc) {
      addToast('Missing Required Details', 'Please enter Project No. and Description before saving to register.', 'warning');
      return;
    }

    const newReport = {
      spec_id: `SPEC-${Date.now().toString().slice(-6)}`,
      dinNo: projectData.dinNo || 'DIN-2026-001',
      projNo: projectData.projNo || 'PRJ-UNNAMED',
      projDesc: projectData.projDesc || 'Coating Specification Sheet',
      custName: projectData.custName || 'Confidential Client',
      preparedBy: projectData.preparedBy || 'Coating Specialist',
      date: getIndianDateString(),
      status: 'Approved',
      revision: projectData.revNo || 'Rev. 0',
      data: {
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
      }
    };

    try {
      const saved = await specificationService.saveReport(newReport);
      const updated = [saved, ...reports.filter(r => r.projNo !== saved.projNo)];
      setReports(updated);
      addToast('Record Saved to Register', `Saved ${newReport.projNo} to database register.`, 'success');
    } catch (e) {
      // Local fallback
      const updated = [newReport, ...reports.filter(r => r.projNo !== newReport.projNo)];
      setReports(updated);
      localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
      addToast('Record Saved Locally', `Saved ${newReport.projNo} to local register.`, 'info');
    }
  };

  // Full payload object for Dossier / Preview / Register
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
    genNotes,
    companyProfile,
    watermarkSettings
  };

  // ════════════════════════════════════════════════════════════════════════════
  // REPORT REGISTER CALCULATIONS & FILTERS
  // ════════════════════════════════════════════════════════════════════════════
    const totalRecords = reports.length;
    const draftRecords = reports.filter(r => (r.status || '').toLowerCase() === 'draft').length;
    const approvedRecords = reports.filter(r => (r.status || '').toLowerCase() === 'approved').length;
    const rejectedRecords = reports.filter(r => (r.status || '').toLowerCase() === 'rejected').length;
    const totalSheets = reports.reduce((s, r) => s + (r.data?.fRows?.length || 1), 0);

    const filteredReports = reports.filter(r => {
      const q = repSearch.toLowerCase();
      const matchSearch = !q || 
        (r.projNo || '').toLowerCase().includes(q) ||
        (r.dinNo || '').toLowerCase().includes(q) ||
        (r.projDesc || '').toLowerCase().includes(q) ||
        (r.custName || '').toLowerCase().includes(q) ||
        (r.preparedBy || '').toLowerCase().includes(q);

      const matchCol = (!colFilters.dinNo || (r.dinNo || '').toLowerCase().includes(colFilters.dinNo.toLowerCase())) &&
        (!colFilters.projNo || (r.projNo || '').toLowerCase().includes(colFilters.projNo.toLowerCase())) &&
        (!colFilters.projDesc || (r.projDesc || '').toLowerCase().includes(colFilters.projDesc.toLowerCase())) &&
        (!colFilters.cust || (r.custName || '').toLowerCase().includes(colFilters.cust.toLowerCase())) &&
        (!colFilters.prep || (r.preparedBy || '').toLowerCase().includes(colFilters.prep.toLowerCase())) &&
        (!colFilters.status || (r.status || '').toLowerCase().includes(colFilters.status.toLowerCase()));

      return matchSearch && matchCol;
    });



  return (
    <div className="wrap space-y-4 font-sans animate-in fade-in duration-200">
      {/* 1. REPORT REGISTER VIEW */}
      {currentSection === 'report_register' && (
              <div className="tab-page act animate-in fade-in duration-200" id="tab-report" style={{ display: 'block' }}>
        
        {/* Navigation Breadcrumb Bar (Matches Image 1) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D8DEE5] rounded-xl px-4 py-2.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7E8B99]">
            <button 
              type="button"
              onClick={() => handleNavigateSection('form')}
              className="font-bold text-[#E87B1E] hover:text-[#9E1B1E] font-rajdhani uppercase text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>‹ Home</span>
            </button>
            <span>›</span>
            <span className="text-[#4E5B6A] font-bold font-rajdhani uppercase">Coating Specification Reading</span>
            <span>›</span>
            <span className="text-[#9E1B1E] font-bold font-rajdhani uppercase bg-[#FFF4E3] border border-[#F3D2A0] px-2.5 py-0.5 rounded-md">
              + Report Register
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider">
              • LIVE SYSTEM
            </span>
            <button
              type="button"
              onClick={() => { setSelectedReportForView(null); setPreviewModalOpen(true); }}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveToRegister();
                setValidationModalOpen(true);
              }}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Validate</span>
            </button>
            <button
              type="button"
              onClick={handleSaveToRegister}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 text-[#1565C0] border border-blue-200 rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={handleGlobalReset}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Summary Cards (Matches Image 1) */}
        <div className="reg-dash grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          <div className="reg-card bg-white p-4 rounded-xl border border-[#D8DEE5] border-t-3 border-t-[#E87B1E] shadow-2xs">
            <div className="rc-ic w-8 h-8 rounded-lg bg-[#F7F8FA] border border-[#D8DEE5] flex items-center justify-center text-sm mb-2 text-[#4E5B6A]">
              📋
            </div>
            <div className="rc-num font-rajdhani text-2xl font-bold text-[#1B222C] leading-none">
              {totalRecords}
            </div>
            <div className="rc-lbl text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#7E8B99] mt-1">
              TOTAL RECORDS
            </div>
          </div>

          <div className="reg-card draft bg-white p-4 rounded-xl border border-[#D8DEE5] border-t-3 border-t-[#E87B1E] shadow-2xs">
            <div className="rc-ic w-8 h-8 rounded-lg bg-[#FFF4E3] border border-[#F3D2A0] flex items-center justify-center text-sm mb-2 text-[#E87B1E]">
              ✎
            </div>
            <div className="rc-num font-rajdhani text-2xl font-bold text-[#E87B1E] leading-none">
              {draftRecords}
            </div>
            <div className="rc-lbl text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#7E8B99] mt-1">
              DRAFT RECORDS
            </div>
          </div>

          <div className="reg-card approved bg-white p-4 rounded-xl border border-[#D8DEE5] border-t-3 border-t-emerald-600 shadow-2xs">
            <div className="rc-ic w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-sm mb-2 text-emerald-600">
              ✓
            </div>
            <div className="rc-num font-rajdhani text-2xl font-bold text-emerald-600 leading-none">
              {approvedRecords}
            </div>
            <div className="rc-lbl text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#7E8B99] mt-1">
              APPROVED RECORDS
            </div>
          </div>

          <div className="reg-card rejected bg-white p-4 rounded-xl border border-[#D8DEE5] border-t-3 border-t-rose-600 shadow-2xs">
            <div className="rc-ic w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-sm mb-2 text-rose-600">
              ✕
            </div>
            <div className="rc-num font-rajdhani text-2xl font-bold text-rose-600 leading-none">
              {rejectedRecords}
            </div>
            <div className="rc-lbl text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#7E8B99] mt-1">
              REJECTED RECORDS
            </div>
          </div>

          <div className="reg-card sheets bg-white p-4 rounded-xl border border-[#D8DEE5] border-t-3 border-t-[#9E1B1E] shadow-2xs">
            <div className="rc-ic w-8 h-8 rounded-lg bg-[#FFF0F0] border border-[#FFCDD2] flex items-center justify-center text-sm mb-2 text-[#9E1B1E]">
              📑
            </div>
            <div className="rc-num font-rajdhani text-2xl font-bold text-[#9E1B1E] leading-none">
              {totalSheets}
            </div>
            <div className="rc-lbl text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#7E8B99] mt-1">
              TOTAL DESIGN SHEETS
            </div>
          </div>
        </div>

        {/* Action Bar (Matches Image 1) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <button 
            type="button"
            className="px-4 py-2.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-95 text-white rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
            onClick={() => { handleGlobalReset(); handleNavigateSection('form'); }} 
            title="Start a fresh Coating Specification Reading"
          >
            <span>✨</span>
            <span>NEW GENERATION</span>
          </button>
          
          <button 
            type="button"
            className="px-4 py-2.5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (reports.length === 0) {
                addToast('No Records', 'Report register is empty.', 'info');
                return;
              }
              const csv = "ID,Design No,Project No,Description,Customer,Prepared By,Date,Status,Revision\n" +
                reports.map(r => `"${r.id}","${r.dinNo}","${r.projNo}","${r.projDesc}","${r.custName}","${r.preparedBy}","${r.date}","${r.status}","${r.revision}"`).join("\n");
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Spec_Register_${getIndianDateString()}.csv`;
              a.click();
              addToast('Exported CSV', 'Register exported successfully.', 'success');
            }} 
            title="Export the entire register to Excel/CSV"
          >
            <span>📊</span>
            <span>EXPORT EXCEL</span>
          </button>

          <button 
            type="button"
            className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
            onClick={handleLoadSampleRecord} 
            title="Load demonstration coating specification record into the register"
          >
            <span>💡</span>
            <span>SAMPLE RECORD</span>
          </button>

          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7E8B99] text-xs">🔍</span>
            <input 
              type="text" 
              value={repSearch} 
              onChange={e => setRepSearch(e.target.value)} 
              placeholder="Search project, client, equipment, design no., status, prepared by…" 
              className="w-full pl-9 pr-3 py-2 text-xs text-[#1B222C] placeholder-[#9CA3AF] bg-white border border-[#D8DEE5] rounded-xl focus:outline-none focus:border-[#E87B1E] focus:ring-1 focus:ring-[#E87B1E] transition"
            />
          </div>
        </div>

        {/* Report Table Wrap (Matches Image 1 Exact Headers & Filter Row) */}
        <div className="bg-white border border-[#D8DEE5] rounded-xl shadow-xs overflow-hidden">
          <div className="bg-[#FFF9F3] border-b border-[#F0E6DD] px-4 py-2.5">
            <div className="text-xs font-bold font-rajdhani text-[#1B222C] uppercase tracking-wide flex items-center gap-2">
              <span>📊</span>
              <span>SAVED COATING SPECIFICATION READINGS — REPORT REGISTER</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[1180px]">
              <thead>
                <tr className="bg-[#FFFDF9] border-b border-[#E8DDD3] text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037]">
                  <th className="py-2 px-2 text-center border-r border-[#E8DDD3] w-10">SR</th>
                  <th className="py-2 px-2.5 text-left border-r border-[#E8DDD3]">DESIGN INPUT NO.</th>
                  <th className="py-2 px-2.5 text-left border-r border-[#E8DDD3]">PROJECT NO.</th>
                  <th className="py-2 px-3 text-left border-r border-[#E8DDD3]">PROJECT DESCRIPTION</th>
                  <th className="py-2 px-2.5 text-left border-r border-[#E8DDD3]">CUSTOMER DETAILS</th>
                  <th className="py-2 px-2.5 text-left border-r border-[#E8DDD3]">PREPARED BY</th>
                  <th className="py-2 px-2 text-center border-r border-[#E8DDD3] w-24">DATE</th>
                  <th className="py-2 px-2 text-center border-r border-[#E8DDD3] w-24">STATUS</th>
                  <th className="py-2 px-2 text-center border-r border-[#E8DDD3] w-20">REVISION</th>
                  <th className="py-2 px-1 text-center border-r border-[#E8DDD3] w-12">PRINT</th>
                  <th className="py-2 px-1 text-center border-r border-[#E8DDD3] w-12">EDIT</th>
                  <th className="py-2 px-1 text-center border-r border-[#E8DDD3] w-12">VIEW</th>
                  <th className="py-2 px-1 text-center border-r border-[#E8DDD3] w-12">COPY</th>
                  <th className="py-2 px-1 text-center w-12">DELETE</th>
                </tr>
                {/* Per-Column Filter Input Row */}
                <tr className="bg-[#F8FAFC] border-b border-[#E8DDD3]">
                  <th className="p-1 border-r border-[#E8DDD3]"></th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.dinNo} 
                      onChange={e => setColFilters(p => ({...p, dinNo: e.target.value}))} 
                    />
                  </th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.projNo} 
                      onChange={e => setColFilters(p => ({...p, projNo: e.target.value}))} 
                    />
                  </th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.projDesc} 
                      onChange={e => setColFilters(p => ({...p, projDesc: e.target.value}))} 
                    />
                  </th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.cust} 
                      onChange={e => setColFilters(p => ({...p, cust: e.target.value}))} 
                    />
                  </th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.prep} 
                      onChange={e => setColFilters(p => ({...p, prep: e.target.value}))} 
                    />
                  </th>
                  <th className="p-1 border-r border-[#E8DDD3]"></th>
                  <th className="p-1 border-r border-[#E8DDD3]">
                    <input 
                      className="w-full px-2 py-1 text-[10px] bg-white border border-[#CBD5E1] rounded text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#E87B1E]" 
                      placeholder="Filter" 
                      value={colFilters.status} 
                      onChange={e => setColFilters(p => ({...p, status: e.target.value}))} 
                    />
                  </th>
                  <th colSpan="6" className="p-1"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD3]">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="py-12 text-center text-xs">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#FFF4E3] border border-[#F3D2A0] flex items-center justify-center text-xl text-[#E87B1E]">
                          📋
                        </div>
                        <div className="text-sm font-bold font-rajdhani uppercase text-[#1B222C]">
                          No saved Coating Specification Readings yet
                        </div>
                        <p className="text-xs text-[#7E8B99] max-w-md">
                          Save a draft from the input form, or click below to load a demonstration sample record to test editing, viewing, printing, and duplicating.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleLoadSampleRecord}
                            className="px-4 py-2 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-95 text-white rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>✨</span>
                            <span>Load Sample Demonstration Record</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavigateSection('form')}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B222C] border border-[#D8DEE5] rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>✎</span>
                            <span>Create New Specification</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r, idx) => (
                    <tr key={r.id || r.spec_id || idx} className="hover:bg-[#FFFDF9] transition-colors">
                      <td className="py-2.5 px-2 text-center font-bold font-mono text-[#9E1B1E] border-r border-[#E8DDD3]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-xs border-r border-[#E8DDD3] text-[#334155]">
                        {r.dinNo || r.data?.projectData?.dinNo || '—'}
                      </td>
                      <td className="py-2.5 px-2.5 font-bold text-xs border-r border-[#E8DDD3] text-[#1B222C]">
                        {r.projNo || r.data?.projectData?.projNo || 'DRAFT-PROJECT'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#E8DDD3] text-[#334155]">
                        {r.projDesc || r.data?.projectData?.projDesc || 'Specification Reading Dossier'}
                      </td>
                      <td className="py-2.5 px-2.5 border-r border-[#E8DDD3] text-[#334155]">
                        {r.custName || r.data?.projectData?.custName || 'Confidential Client'}
                      </td>
                      <td className="py-2.5 px-2.5 border-r border-[#E8DDD3] text-[#334155]">
                        {r.preparedBy || r.data?.projectData?.preparedBy || 'Coating Specialist'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-xs border-r border-[#E8DDD3] text-[#64748B]">
                        {r.date || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center border-r border-[#E8DDD3]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          (r.status || '').toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status || 'Draft'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-xs border-r border-[#E8DDD3] text-[#1565C0]">
                        {r.revision || 'R0'}
                      </td>
                      {/* Print Action */}
                      <td className="py-2 px-1 text-center border-r border-[#E8DDD3]">
                        <button 
                          className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-[#D8DEE5] hover:border-[#2E7D32] hover:bg-emerald-50 text-[#2E7D32] transition cursor-pointer" 
                          onClick={() => {
                            const payload = r.data ? {
                              ...r.data,
                              projectData: {
                                ...(r.data.projectData || {}),
                                projNo: r.projNo || r.data.projectData?.projNo || '—',
                                dinNo: r.dinNo || r.data.projectData?.dinNo || '—',
                                projDesc: r.projDesc || r.data.projectData?.projDesc || '—',
                                custName: r.custName || r.data.projectData?.custName || '—',
                                preparedBy: r.preparedBy || r.data.projectData?.preparedBy || '—',
                                status: r.status || 'Draft',
                                revision: r.revision || 'Rev. 0'
                              }
                            } : r;
                            setSelectedReportForView(payload);
                            handleNavigateSection('report');
                          }} 
                          title="Print Dossier"
                        >
                          🖨
                        </button>
                      </td>
                      {/* Edit Action */}
                      <td className="py-2 px-1 text-center border-r border-[#E8DDD3]">
                        <button 
                          className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-[#D8DEE5] hover:border-[#E87B1E] hover:bg-amber-50 text-[#E87B1E] transition cursor-pointer" 
                          onClick={() => {
                            const data = r.data || {};
                            const pData = data.projectData || {};
                            setProjectData({
                              dinNo: r.dinNo || pData.dinNo || '',
                              projNo: r.projNo || pData.projNo || '',
                              projDesc: r.projDesc || pData.projDesc || '',
                              custName: r.custName || pData.custName || '',
                              preparedBy: r.preparedBy || pData.preparedBy || '',
                              revNo: r.revision || pData.revNo || 'Rev. 0',
                              date: r.date || pData.date || getIndianDateString(),
                              status: r.status || pData.status || 'Draft'
                            });
                            if (data.scope) setScope(data.scope);
                            if (data.specs) setSpecs(data.specs);
                            if (data.envData) setEnvData(data.envData);
                            if (data.dRows) setDRows(data.dRows);
                            if (data.specialData) setSpecialData(data.specialData);
                            if (data.fRows) setFRows(data.fRows);
                            if (data.qcData) setQcData(data.qcData);
                            if (data.hRows) setHRows(data.hRows);
                            if (data.otherColName) setOtherColName(data.otherColName);
                            if (data.other2ColName) setOther2ColName(data.other2ColName);
                            if (data.specialComment) setSpecialComment(data.specialComment);
                            if (data.iRows) setIRows(data.iRows);
                            if (data.genNotes) setGenNotes(data.genNotes);
                            if (data.companyProfile) setCompanyProfile(data.companyProfile);
                            if (data.watermarkSettings) setWatermarkSettings(data.watermarkSettings);

                            handleNavigateSection('form');
                            addToast('Loaded for Editing', `Loaded ${r.projNo || r.dinNo || 'specification'} into form.`, 'info');
                          }} 
                          title="Edit in Form"
                        >
                          ✎
                        </button>
                      </td>
                      {/* View Action */}
                      <td className="py-2 px-1 text-center border-r border-[#E8DDD3]">
                        <button 
                          className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-[#D8DEE5] hover:border-[#1565C0] hover:bg-blue-50 text-[#1565C0] transition cursor-pointer" 
                          onClick={() => {
                            const payload = r.data ? {
                              ...r.data,
                              projectData: {
                                ...(r.data.projectData || {}),
                                projNo: r.projNo || r.data.projectData?.projNo || '—',
                                dinNo: r.dinNo || r.data.projectData?.dinNo || '—',
                                projDesc: r.projDesc || r.data.projectData?.projDesc || '—',
                                custName: r.custName || r.data.projectData?.custName || '—',
                                preparedBy: r.preparedBy || r.data.projectData?.preparedBy || '—',
                                status: r.status || 'Draft',
                                revision: r.revision || 'Rev. 0'
                              }
                            } : r;
                            setSelectedReportForView(payload);
                            setPreviewModalOpen(true);
                          }} 
                          title="View Dossier Preview"
                        >
                          👁
                        </button>
                      </td>
                      {/* Copy Action */}
                      <td className="py-2 px-1 text-center border-r border-[#E8DDD3]">
                        <button 
                          className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-[#D8DEE5] hover:border-slate-400 hover:bg-slate-50 text-slate-700 transition cursor-pointer" 
                          onClick={async () => {
                            const cloned = JSON.parse(JSON.stringify(r));
                            delete cloned.id;
                            cloned.spec_id = `SPEC-${Date.now().toString().slice(-6)}`;
                            cloned.projNo = `${cloned.projNo}_COPY`;
                            cloned.status = 'Draft';
                            try {
                              const saved = await specificationService.saveReport(cloned);
                              setReports(prev => [saved, ...prev]);
                              addToast('Duplicated', `Duplicated ${cloned.projNo} to database.`, 'success');
                            } catch (e) {
                              const updated = [cloned, ...reports];
                              setReports(updated);
                              localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
                              addToast('Duplicated', `Duplicated ${cloned.projNo} locally.`, 'success');
                            }
                          }} 
                          title="Duplicate Record"
                        >
                          📋
                        </button>
                      </td>
                      {/* Delete Action */}
                      <td className="py-2 px-1 text-center">
                        <button 
                          className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-[#FFCDD2] hover:bg-rose-50 text-rose-600 transition cursor-pointer" 
                          onClick={async () => {
                            if (window.confirm(`Delete ${r.projNo}?`)) {
                              if (r.id) {
                                await specificationService.deleteReport(r.id).catch(() => {});
                              }
                              const updated = reports.filter(x => x.id !== r.id);
                              setReports(updated);
                              localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updated));
                              addToast('Deleted', 'Record removed from register.', 'info');
                            }
                          }} 
                          title="Delete Record"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* 2. PRINT DOSSIER VIEW */}
    {currentSection === 'report' && (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)] print:hidden">
          <button
            onClick={() => handleNavigateSection('form')}
            className="text-xs font-bold font-rajdhani uppercase tracking-wider text-[#E87B1E] hover:text-[#9E1B1E] flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>← Back to Specification Reading Form</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
        <SpecReportView 
          {...(selectedReportForView || currentSpecPayload)} 
          companyProfile={companyProfile} 
          watermarkSettings={watermarkSettings} 
        />
      </div>
    )}

    {/* 3. WATERMARK CONTROL VIEW */}
    {currentSection === 'watermark' && (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)]">
          <button
            onClick={() => handleNavigateSection('form')}
            className="text-xs font-bold font-rajdhani uppercase tracking-wider text-[#E87B1E] hover:text-[#9E1B1E] flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>← Back to Specification Reading Form</span>
          </button>
          <span className="text-xs font-mono font-bold text-[#4E5B6A] bg-[#F7F8FA] border border-[#D8DEE5] px-2.5 py-0.5 rounded-md">
            Watermark Control (Pro)
          </span>
        </div>
        <SpecWatermarkControl
          watermarkSettings={watermarkSettings}
          setWatermarkSettings={setWatermarkSettings}
        />
      </div>
    )}

      {/* 4. CORE ALL-IN-ONE ACCORDION FORM VIEW */}
      {currentSection === 'form' && (
        <>
      
      {/* Top Header Toolbar with Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D8DEE5] rounded-xl px-4 py-3 shadow-[0_2px_8px_rgba(20,24,32,0.06)] print:hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-[#7E8B99]">
          <span className="font-bold text-[#1B222C] font-rajdhani uppercase text-sm">02. Specification Reading</span>
          <span>/</span>
          <span className="text-[#E87B1E] font-bold font-rajdhani uppercase">Comprehensive Form</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Start Extraction Button */}
          <button
            type="button"
            onClick={() => {
              expandAndScroll('secAB');
              addToast('Document Extraction', 'Upload or specify project technical documents in Section A & B.', 'info');
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:brightness-110 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Start automated document extraction"
          >
            <span>✨</span>
            <span>Start Extraction</span>
          </button>

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

          {/* Validate Button */}
          <button
            type="button"
            onClick={() => {
              handleSaveToRegister();
              setValidationModalOpen(true);
            }}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Validate all sections and review findings"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>Validate</span>
          </button>

          {/* Report Register Button */}
          <button
            type="button"
            onClick={() => handleNavigateSection('report_register')}
            className="px-3 py-1.5 bg-white hover:bg-[#F7F8FA] text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="View saved reports in Report Register"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#1565C0]" />
            <span>Report Register</span>
          </button>

          {/* Watermark Control Button */}
          <button
            type="button"
            onClick={() => handleNavigateSection('watermark')}
            className="px-3 py-1.5 bg-white hover:bg-[#F7F8FA] text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Configure dynamic watermark settings"
          >
            <Stamp className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Watermark</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Save draft to database and local log"
          >
            <Save className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Save Draft</span>
          </button>

          {/* Reset All Button */}
          <button
            type="button"
            onClick={handleGlobalReset}
            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Clear all fields across all sections and remove active draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Live Debounced Auto-save Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border transition-all duration-300 shadow-2xs bg-[#F7F8FA] border-[#D8DEE5]">
            {autoSaveState === 'saving' && (
              <span className="flex items-center gap-1.5 text-amber-700">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                <span>Auto-saving...</span>
              </span>
            )}
            {autoSaveState === 'saved' && (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Synced to Log</span>
              </span>
            )}
            {autoSaveState === 'idle' && (
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>Log Saved</span>
              </span>
            )}
            {autoSaveState === 'error' && (
              <span className="flex items-center gap-1.5 text-amber-700" title="Saved to local storage draft">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Saved Locally</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Top Sticky Form Completion Progress Bar (Screenshot 1) */}
      <div className="prog-panel" id="prog-panel" style={{ display: 'block' }}>
        <div className="prog-panel-in">
          <div className="prog-text">
            <div className="prog-title">
              <span className="icon">📋</span>
              <span>Form Completion Progress</span>
            </div>
            <div className="prog-bar-wrap">
              <div className="prog-bar-fill" id="prog-fill" style={{ width: `${progressData.pct}%` }}></div>
            </div>
            <div className="prog-chips" id="prog-chips">
              <span 
                className={`prog-chip ${progressData.secStatus.secAB ? 'done' : ''}`}
                onClick={() => expandAndScroll('secAB')}
              >
                A · Project &amp; Scope
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secC ? 'done' : ''}`}
                onClick={() => expandAndScroll('secC')}
              >
                C · General Req.
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secD ? 'done' : ''}`}
                onClick={() => expandAndScroll('secD')}
              >
                D · Operating Data
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secE ? 'done' : ''}`}
                onClick={() => expandAndScroll('secE')}
              >
                E · Insul. / FP / TSA / Galv / Pickl
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secF ? 'done' : ''}`}
                onClick={() => expandAndScroll('secF')}
              >
                F · Coating Systems
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secG ? 'done' : ''}`}
                onClick={() => expandAndScroll('secG')}
              >
                G · Paint Testing
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secH ? 'done' : ''}`}
                onClick={() => expandAndScroll('secH')}
              >
                H · Manufacturers
              </span>
              <span 
                className={`prog-chip ${progressData.secStatus.secI ? 'done' : ''}`}
                onClick={() => expandAndScroll('secI')}
              >
                I · Revisions
              </span>
            </div>
          </div>

          {/* Read-Only Preview Button */}
          <button 
            type="button"
            className="prev-btn" 
            onClick={() => setPreviewModalOpen(true)} 
            title="Read-only report preview"
          >
            <span className="pv-ic">👁</span>
            <span>Preview</span>
          </button>

          {/* SVG Donut Percentage Circular Gauge */}
          <div className="prog-donut">
            <svg width="72" height="72" viewBox="0 0 74 74">
              <defs>
                <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5911F"></stop>
                  <stop offset="50%" stopColor="#E8700A"></stop>
                  <stop offset="100%" stopColor="#A50021"></stop>
                </linearGradient>
              </defs>
              <circle className="prog-donut-bg" cx="37" cy="37" r="30"></circle>
              <circle 
                className="prog-donut-fg" 
                cx="37" 
                cy="37" 
                r="30" 
                id="donut-fg" 
                strokeDasharray={`${(progressData.pct / 100 * 188.5).toFixed(1)} 188.5`} 
                pathLength="188.5"
              ></circle>
            </svg>
            <div className="prog-donut-text">
              <div className="prog-donut-pct" id="donut-pct">{progressData.pct}%</div>
              <div className="prog-donut-lbl">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ SECTION A & B: PROJECT INFORMATION & SCOPE (Screenshot 1) ════ */}
      <div className={`sec ${collapsed.secAB ? 'collapsed' : ''}`} id="secAB">
        <div className="sec-hd" onClick={() => toggleSec('secAB')}>
          <div className="sec-hd-icon">📋</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Project Information &amp; Scope</div>
            <div className="sec-hd-s">Project No., Design Input No., Customer, Specifications &amp; Company Scope</div>
          </div>
          <div className="sec-pill">A · B</div>
          <div className="sec-tog">{collapsed.secAB ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secAB && (
          <div className="sec-body">
            <div className="grid g3">
              <div className="fld">
                <label className="lbl">Project No. <span className="req">*</span></label>
                <input 
                  className="inp" 
                  type="text" 
                  value={projectData.projNo} 
                  onChange={e => setProjectData(p => ({ ...p, projNo: e.target.value }))} 
                  placeholder="e.g. S041515" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Design Input No.</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={projectData.dinNo} 
                  onChange={e => setProjectData(p => ({ ...p, dinNo: e.target.value }))} 
                  placeholder="e.g. DIN-2026-001" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Project Description <span className="req">*</span></label>
                <input 
                  className="inp" 
                  type="text" 
                  value={projectData.projDesc} 
                  onChange={e => setProjectData(p => ({ ...p, projDesc: e.target.value }))} 
                  placeholder="e.g. 2nd Stage Reactor Hot Feed / Combined Effluent Exchanger" 
                />
              </div>
            </div>

            <div className="grid g2" style={{ marginTop: '11px' }}>
              <div className="fld">
                <label className="lbl">Details of Customer</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={projectData.custName} 
                  onChange={e => setProjectData(p => ({ ...p, custName: e.target.value }))} 
                  placeholder="e.g. TECNICAS REUNIDAS" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Prepared By <span className="hint">(auto-fills Report)</span></label>
                <input 
                  className="inp" 
                  type="text" 
                  value={projectData.preparedBy} 
                  onChange={e => setProjectData(p => ({ ...p, preparedBy: e.target.value }))} 
                  placeholder="Name &amp; designation" 
                />
              </div>
            </div>

            <div className="fld" style={{ marginTop: '11px' }}>
              <label className="lbl">Applicable Specification No. <span className="hint">(add multiple as needed)</span></label>
              <div className="spec-list">
                {specs.map((sp, idx) => (
                  <div key={idx} className="spec-row">
                    <input 
                      className="inp" 
                      type="text" 
                      value={sp} 
                      onChange={e => {
                        const copy = [...specs];
                        copy[idx] = e.target.value;
                        setSpecs(copy);
                      }} 
                      placeholder="e.g. 80080-GEN-TCH-0000-SPE-002_Rev02" 
                    />
                    {specs.length > 1 && (
                      <button 
                        type="button" 
                        className="spec-rm" 
                        onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                className="spec-add" 
                onClick={() => setSpecs([...specs, ''])}
              >
                + Add Specification
              </button>
            </div>

            <div className="fld" style={{ marginTop: '11px' }}>
              <label className="lbl">Scope Description</label>
              <textarea 
                className="txa" 
                value={projectData.scopeDesc} 
                onChange={e => setProjectData(p => ({ ...p, scopeDesc: e.target.value }))} 
                placeholder="Paint coating system recommendation and confirmation based on operation and design parameter of equipment..."
              ></textarea>
            </div>

            <div style={{ marginTop: '14px', borderTop: '1.5px solid var(--bdr)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#43A047,#2E7D32)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff' }}>✓</div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Company Scope</div>
                  <div style={{ fontSize: '10px', color: 'var(--txt3)' }}>Painting · Insulation · Fireproofing · Special Treatment · Galvanizing · Pickling &amp; Passivation</div>
                </div>
              </div>

              <div className="scope-grid">
                {[
                  { key: 'painting', label: 'Surface Preparation & Painting', icon: '🛠️' },
                  { key: 'insulation', label: 'Insulation', icon: '🧥' },
                  { key: 'fireproof', label: 'Fire Proofing', icon: '🔥' },
                  { key: 'tsa', label: 'Special Treatment (TSA / FRE / FRP)', icon: '⚡' },
                  { key: 'galv', label: 'Galvanizing', icon: '🔩' },
                  { key: 'pickling', label: 'Pickling & Passivation', icon: '🧪' }
                ].map(item => {
                  const val = scope[item.key] || 'NO';
                  return (
                    <div key={item.key} className={`scope-it ${val === 'YES' ? 'is-yes' : val === 'NO' ? 'is-no' : ''}`}>
                      <div className="scope-it-icon">{item.icon}</div>
                      <div className="scope-it-l">{item.label}</div>
                      <div className="yno-wrap">
                        <button 
                          type="button" 
                          className={`yno-btn ${val === 'YES' ? 'on-yes' : ''}`} 
                          onClick={() => setScope(p => ({ ...p, [item.key]: 'YES' }))}
                        >
                          YES
                        </button>
                        <button 
                          type="button" 
                          className={`yno-btn ${val === 'NO' ? 'on-no' : ''}`} 
                          onClick={() => setScope(p => ({ ...p, [item.key]: 'NO' }))}
                        >
                          NO
                        </button>
                        <button 
                          type="button" 
                          className={`yno-btn ${val === 'NA' ? 'on-na' : ''}`} 
                          onClick={() => setScope(p => ({ ...p, [item.key]: 'NA' }))}
                        >
                          NA
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION C: GENERAL REQUIREMENTS (Screenshot 2) ════ */}
      <div className={`sec ${collapsed.secC ? 'collapsed' : ''}`} id="secC">
        <div className="sec-hd" onClick={() => toggleSec('secC')}>
          <div className="sec-hd-icon">🌍</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">General Requirements</div>
            <div className="sec-hd-s">Environment, transportation, validation, MOC and cyclic service</div>
          </div>
          <div className="sec-pill">Section C</div>
          <div className="sec-tog">{collapsed.secC ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secC && (
          <div className="sec-body">
            <div className="grid g2">
              <div className="fld">
                <label className="lbl">A1 — Environment Condition <span className="req">*</span></label>
                <select 
                  className="sel" 
                  value={envData.envCategory} 
                  onChange={e => setEnvData(p => ({ ...p, envCategory: e.target.value }))}
                >
                  <option value="">— Select environment —</option>
                  <option>C1 — Very Low (Heated buildings)</option>
                  <option>C2 — Low (Unheated buildings, low pollution rural)</option>
                  <option>C3 — Medium (Urban / industrial, moderate SO2; coastal low salinity)</option>
                  <option>C4 — High (Industrial, coastal moderate salinity)</option>
                  <option>C5-I — Very High Industrial</option>
                  <option>C5-M — Very High Marine</option>
                  <option>CX — Extreme (Offshore, extreme humidity)</option>
                  <option>Im1 — Fresh water</option>
                  <option>Im2 — Sea / brackish water</option>
                  <option>Im3 — Soil (buried)</option>
                  <option>Im4 — Sea water with cathodic protection</option>
                </select>
                <div className="subhint">ISO 12944-2 Classification</div>
              </div>
              <div className="fld">
                <label className="lbl">Clause / Document Reference</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={envData.envRef} 
                  onChange={e => setEnvData(p => ({ ...p, envRef: e.target.value }))} 
                  placeholder="e.g. ISO:12944, Location — HASSI MESSAOUD, ALGERIA" 
                />
              </div>
            </div>

            <div className="grid g3" style={{ marginTop: '11px' }}>
              <div className="fld">
                <label className="lbl">A2 — Transportation <span className="req">*</span></label>
                <select 
                  className="sel" 
                  value={envData.transport} 
                  onChange={e => setEnvData(p => ({ ...p, transport: e.target.value }))}
                >
                  <option value="">— Select method —</option>
                  <option>Road Transport — Open Trailer</option>
                  <option>Road Transport — Covered Trailer</option>
                  <option>Sea — Below Deck (Container)</option>
                  <option>Sea — On Deck (Open)</option>
                  <option>Sea — On Deck (Covered)</option>
                  <option>Rail Transport</option>
                  <option>Air Freight</option>
                  <option>Multi-Modal (Combined)</option>
                </select>
              </div>
              <div className="fld">
                <label className="lbl">A3 — Voyage Duration</label>
                <select 
                  className="sel" 
                  value={envData.voyage} 
                  onChange={e => setEnvData(p => ({ ...p, voyage: e.target.value }))}
                >
                  <option value="">— Select —</option>
                  <option>Less than 7 days</option>
                  <option>7 – 14 days</option>
                  <option>15 – 30 days</option>
                  <option>1 – 2 months</option>
                  <option>2 – 3 months</option>
                  <option>More than 3 months</option>
                </select>
              </div>
              <div className="fld">
                <label className="lbl">A4 — Paint Scheme Validation</label>
                <select 
                  className="sel" 
                  value={envData.paintValid} 
                  onChange={e => setEnvData(p => ({ ...p, paintValid: e.target.value }))}
                >
                  <option value="">— Select —</option>
                  <option>Validated by NACE Certified Inspector</option>
                  <option>Validated by AMPP Certified Inspector</option>
                  <option>Validated by Third-Party Inspection (TPI)</option>
                  <option>Validated by Customer / End User</option>
                  <option>Validated by Paint Manufacturer Technical</option>
                  <option>Validated by BG Group (Internal)</option>
                  <option>Validation Pending</option>
                </select>
              </div>
            </div>

            <div className="grid g2" style={{ marginTop: '11px' }}>
              <div className="fld">
                <label className="lbl">Sr. 1 — Painting Requirement in DATASHEET / MR / PR or Specific Customer Document?</label>
                <div className="yno-wrap">
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.paintReq === 'YES' ? 'on-yes' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, paintReq: 'YES' }))}
                  >
                    YES
                  </button>
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.paintReq === 'NO' ? 'on-no' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, paintReq: 'NO' }))}
                  >
                    NO
                  </button>
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.paintReq === 'NA' ? 'on-na' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, paintReq: 'NA' }))}
                  >
                    NA
                  </button>
                </div>
                <div className="subhint">Current: <span>{envData.paintReq}</span></div>
              </div>
              <div className="fld">
                <label className="lbl">DATASHEET / MR / PR or Specific Customer Document</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={envData.paintReqDoc} 
                  onChange={e => setEnvData(p => ({ ...p, paintReqDoc: e.target.value }))} 
                  placeholder="e.g. Clause 2.2 of 80080-ED-HEX-0000-REQ-411" 
                />
              </div>
            </div>

            <div className="grid g3" style={{ marginTop: '11px' }}>
              <div className="fld">
                <label className="lbl">Sr. 2 — MOC <span className="req">*</span> <span className="hint">(editable — type custom grade)</span></label>
                <input 
                  className="inp" 
                  type="text" 
                  value={envData.moc} 
                  onChange={e => setEnvData(p => ({ ...p, moc: e.target.value }))} 
                  placeholder="Select or type MOC" 
                  list="moc-list" 
                />
                <datalist id="moc-list">
                  <option value="Carbon Steel (CS)" />
                  <option value="Low Alloy Steel (1.25Cr-0.5Mo)" />
                  <option value="Low Alloy Steel (2.25Cr-1Mo)" />
                  <option value="Low Alloy Steel (5Cr-0.5Mo)" />
                  <option value="Stainless Steel (SS304)" />
                  <option value="Stainless Steel (SS304L)" />
                  <option value="Stainless Steel (SS316)" />
                  <option value="Stainless Steel (SS316L)" />
                  <option value="Stainless Steel (SS321)" />
                  <option value="Stainless Steel (SS347)" />
                  <option value="Duplex Stainless Steel (2205)" />
                  <option value="Super Duplex (2507)" />
                  <option value="Monel 400)" />
                  <option value="Inconel 625" />
                  <option value="Titanium Gr 2" />
                  <option value="Aluminum" />
                  <option value="Galvanized Steel" />
                  <option value="Others (Specify)" />
                </datalist>
              </div>

              <div className="fld">
                <label className="lbl">Sr. 3 — Cyclic Service</label>
                <div className="yno-wrap">
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.cyclic === 'YES' ? 'on-yes' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, cyclic: 'YES' }))}
                  >
                    YES
                  </button>
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.cyclic === 'NO' ? 'on-no' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, cyclic: 'NO' }))}
                  >
                    NO
                  </button>
                  <button 
                    type="button" 
                    className={`yno-btn ${envData.cyclic === 'NA' ? 'on-na' : ''}`} 
                    onClick={() => setEnvData(p => ({ ...p, cyclic: 'NA' }))}
                  >
                    NA
                  </button>
                </div>
                <div className="subhint">Current: <span>{envData.cyclic}</span></div>
              </div>

              <div className="fld">
                <label className="lbl">Cyclic Service — Specify</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={envData.cyclicDesc} 
                  onChange={e => setEnvData(p => ({ ...p, cyclicDesc: e.target.value }))} 
                  placeholder="e.g. H2 Service &amp; H2S service" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION D: OPERATING & DESIGN TEMPERATURE DATA (Screenshot 3 / Actual Specification) ════ */}
      <div className={`sec ${collapsed.secD ? 'collapsed' : ''}`} id="secD">
        <div className="sec-hd flex items-center justify-between" onClick={() => toggleSec('secD')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#D84315] flex items-center justify-center text-white shadow-xs text-base flex-shrink-0">
              🌡️
            </div>
            <div>
              <div className="sec-hd-t text-sm font-bold font-rajdhani text-[#1B222C] uppercase tracking-wide">
                Operating &amp; Design Temperature Data
              </div>
              <div className="sec-hd-s text-xs text-[#7E8B99]">
                Component-wise temperatures + scope (Painting / Galvanizing / TSA-FRE-FRP / Insulation / Fireproofing) + Painting Surface
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold font-rajdhani text-[#9E1B1E] bg-[#FFF5EE] border border-[#FFD0B8] px-2.5 py-1 rounded-md uppercase tracking-wider">
              SECTION D
            </span>
            <span className="text-xs text-[#7E8B99]">{collapsed.secD ? '▶' : '▼'}</span>
          </div>
        </div>
        {!collapsed.secD && (
          <div className="sec-body p-4">
            {/* Callout 1: Operating / Design Temperature */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF6F2] border border-[#FFCCBC] border-l-4 border-l-[#C62828] mb-3 shadow-2xs">
              <div className="text-base flex-shrink-0 mt-0.5">🔴</div>
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-[#C62828] font-rajdhani text-[12px] tracking-wider uppercase mb-0.5">
                  IMPORTANT — OPERATING / DESIGN TEMPERATURE
                </div>
                <div className="text-[#4E5B6A] font-medium text-[11px]">
                  Both must be defined, as coating specifications may refer to either. Maintaining both in the table is essential for correct paint selection.
                </div>
              </div>
            </div>

            {/* Callout 2: Refractory Lining */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF8E7] border border-[#FFE082] border-l-4 border-l-[#F57C00] mb-4 shadow-2xs">
              <div className="text-base flex-shrink-0 mt-0.5">⚠️</div>
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-[#C62828] font-rajdhani text-[12px] tracking-wider uppercase mb-0.5">
                  IMPORTANT — REFRACTORY LINING
                </div>
                <div className="text-[#4E5B6A] font-medium text-[11px]">
                  For refractory-lined equipment, metal skin temperature shall be entered in the Design Temperature column. Take special care while selecting the coating system from specification.
                </div>
              </div>
            </div>

            {/* Table Wrap */}
            <div className="overflow-x-auto border border-[#E8DDD3] rounded-xl bg-white shadow-2xs">
              <table className="w-full border-collapse text-xs min-w-[1080px]">
                <thead>
                  <tr className="bg-[#FFF9F3] border-b border-[#F0E6DD]">
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[50px]">#</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD]">COMPONENT / SURFACE</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[120px]">OP. TEMP. (°C)</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[120px]">DESIGN TEMP. (°C)</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[95px]">PAINTING</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[95px]">GALVANIZING</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[110px]">TSA / FRE / FRP</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[95px]">INSULATION</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[95px]">FIRE PROOFING</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] border-r border-[#F0E6DD] w-[125px]">PAINTING SURFACE</th>
                    <th className="py-2.5 px-2 text-center text-[10px] font-bold font-rajdhani uppercase tracking-wider text-[#5D4037] w-[46px]">×</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6DD]">
                  {dRows.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-6 text-xs italic text-[#7E8B99] bg-white">
                        No component rows. Click <strong className="text-[#E87B1E]">+ ADD COMPONENT ROW</strong> below.
                      </td>
                    </tr>
                  ) : (
                    dRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-[#FFFDF9] transition-colors">
                        {/* 4.1 Index format */}
                        <td className="text-center py-2 px-2 text-xs font-bold font-mono text-[#5A6472] border-r border-[#F0E6DD] bg-[#FAFAFA]">
                          {`4.${idx + 1}`}
                        </td>
                        {/* Component / Surface */}
                        <td className="p-1.5 border-r border-[#F0E6DD]">
                          <input 
                            type="text" 
                            value={r.component || ''} 
                            onChange={e => {
                              const copy = [...dRows];
                              copy[idx].component = e.target.value;
                              setDRows(copy);
                            }} 
                            placeholder="Component / Surface" 
                            className="w-full px-2.5 py-1.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] bg-white border border-[#D8DEE5] rounded-lg focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition"
                          />
                        </td>
                        {/* Op Temp */}
                        <td className="p-1.5 border-r border-[#F0E6DD]">
                          <input 
                            type="text" 
                            value={r.opTemp ?? ''} 
                            onChange={e => {
                              const copy = [...dRows];
                              copy[idx].opTemp = e.target.value;
                              setDRows(copy);
                            }} 
                            placeholder="e.g. 312.2°C" 
                            className="w-full px-2 py-1.5 text-xs text-center text-[#1F2937] placeholder-[#9CA3AF] bg-white border border-[#D8DEE5] rounded-lg focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition"
                          />
                        </td>
                        {/* Design Temp */}
                        <td className="p-1.5 border-r border-[#F0E6DD]">
                          <input 
                            type="text" 
                            value={r.designTemp ?? ''} 
                            onChange={e => {
                              const copy = [...dRows];
                              copy[idx].designTemp = e.target.value;
                              setDRows(copy);
                            }} 
                            placeholder="e.g. 344.1°C" 
                            className="w-full px-2 py-1.5 text-xs text-center text-[#1F2937] placeholder-[#9CA3AF] bg-white border border-[#D8DEE5] rounded-lg focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition"
                          />
                        </td>
                        {/* Painting */}
                        <td className="p-1 text-center border-r border-[#F0E6DD]">
                          <div className="inline-flex items-center gap-0.5 p-0.5 bg-white border border-[#D8DEE5] rounded-md shadow-2xs">
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.painting === 'YES' ? 'bg-[#2E7D32] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].painting = 'YES';
                                setDRows(copy);
                              }}
                            >
                              Y
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.painting === 'NO' ? 'bg-[#C62828] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].painting = 'NO';
                                setDRows(copy);
                              }}
                            >
                              N
                            </button>
                            <button
                              type="button"
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.painting === 'NA' ? 'bg-[#C65102] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].painting = 'NA';
                                setDRows(copy);
                              }}
                            >
                              NA
                            </button>
                          </div>
                        </td>
                        {/* Galvanizing */}
                        <td className="p-1 text-center border-r border-[#F0E6DD]">
                          <div className="inline-flex items-center gap-0.5 p-0.5 bg-white border border-[#D8DEE5] rounded-md shadow-2xs">
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.galv === 'YES' ? 'bg-[#2E7D32] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].galv = 'YES';
                                setDRows(copy);
                              }}
                            >
                              Y
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.galv === 'NO' ? 'bg-[#C62828] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].galv = 'NO';
                                setDRows(copy);
                              }}
                            >
                              N
                            </button>
                            <button
                              type="button"
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.galv === 'NA' ? 'bg-[#C65102] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].galv = 'NA';
                                setDRows(copy);
                              }}
                            >
                              NA
                            </button>
                          </div>
                        </td>
                        {/* TSA / FRE / FRP */}
                        <td className="p-1 text-center border-r border-[#F0E6DD]">
                          <div className="inline-flex items-center gap-0.5 p-0.5 bg-white border border-[#D8DEE5] rounded-md shadow-2xs">
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.tsa === 'YES' ? 'bg-[#2E7D32] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].tsa = 'YES';
                                setDRows(copy);
                              }}
                            >
                              Y
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.tsa === 'NO' ? 'bg-[#C62828] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].tsa = 'NO';
                                setDRows(copy);
                              }}
                            >
                              N
                            </button>
                            <button
                              type="button"
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.tsa === 'NA' ? 'bg-[#C65102] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].tsa = 'NA';
                                setDRows(copy);
                              }}
                            >
                              NA
                            </button>
                          </div>
                        </td>
                        {/* Insulation */}
                        <td className="p-1 text-center border-r border-[#F0E6DD]">
                          <div className="inline-flex items-center gap-0.5 p-0.5 bg-white border border-[#D8DEE5] rounded-md shadow-2xs">
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.insulation === 'YES' ? 'bg-[#2E7D32] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].insulation = 'YES';
                                setDRows(copy);
                              }}
                            >
                              Y
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.insulation === 'NO' ? 'bg-[#C62828] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].insulation = 'NO';
                                setDRows(copy);
                              }}
                            >
                              N
                            </button>
                            <button
                              type="button"
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.insulation === 'NA' ? 'bg-[#C65102] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].insulation = 'NA';
                                setDRows(copy);
                              }}
                            >
                              NA
                            </button>
                          </div>
                        </td>
                        {/* Fire Proofing */}
                        <td className="p-1 text-center border-r border-[#F0E6DD]">
                          <div className="inline-flex items-center gap-0.5 p-0.5 bg-white border border-[#D8DEE5] rounded-md shadow-2xs">
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.fireproof === 'YES' ? 'bg-[#2E7D32] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].fireproof = 'YES';
                                setDRows(copy);
                              }}
                            >
                              Y
                            </button>
                            <button
                              type="button"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.fireproof === 'NO' ? 'bg-[#C62828] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].fireproof = 'NO';
                                setDRows(copy);
                              }}
                            >
                              N
                            </button>
                            <button
                              type="button"
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                r.fireproof === 'NA' ? 'bg-[#C65102] text-white shadow-2xs' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                              }`}
                              onClick={() => {
                                const copy = [...dRows];
                                copy[idx].fireproof = 'NA';
                                setDRows(copy);
                              }}
                            >
                              NA
                            </button>
                          </div>
                        </td>
                        {/* Painting Surface */}
                        <td className="p-1.5 border-r border-[#F0E6DD]">
                          <select 
                            value={r.surface || r.paintSurface || 'External'} 
                            onChange={e => {
                              const copy = [...dRows];
                              copy[idx].surface = e.target.value;
                              copy[idx].paintSurface = e.target.value;
                              setDRows(copy);
                            }} 
                            className="w-full px-2 py-1.5 text-xs text-[#1F2937] bg-white border border-[#D8DEE5] rounded-lg focus:outline-none focus:border-[#F7941D] cursor-pointer"
                          >
                            <option value="External">External</option>
                            <option value="Internal">Internal</option>
                            <option value="Both">Both</option>
                          </select>
                        </td>
                        {/* Delete Row Button */}
                        <td className="p-1 text-center">
                          <button 
                            type="button" 
                            className="w-7 h-7 inline-flex items-center justify-center border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] rounded-md font-bold text-sm transition cursor-pointer"
                            onClick={() => setDRows(dRows.filter((_, i) => i !== idx))}
                            title="Delete row"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* + ADD COMPONENT ROW Button */}
            <button 
              type="button" 
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF8F3] hover:bg-white text-[#9E1B1E] hover:text-[#C62828] border-1.5 border-dashed border-[#FFCCBC] hover:border-[#F7941D] rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider shadow-2xs transition-all cursor-pointer" 
              onClick={() => {
                setDRows([...dRows, {
                  component: '',
                  opTemp: '',
                  designTemp: '',
                  painting: 'YES',
                  galv: 'NO',
                  tsa: 'NA',
                  insulation: 'NO',
                  fireproof: 'NO',
                  surface: 'External'
                }]);
              }}
            >
              <span>+</span>
              <span>ADD COMPONENT ROW</span>
            </button>
          </div>
        )}
      </div>

      {/* ════ SECTION E: OTHERS DETAILS / SPECIAL SYSTEMS (Screenshot 4) ════ */}
      <div className={`sec ${collapsed.secE ? 'collapsed' : ''}`} id="secE">
        <div className="sec-hd" onClick={() => toggleSec('secE')}>
          <div className="sec-hd-icon">🧱</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Insulation / Fireproofing / TSA · FRE · FRP / Galvanizing / Pickling Details</div>
            <div className="sec-hd-s">Thickness, type, description per scope category</div>
          </div>
          <div className="sec-pill">Section E</div>
          <div className="sec-tog">{collapsed.secE ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secE && (
          <div className="sec-body">
            {/* 1. Insulation Details */}
            <div style={{ marginBottom: '12px', padding: '11px', background: 'var(--bg5)', border: '1.5px solid var(--bdr)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--o1)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                🧥 1. Insulation Details
              </div>
              <div className="grid g3">
                <div className="fld">
                  <label className="lbl">Insulation Thickness</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.insThk} 
                    onChange={e => setSpecialData(p => ({ ...p, insThk: e.target.value }))} 
                    placeholder="e.g. 150 / 150 mm (Shell/Tube)" 
                  />
                  <div className="subhint">Shell side / Tube side</div>
                </div>
                <div className="fld">
                  <label className="lbl">Insulation Type <span className="hint">(editable)</span></label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.insType} 
                    onChange={e => setSpecialData(p => ({ ...p, insType: e.target.value }))} 
                    placeholder="Select or type" 
                    list="ins-list" 
                  />
                  <datalist id="ins-list">
                    <option value="Mineral Wool / Rockwool" />
                    <option value="Calcium Silicate" />
                    <option value="Cellular Glass (Foamglas)" />
                    <option value="Glass Wool" />
                    <option value="Aerogel Insulation" />
                    <option value="Polyurethane Foam (PUF)" />
                    <option value="Polyisocyanurate (PIR)" />
                    <option value="Ceramic Fiber" />
                    <option value="Others (specify)" />
                  </datalist>
                </div>
                <div className="fld">
                  <label className="lbl">Details of Insulation — Description</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.insDesc} 
                    onChange={e => setSpecialData(p => ({ ...p, insDesc: e.target.value }))} 
                    placeholder="Manual entry — specific description / brand / spec" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Fireproofing Details */}
            <div style={{ marginBottom: '12px', padding: '11px', background: 'var(--bg5)', border: '1.5px solid var(--bdr)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--o1)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                🔥 2. Fireproofing Details
              </div>
              <div className="grid g3">
                <div className="fld">
                  <label className="lbl">Fireproofing Thickness</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.fpThk} 
                    onChange={e => setSpecialData(p => ({ ...p, fpThk: e.target.value }))} 
                    placeholder="e.g. 25 mm / 1 hr rating" 
                  />
                </div>
                <div className="fld">
                  <label className="lbl">Type of Fireproofing <span className="hint">(editable)</span></label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.fpType} 
                    onChange={e => setSpecialData(p => ({ ...p, fpType: e.target.value }))} 
                    placeholder="Select or type" 
                    list="fp-list" 
                  />
                  <datalist id="fp-list">
                    <option value="Intumescent (Thin Film)" />
                    <option value="Intumescent (Epoxy-Based)" />
                    <option value="Cementitious (Lightweight)" />
                    <option value="Cementitious (Dense Concrete)" />
                    <option value="Vermiculite Cementitious" />
                    <option value="Magnesium Oxychloride (Chartek 7 / 1709)" />
                    <option value="Others (specify)" />
                  </datalist>
                </div>
                <div className="fld">
                  <label className="lbl">Details of Fireproofing — Description</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.fpDesc} 
                    onChange={e => setSpecialData(p => ({ ...p, fpDesc: e.target.value }))} 
                    placeholder="Manual entry — fire rating / spec" 
                  />
                </div>
              </div>
            </div>

            {/* 3. TSA / FRP / FRE Details */}
            <div style={{ marginBottom: '12px', padding: '11px', background: 'var(--bg5)', border: '1.5px solid var(--bdr)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--o1)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                ⚡ 3. TSA / FRP / FRE Details
              </div>
              <div className="grid g3">
                <div className="fld">
                  <label className="lbl">TSA / FRP / FRE Thickness</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.tsaThk} 
                    onChange={e => setSpecialData(p => ({ ...p, tsaThk: e.target.value }))} 
                    placeholder="e.g. TSA 250 µm + Sealer 25 µm" 
                  />
                </div>
                <div className="fld">
                  <label className="lbl">Type <span className="hint">(editable)</span></label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.tsaType} 
                    onChange={e => setSpecialData(p => ({ ...p, tsaType: e.target.value }))} 
                    placeholder="Select or type" 
                    list="tsa-list" 
                  />
                  <datalist id="tsa-list">
                    <option value="Thermal Spray Aluminum (TSA)" />
                    <option value="Thermal Spray Zinc (TSZ)" />
                    <option value="Thermal Spray Zinc-Aluminum (TSZA)" />
                    <option value="Fiberglass Reinforced Epoxy (FRE)" />
                    <option value="Fiberglass Reinforced Plastic (FRP)" />
                    <option value="Glass Flake Epoxy" />
                    <option value="Vinyl Ester Lining" />
                    <option value="Others (specify)" />
                  </datalist>
                </div>
                <div className="fld">
                  <label className="lbl">Details / Description</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.tsaDesc} 
                    onChange={e => setSpecialData(p => ({ ...p, tsaDesc: e.target.value }))} 
                    placeholder="Manual entry — sealer, topcoat, layer build-up" 
                  />
                </div>
              </div>
            </div>

            {/* 4. Galvanizing Details */}
            <div style={{ marginBottom: '12px', padding: '11px', background: 'var(--bg5)', border: '1.5px solid var(--bdr)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--o1)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                🔩 4. Galvanizing Details
              </div>
              <div className="grid g3">
                <div className="fld">
                  <label className="lbl">Galvanizing Thickness</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.galvThk} 
                    onChange={e => setSpecialData(p => ({ ...p, galvThk: e.target.value }))} 
                    placeholder="e.g. 85 µm minimum (per ASTM A123)" 
                  />
                </div>
                <div className="fld">
                  <label className="lbl">Type <span className="hint">(editable)</span></label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.galvType} 
                    onChange={e => setSpecialData(p => ({ ...p, galvType: e.target.value }))} 
                    placeholder="Select or type" 
                    list="galv-list" 
                  />
                  <datalist id="galv-list">
                    <option value="Hot-Dip Galvanizing (HDG) — ASTM A123" />
                    <option value="Hot-Dip Galvanizing — ASTM A153 (Hardware)" />
                    <option value="Continuous Galvanizing — ASTM A653" />
                    <option value="Zinc Spraying (Metallizing)" />
                    <option value="Others (specify)" />
                  </datalist>
                </div>
                <div className="fld">
                  <label className="lbl">Details / Description</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.galvDesc} 
                    onChange={e => setSpecialData(p => ({ ...p, galvDesc: e.target.value }))} 
                    placeholder="Manual entry — pre/post-treatment, specs" 
                  />
                </div>
              </div>
            </div>

            {/* 5. Pickling & Passivation Details */}
            <div style={{ padding: '11px', background: 'var(--bg5)', border: '1.5px solid var(--bdr)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--o1)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                🧪 5. Pickling &amp; Passivation Details
              </div>
              <div className="grid g3">
                <div className="fld">
                  <label className="lbl">Process Specification</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.pickThk} 
                    onChange={e => setSpecialData(p => ({ ...p, pickThk: e.target.value }))} 
                    placeholder="e.g. ASTM A380 / A967" 
                  />
                </div>
                <div className="fld">
                  <label className="lbl">Type <span className="hint">(editable)</span></label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.pickType} 
                    onChange={e => setSpecialData(p => ({ ...p, pickType: e.target.value }))} 
                    placeholder="Select or type" 
                    list="pick-list" 
                  />
                  <datalist id="pick-list">
                    <option value="Acid Pickling (HF + HNO3)" />
                    <option value="Acid Pickling (Sulphuric)" />
                    <option value="Citric Acid Passivation" />
                    <option value="Nitric Acid Passivation" />
                    <option value="Electropolishing" />
                    <option value="Pickling Paste / Gel" />
                    <option value="Others (specify)" />
                  </datalist>
                </div>
                <div className="fld">
                  <label className="lbl">Details / Description</label>
                  <input 
                    className="inp" 
                    type="text" 
                    value={specialData.pickDesc} 
                    onChange={e => setSpecialData(p => ({ ...p, pickDesc: e.target.value }))} 
                    placeholder="Manual entry — concentration, time, neutralization" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION F: COATING SYSTEM DESIGN (Screenshot 5) ════ */}
      <div className={`sec ${collapsed.secF ? 'collapsed' : ''}`} id="secF">
        <div className="sec-hd" onClick={() => toggleSec('secF')}>
          <div className="sec-hd-icon">🎨</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Coating System Design</div>
            <div className="sec-hd-s">Surface preparation, primer, intermediate, finish coat with DFT and area</div>
          </div>
          <div className="sec-pill">Section F</div>
          <div className="sec-tog">{collapsed.secF ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secF && (
          <div className="sec-body">
            <div className="imp" style={{ background: 'linear-gradient(135deg,#E3F2FD,#BBDEFB)', borderColor: '#1976D2', borderLeftColor: '#0D47A1' }}>
              <div className="imp-ic" style={{ color: '#0D47A1' }}>ℹ️</div>
              <div className="imp-t" style={{ color: '#0D47A1' }}>
                <b style={{ color: '#0D47A1' }}>Auto-Linked from Section D</b>
                <div className="imp-t-body">First column "Coating System For" auto-populates from components in Section D where Painting = YES. Editable as needed.</div>
              </div>
            </div>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: '46px' }} className="center">#</th>
                    <th style={{ minWidth: '160px' }}>Coating System For</th>
                    <th style={{ minWidth: '170px' }}>Surface Preparation</th>
                    <th style={{ width: '100px' }}>Blast Profile <span style={{ textTransform: 'none' }}>(µm)</span></th>
                    <th style={{ minWidth: '170px' }}>Primer Paint</th>
                    <th style={{ width: '74px' }}>DFT <span style={{ textTransform: 'none' }}>(µm)</span></th>
                    <th style={{ minWidth: '170px' }}>Intermediate Paint</th>
                    <th style={{ width: '74px' }}>DFT <span style={{ textTransform: 'none' }}>(µm)</span></th>
                    <th style={{ minWidth: '170px' }}>Finish Paint</th>
                    <th style={{ width: '74px' }}>DFT <span style={{ textTransform: 'none' }}>(µm)</span></th>
                    <th style={{ width: '90px' }}>Surface Area <span style={{ textTransform: 'none' }}>(m²)</span></th>
                    <th style={{ width: '46px' }} className="center">×</th>
                  </tr>
                </thead>
                <tbody>
                  {fRows.length === 0 ? (
                    <tr>
                      <td colSpan="12" style={{ textAlign: 'center', padding: '18px', fontStyle: 'italic', color: 'var(--txt3)', fontSize: '11px' }}>
                        No coating system rows. Use <strong style={{ color: 'var(--o1)' }}>+ Add Coating System Row</strong> or <strong style={{ color: 'var(--gi)' }}>↻ Sync from Section D</strong>.
                      </td>
                    </tr>
                  ) : (
                    fRows.map((r, idx) => (
                      <tr key={idx}>
                        <td className="idx">{idx + 1}</td>
                        <td>
                          <input 
                            type="text" 
                            value={r.systemFor || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].systemFor = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. Shell / Piping" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.surfacePrep || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].surfacePrep = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. ISO 8501-1 Sa 2½" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.profile || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].profile = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. 50-75" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.primer || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].primer = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. Zinc Silicate" 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={r.primerDft || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].primerDft = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="75" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.intermediate || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].intermediate = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. Epoxy MIO" 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={r.intermediateDft || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].intermediateDft = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="150" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.finish || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].finish = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="e.g. Polyurethane" 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={r.finishDft || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].finishDft = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="50" 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={r.area || ''} 
                            onChange={e => {
                              const copy = [...fRows];
                              copy[idx].area = e.target.value;
                              setFRows(copy);
                            }} 
                            placeholder="m²" 
                          />
                        </td>
                        <td className="act-col">
                          <button 
                            type="button" 
                            className="del-row" 
                            onClick={() => setFRows(fRows.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              <button 
                type="button" 
                className="add-row-btn" 
                onClick={() => {
                  setFRows([...fRows, {
                    systemFor: '',
                    surfacePrep: 'ISO 8501-1 Sa 2½',
                    profile: '50-75',
                    primer: '',
                    primerDft: '',
                    intermediate: '',
                    intermediateDft: '',
                    finish: '',
                    finishDft: '',
                    area: ''
                  }]);
                }}
              >
                + Add Coating System Row
              </button>
              <button 
                type="button" 
                className="add-row-btn" 
                onClick={handleSyncFFromD} 
                style={{ borderStyle: 'solid', borderColor: 'var(--gi)', color: 'var(--gi)' }}
              >
                ↻ Sync from Section D
              </button>
            </div>

            {/* Area Summary (Screenshot 5) */}
            <div className="area-summary">
              <div className="area-summary-h">📐 Coating System — Area Summary</div>
              <div className="area-summary-row">
                <span className="l">Total Surface Preparation Area:</span>
                <span className="v" id="totalSPArea">{areaSummary.totalPrepArea ? `${areaSummary.totalPrepArea} m²` : '— m²'}</span>
              </div>
              <div className="area-summary-row">
                <span className="l">Total Coating Area (rows defined):</span>
                <span className="v" id="totalArea">{areaSummary.totalCoatArea ? `${areaSummary.totalCoatArea} m²` : '— m²'}</span>
              </div>
              <div className="area-summary-cat">
                <div className="area-summary-cat-t">Total Area by Specific Paint Item (auto-calculated)</div>
                <div id="areaByPaint">
                  {Object.keys(areaSummary.paintBreakdown).length === 0 ? (
                    <div style={{ fontSize: '10.5px', color: 'var(--txt3)', fontStyle: 'italic', padding: '4px 0' }}>
                      No paint items selected yet.
                    </div>
                  ) : (
                    Object.entries(areaSummary.paintBreakdown).map(([name, val]) => (
                      <div key={name} className="area-summary-cat-row">
                        <span className="l">{name}:</span>
                        <span className="v">{val} m²</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION G: PAINT TESTING REQUIREMENTS (Screenshot 6) ════ */}
      <div className={`sec ${collapsed.secG ? 'collapsed' : ''}`} id="secG">
        <div className="sec-hd" onClick={() => toggleSec('secG')}>
          <div className="sec-hd-icon">🧪</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Paint Testing Requirements</div>
            <div className="sec-hd-s">Laboratory, certification standards, additional testing</div>
          </div>
          <div className="sec-pill">Section G</div>
          <div className="sec-tog">{collapsed.secG ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secG && (
          <div className="sec-body">
            <div className="grid g2">
              <div className="fld">
                <label className="lbl">11.1 — Laboratory Requirement</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={qcData.labReq} 
                  onChange={e => setQcData(p => ({ ...p, labReq: e.target.value }))} 
                  placeholder="e.g. Reputed Government Laboratory — NABL Accredited in India" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Testing Certificate Type</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={qcData.testCert} 
                  onChange={e => setQcData(p => ({ ...p, testCert: e.target.value }))} 
                  placeholder="e.g. Standard Batch TC (Laboratory Analysis Results Sheet)" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Applicable Standard</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={qcData.appStd} 
                  onChange={e => setQcData(p => ({ ...p, appStd: e.target.value }))} 
                  placeholder="e.g. MFG Standard / Laboratory results" 
                />
              </div>
              <div className="fld">
                <label className="lbl">Applicable for Paint System</label>
                <input 
                  className="inp" 
                  type="text" 
                  value={qcData.appSystem} 
                  onChange={e => setQcData(p => ({ ...p, appSystem: e.target.value }))} 
                  placeholder="e.g. Each batch of supplied materials" 
                />
              </div>
            </div>

            <div className="fld" style={{ marginTop: '11px' }}>
              <label className="lbl">Test Remarks</label>
              <textarea 
                className="txa" 
                value={qcData.testRem} 
                onChange={e => setQcData(p => ({ ...p, testRem: e.target.value }))} 
                placeholder="e.g. If not applicable, technical back-up to be provided by paint manufacturer."
              ></textarea>
            </div>

            <div className="fld" style={{ marginTop: '14px' }}>
              <label className="lbl">Additional Testing Requirement <span className="hint">(attach files / photos as special annexure)</span></label>
              <div className="file-attach-bar">
                <span style={{ fontSize: '18px', color: 'var(--o2)' }}>📎</span>
                <div className="info">Attach <b>files, photos, PDFs or test certificates</b> here. Files are saved with the draft and printed as annexure.</div>
                <input 
                  type="file" 
                  id="addtlFiles" 
                  className="file-attach-input" 
                  multiple 
                  style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    const newFileList = files.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }));
                    setQcData(p => ({ ...p, files: [...(p.files || []), ...newFileList] }));
                    addToast('Files Attached', `${files.length} document(s) uploaded.`, 'success');
                  }} 
                />
                <button 
                  type="button" 
                  className="file-attach-btn" 
                  onClick={() => document.getElementById('addtlFiles')?.click()}
                >
                  📎 Attach Files
                </button>
              </div>

              {qcData.files && qcData.files.length > 0 && (
                <div className="file-list">
                  {qcData.files.map((f, i) => (
                    <div key={i} className="file-it">
                      <div className="file-it-name">{f.name}</div>
                      <div className="file-it-size">{f.size}</div>
                      <button 
                        type="button" 
                        className="file-it-rm" 
                        onClick={() => setQcData(p => ({ ...p, files: p.files.filter((_, idx) => idx !== i) }))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION H: APPROVED PRIMER & PAINT MANUFACTURERS (Screenshot 7) ════ */}
      <div className={`sec ${collapsed.secH ? 'collapsed' : ''}`} id="secH">
        <div className="sec-hd" onClick={() => toggleSec('secH')}>
          <div className="sec-hd-icon">🏭</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Approved Primer &amp; Paint Manufacturers</div>
            <div className="sec-hd-s">Editable manufacturer list — auto-populated from Section F selections</div>
          </div>
          <div className="sec-pill">Section H</div>
          <div className="sec-tog">{collapsed.secH ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secH && (
          <div className="sec-body">
            <div className="imp" style={{ background: 'linear-gradient(135deg,#E3F2FD,#BBDEFB)', borderColor: '#1976D2', borderLeftColor: '#0D47A1' }}>
              <div className="imp-ic" style={{ color: '#0D47A1' }}>ℹ️</div>
              <div className="imp-t" style={{ color: '#0D47A1' }}>
                <b style={{ color: '#0D47A1' }}>Auto-Linked from Section F</b>
                <div className="imp-t-body">Only paint generic types selected in Section F appear here. All product names are editable. Click <strong>↻ Sync from Section F</strong> to refresh.</div>
              </div>
            </div>

            <div className="tbl-wrap">
              <table className="mfr-tbl">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>Generic Paint Type</th>
                    <th>International / AkzoNobel</th>
                    <th>Jotun</th>
                    <th>Asian Paints / PPG</th>
                    <th>Carboline</th>
                    <th>Hempel</th>
                    <th>Sigma (PPG)</th>
                    <th>
                      <input 
                        type="text" 
                        value={otherColName} 
                        onChange={e => setOtherColName(e.target.value)} 
                        placeholder="Other (editable)" 
                        style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', outline: 'none', padding: 0 }} 
                        title="Click to edit column name" 
                      />
                    </th>
                    <th>
                      <input 
                        type="text" 
                        value={other2ColName} 
                        onChange={e => setOther2ColName(e.target.value)} 
                        placeholder="Other 2 (editable)" 
                        style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', outline: 'none', padding: 0 }} 
                        title="Click to edit column name" 
                      />
                    </th>
                    <th style={{ width: '42px', textAlign: 'center' }}>×</th>
                  </tr>
                </thead>
                <tbody>
                  {hRows.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '18px', fontStyle: 'italic', color: 'var(--txt3)', fontSize: '11px' }}>
                        No paint manufacturer rows. Use <strong style={{ color: 'var(--gi)' }}>↻ Sync from Section F</strong>.
                      </td>
                    </tr>
                  ) : (
                    hRows.map((r, idx) => (
                      <tr key={idx}>
                        <td className="gen">
                          <input 
                            type="text" 
                            value={r.genericType || ''} 
                            onChange={e => {
                              const copy = [...hRows];
                              copy[idx].genericType = e.target.value;
                              setHRows(copy);
                            }} 
                            placeholder="Paint generic type" 
                          />
                        </td>
                        <td><input type="text" value={r.intl || ''} onChange={e => { const c = [...hRows]; c[idx].intl = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.jotun || ''} onChange={e => { const c = [...hRows]; c[idx].jotun = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.asian || ''} onChange={e => { const c = [...hRows]; c[idx].asian = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.carboline || ''} onChange={e => { const c = [...hRows]; c[idx].carboline = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.hempel || ''} onChange={e => { const c = [...hRows]; c[idx].hempel = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.sigma || ''} onChange={e => { const c = [...hRows]; c[idx].sigma = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.other || ''} onChange={e => { const c = [...hRows]; c[idx].other = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td><input type="text" value={r.other2 || ''} onChange={e => { const c = [...hRows]; c[idx].other2 = e.target.value; setHRows(c); }} placeholder="Product" /></td>
                        <td className="act-col">
                          <button 
                            type="button" 
                            className="del-row" 
                            onClick={() => setHRows(hRows.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              <button 
                type="button" 
                className="add-row-btn" 
                onClick={() => {
                  setHRows([...hRows, {
                    genericType: '',
                    intl: '',
                    jotun: '',
                    asian: '',
                    carboline: '',
                    hempel: '',
                    sigma: '',
                    other: '',
                    other2: ''
                  }]);
                }}
              >
                + Add Custom Row
              </button>
              <button 
                type="button" 
                className="add-row-btn" 
                onClick={handleSyncHFromF} 
                style={{ borderStyle: 'solid', borderColor: 'var(--gi)', color: 'var(--gi)' }}
              >
                ↻ Sync from Section F
              </button>
            </div>

            <div className="special-comment" style={{ marginTop: '10px' }}>
              <div className="special-comment-h">💬 Specialized Coating Material — Comment</div>
              <div style={{ fontSize: '10.5px', color: 'var(--txt2)', marginBottom: '6px' }}>
                Specialized Coating Material has been selected in coating system. If you want to add a comment, you may add accordingly below.
              </div>
              <textarea 
                className="txa" 
                value={specialComment} 
                onChange={e => setSpecialComment(e.target.value)} 
                placeholder="e.g. Specific MNC requirements, alternate manufacturer approvals, technical justifications…"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* ════ SECTION I: REVISION HISTORY (Screenshot 8) ════ */}
      <div className={`sec ${collapsed.secI ? 'collapsed' : ''}`} id="secI">
        <div className="sec-hd" onClick={() => toggleSec('secI')}>
          <div className="sec-hd-icon">📝</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">Revision History</div>
            <div className="sec-hd-s">Document revision tracking — Rev No., Date, Prepared / Reviewed / Approved</div>
          </div>
          <div className="sec-pill">Section I</div>
          <div className="sec-tog">{collapsed.secI ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secI && (
          <div className="sec-body">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Rev. No.</th>
                    <th style={{ width: '140px' }}>Date</th>
                    <th>Revision Details</th>
                    <th style={{ width: '160px' }}>Prepared By</th>
                    <th style={{ width: '160px' }}>Reviewed By</th>
                    <th style={{ width: '160px' }}>Approved By</th>
                    <th style={{ width: '46px' }} className="center">×</th>
                  </tr>
                </thead>
                <tbody>
                  {iRows.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '18px', fontStyle: 'italic', color: 'var(--txt3)', fontSize: '11px' }}>
                        No revisions yet. Click <strong style={{ color: 'var(--o1)' }}>+ Add Revision Row</strong>.
                      </td>
                    </tr>
                  ) : (
                    iRows.map((r, idx) => (
                      <tr key={idx}>
                        <td>
                          <input 
                            type="text" 
                            value={r.revNo || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].revNo = e.target.value;
                              setIRows(copy);
                            }} 
                            placeholder="Rev 0" 
                          />
                        </td>
                        <td>
                          <input 
                            type="date" 
                            value={r.date || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].date = e.target.value;
                              setIRows(copy);
                            }} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.details || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].details = e.target.value;
                              setIRows(copy);
                            }} 
                            placeholder="Initial release / As per client feedback" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.prep || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].prep = e.target.value;
                              setIRows(copy);
                            }} 
                            placeholder="Prepared by" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.rev || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].rev = e.target.value;
                              setIRows(copy);
                            }} 
                            placeholder="Reviewed by" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={r.app || ''} 
                            onChange={e => {
                              const copy = [...iRows];
                              copy[idx].app = e.target.value;
                              setIRows(copy);
                            }} 
                            placeholder="Approved by" 
                          />
                        </td>
                        <td className="act-col">
                          <button 
                            type="button" 
                            className="del-row" 
                            onClick={() => setIRows(iRows.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button 
              type="button" 
              className="add-row-btn" 
              onClick={() => {
                setIRows([...iRows, {
                  revNo: `Rev ${iRows.length}`,
                  date: getIndianDateString(),
                  details: 'Issued for Review & Approval',
                  prep: projectData.preparedBy || '',
                  rev: '',
                  app: ''
                }]);
              }}
            >
              + Add Revision Row
            </button>
          </div>
        )}
      </div>

      {/* ════ SECTION NOTES: GENERAL NOTES & ADDITIONAL COMMENTS (Screenshot 9) ════ */}
      <div className={`sec ${collapsed.secN ? 'collapsed' : ''}`} id="secN">
        <div className="sec-hd" onClick={() => toggleSec('secN')}>
          <div className="sec-hd-icon">📝</div>
          <div className="sec-hd-text">
            <div className="sec-hd-t">General Notes &amp; Additional Comments</div>
            <div className="sec-hd-s">Any other inputs not covered above</div>
          </div>
          <div className="sec-pill">Notes</div>
          <div className="sec-tog">{collapsed.secN ? '▶' : '▼'}</div>
        </div>
        {!collapsed.secN && (
          <div className="sec-body">
            <textarea 
              className="txa" 
              id="genNotes" 
              style={{ minHeight: '90px' }} 
              value={genNotes} 
              onChange={e => setGenNotes(e.target.value)} 
              placeholder="Free-text notes — special site conditions, contractor instructions, deviations from specification, etc."
            ></textarea>
          </div>
        )}
      </div>

      {/* ════ BOTTOM STICKY ACTION ROW (Screenshot 9) ════ */}
      <div className="btn-row flex flex-wrap items-center justify-between gap-3" id="secValidate">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button" 
            className="btn" 
            onClick={() => {
              handleSaveToRegister();
              setValidationModalOpen(true);
            }}
          >
            ▶ Generate &amp; Validate Summary
          </button>
          <button 
            type="button" 
            className="btn btw" 
            onClick={handleSaveDraft}
          >
            💾 Save Draft
          </button>
          <button 
            type="button" 
            className="btn btr" 
            onClick={handleGlobalReset}
          >
            ↺ Clear All
          </button>
        </div>

        {/* Live Debounced Auto-save Status Badge (Bottom) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/95 border border-[#D8DEE5] shadow-xs">
          {autoSaveState === 'saving' && (
            <span className="flex items-center gap-1.5 text-amber-700">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Auto-saving draft...</span>
            </span>
          )}
          {autoSaveState === 'saved' && (
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>All changes synced to database</span>
            </span>
          )}
          {autoSaveState === 'idle' && (
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Draft active &amp; stored section-wise</span>
            </span>
          )}
          {autoSaveState === 'error' && (
            <span className="flex items-center gap-1.5 text-amber-700">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Saved locally (offline mode)</span>
            </span>
          )}
        </div>
      </div>

        </>
      )}

      {/* GLOBAL MODALS (Available across Form, Register, Print, and Watermark) */}
      {/* Validation Summary Modal */}
      {validationModalOpen && (
        <div className="summary-modal show" onClick={() => setValidationModalOpen(false)}>
          <div className="summary-modal-in" onClick={e => e.stopPropagation()}>
            <div className="summary-modal-h">
              <div className="summary-modal-h-t">✅ Specification Validation Summary</div>
              <button type="button" className="close" onClick={() => setValidationModalOpen(false)}>×</button>
            </div>
            <div className="summary-body">
              <div className="summary-row">
                <span className="l">Project Number:</span>
                <span className="v">{projectData.projNo || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="l">Client / Customer:</span>
                <span className="v">{projectData.custName || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="l">Environment Class:</span>
                <span className="v">{envData.envCategory || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="l">Coating Systems Defined:</span>
                <span className="v">{fRows.length} System(s)</span>
              </div>
              <div className="summary-row">
                <span className="l">Total Coated Area:</span>
                <span className="v">{areaSummary.totalCoatArea} m²</span>
              </div>
              <div className="summary-row">
                <span className="l">Form Completion:</span>
                <span className="v">{progressData.pct}%</span>
              </div>

              {progressData.pct < 70 ? (
                <div className="summary-warn">
                  ⚠️ Note: Specification is {progressData.pct}% complete. Some sections or required fields are still missing. You can continue drafting or generate the dossier preview.
                </div>
              ) : (
                <div className="summary-ok">
                  ✓ Specification passes key validation thresholds! Ready for dossier preview and client submission.
                </div>
              )}
            </div>
            <div className="summary-modal-foot">
              <button 
                type="button" 
                className="btn bts" 
                onClick={() => setValidationModalOpen(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setValidationModalOpen(false);
                  setPreviewModalOpen(true);
                }}
              >
                👁 Preview Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Details Pro Modal */}
      {companyModalOpen && (
        <SpecCompanyDetailsModal
          isOpen={companyModalOpen}
          onClose={() => setCompanyModalOpen(false)}
          companyProfile={companyProfile}
          setCompanyProfile={setCompanyProfile}
        />
      )}

      {/* Preview Modal */}
      {previewModalOpen && (
        <SpecPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setSelectedReportForView(null);
          }}
          specData={selectedReportForView || currentSpecPayload}
          companyProfile={companyProfile}
          watermarkSettings={watermarkSettings}
        />
      )}
    </div>
  );
}
