import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Search, 
  Printer, 
  Edit3, 
  Eye, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  RotateCcw, 
  Sparkles,
  Layers,
  FolderOpen
} from 'lucide-react';
import { procedureService } from '../../services/procedureService';

export default function ProcReportRegister({ 
  state, 
  onLoadRecord, 
  onNewProcedure, 
  onOpenPreview, 
  onPrint 
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch records from backend API
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const list = await procedureService.getReports();
      setRecords(list);
    } catch (e) {
      console.warn('Failed to fetch procedure records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    // Auto-refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchRecords();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Save current active procedure into Register
  const handleSaveCurrentToRegister = async () => {
    if (!state?.docNo && !state?.projectName) {
      showToast('⚠️ Please enter Document No. or Project Name before saving to register.');
      return;
    }

    try {
      const saved = await procedureService.saveReport({
        ...state,
        status: state.status || 'Draft'
      });
      showToast(`✓ Registered ${saved.docNo || 'procedure'} successfully!`);
      await fetchRecords();
    } catch (e) {
      showToast('❌ Failed to register procedure.');
    }
  };

  // Seed / Load Aramco Sample Record
  const handleLoadSampleAramco = async () => {
    const sampleRecord = {
      docNo: 'PRJ-PROC-ARAMCO-01',
      revNo: '0',
      docTitle: 'Offshore Structural Steel & Piping Coating Procedure',
      projectName: 'Offshore Gas Gathering Platform Project',
      clientName: 'Saudi Aramco',
      contractorName: 'BG Coating & Inspection Ltd.',
      facilityLocation: 'Tanajib Fabrication Yard & Berri Field',
      equipmentTag: 'PL-TK-2026-X',
      projectNumber: 'SA-2026-EPC-08',
      siteLocation: 'Arabian Gulf Offshore',
      preparedBy: 'Lead Coating Engineer (NACE Level III #45892)',
      status: 'Approved',
      revision: 'Rev. 0',
      data: {
        docNo: 'PRJ-PROC-ARAMCO-01',
        revNo: '0',
        docTitle: 'Offshore Structural Steel & Piping Coating Procedure',
        projectName: 'Offshore Gas Gathering Platform Project',
        clientName: 'Saudi Aramco',
        contractorName: 'BG Coating & Inspection Ltd.',
        facilityLocation: 'Tanajib Fabrication Yard & Berri Field',
        preparedBy: 'Lead Coating Engineer (NACE Level III #45892)',
        reviewedBy: 'QC Manager',
        approvedBy: 'Aramco Quality Inspector',
        datePrepared: '2026-10-28',
        dateApproved: '2026-10-28',
        status: 'Approved',
        purpose: 'This procedure defines the rigorous requirements for surface preparation, environmental testing, coating application, inspection, and repair of carbon steel structures and piping exposed to offshore atmospheric marine environments (ISO 12944 C5-M / CX).',
        scopeSubstrates: 'Carbon Steel Piping, Vessels, Structural Decks, and Skid Assemblies',
        shopSite: 'Shop & Field',
        surfacePrepMethod: 'Near-White Blast Cleaning',
        surfacePrepStd: 'ISO 8501-1 Sa 2½ / SSPC-SP10',
        abrasiveType: 'Garnet Mesh 30/60',
        profileMin: '50',
        profileMax: '75',
        saltLimit: '20',
        dustClass: 'Class 2',
        holdingTimeHours: '4',
        tempMin: '10',
        tempMax: '45',
        rhMax: '85',
        dewPointDelta: '3.0',
        appMethodPrimary: 'Airless Spray',
        stripeCoatMethod: 'Brush application on all welds, edges, corners, and bolts',
        dftStandard: 'SSPC-PA2 Level 3 / ISO 19840 80/20 Rule',
        coatingSystems: [
          {
            systemId: 'SYS-01',
            serviceDesc: 'External Carbon Steel Piping & Structural – Marine Atmospheric (ISO 12944 CX)',
            surfacePrep: 'Near-White Blast Cleaning ISO Sa 2½ (SSPC-SP10), Profile 50–75 µm',
            substrate: 'Carbon Steel',
            operatingTemp: '-20°C to 120°C',
            coats: [
              { coatNo: 1, genericType: 'Zinc Rich Epoxy Primer', dftMin: 60, dftNom: 75, dftMax: 90, thinner: 'Approved Thinner (max 5%)', recoatMin: '4 hrs @ 25°C', recoatMax: '30 days' },
              { coatNo: 2, genericType: 'High Build Epoxy MIO', dftMin: 150, dftNom: 175, dftMax: 200, thinner: 'Approved Thinner (max 5%)', recoatMin: '6 hrs @ 25°C', recoatMax: '14 days' },
              { coatNo: 3, genericType: 'Aliphatic Polyurethane Topcoat', dftMin: 50, dftNom: 60, dftMax: 75, thinner: 'Approved PU Thinner (max 5%)', recoatMin: '8 hrs @ 25°C', recoatMax: 'N/A' }
            ],
            totalDftNom: 310
          }
        ]
      }
    };

    try {
      const saved = await procedureService.saveReport(sampleRecord);
      showToast('✓ Saudi Aramco sample procedure loaded into register!');
      await fetchRecords();
    } catch (e) {
      showToast('❌ Failed to load sample record.');
    }
  };

  // Delete from register
  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this coating procedure permanently from register?')) return;
    try {
      await procedureService.deleteReport(id);
      showToast('✓ Procedure record deleted.');
      await fetchRecords();
    } catch (e) {
      showToast('❌ Failed to delete record.');
    }
  };

  // Duplicate / Copy
  const handleCopyRecord = async (rec) => {
    const rawData = rec.data || rec;
    const cloned = {
      ...rawData,
      id: undefined,
      docNo: `${rec.docNo || 'PROC'}-COPY`,
      status: 'Draft',
      revNo: 'A'
    };
    try {
      await procedureService.saveReport(cloned);
      showToast(`✓ Cloned ${cloned.docNo} to register!`);
      await fetchRecords();
    } catch (e) {
      showToast('❌ Failed to duplicate procedure.');
    }
  };

  // Export register to CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('⚠️ No procedure records to export.');
      return;
    }

    const headers = ['Sr', 'Document No', 'Rev', 'Project Name', 'Client', 'Contractor', 'Prepared By', 'Status', 'Date', 'Total DFT (µm)'];
    const rows = records.map((r, i) => {
      const cSystems = r.coatingSystems || r.data?.coatingSystems || [];
      const totalDft = cSystems[0]?.totalDftNom || '—';
      return [
        i + 1,
        `"${r.docNo || ''}"`,
        `"${r.revNo || '0'}"`,
        `"${r.projectName || ''}"`,
        `"${r.clientName || ''}"`,
        `"${r.contractorName || ''}"`,
        `"${r.preparedBy || ''}"`,
        `"${r.status || 'Draft'}"`,
        `"${r.date || ''}"`,
        `"${totalDft}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Coating_Procedure_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Exported procedure register to CSV');
  };

  // Filtered list
  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.docNo || '').toLowerCase().includes(term) ||
      (r.projectName || '').toLowerCase().includes(term) ||
      (r.clientName || '').toLowerCase().includes(term) ||
      (r.contractorName || '').toLowerCase().includes(term) ||
      (r.equipmentTag || '').toLowerCase().includes(term) ||
      (r.preparedBy || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || (r.status || 'Draft').toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const totalCount = records.length;
  const draftCount = records.filter((r) => (r.status || 'Draft').toLowerCase() === 'draft').length;
  const approvedCount = records.filter((r) => (r.status || '').toLowerCase() === 'approved').length;
  const totalSystems = records.reduce((acc, r) => {
    const cSys = r.coatingSystems || r.data?.coatingSystems || [];
    return acc + (cSys.length || 1);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B222C] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-amber-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FCFDFD] to-[#F8FAFC] border-l-4 border-[#8B0E16] border border-[#E6E8EC] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0E16] bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Module 03 Register
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7941D] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              CoatingOS™ Verified
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1B222C] mt-1.5 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#8B0E16]" />
            Coating Procedure Document Register
          </h2>
          <p className="text-xs text-[#5A6876] mt-0.5">
            Centralized database of engineering coating specifications, client revision histories, and printable dossier records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSaveCurrentToRegister}
            className="text-xs text-[#8B0E16] hover:bg-red-50 border border-[#8B0E16] font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            title="Save the active draft procedure into the database register"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Save Current Draft
          </button>

          <button
            type="button"
            onClick={handleLoadSampleAramco}
            className="text-xs text-[#4E5B6A] hover:bg-gray-100 border border-gray-300 font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            title="Load standard offshore Aramco specification sample"
          >
            <span>🇸🇦</span>
            Sample Aramco Record
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="text-xs text-[#1B222C] hover:bg-gray-100 border border-gray-300 font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={onNewProcedure}
            className="text-xs text-white bg-gradient-to-r from-[#F7941D] to-[#8B0E16] hover:from-[#e08518] hover:to-[#730a11] font-bold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Procedure
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E6E8EC] rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A6876] font-medium block">Total Procedures</span>
            <div className="text-base font-bold text-[#1B222C] leading-none mt-1">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EC] rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A6876] font-medium block">Draft Status</span>
            <div className="text-base font-bold text-amber-600 leading-none mt-1">{draftCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EC] rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A6876] font-medium block">Approved Procedures</span>
            <div className="text-base font-bold text-emerald-700 leading-none mt-1">{approvedCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EC] rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A6876] font-medium block">Coating Systems</span>
            <div className="text-base font-bold text-purple-700 leading-none mt-1">{totalSystems}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E6E8EC] rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Document Number, Project, Client, Tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-9 pr-3 py-2 border border-[#D5D9E0] rounded-lg w-full focus:border-[#8B0E16] focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
          <span className="text-[11px] text-[#768595] font-semibold mr-1">Status:</span>
          {['ALL', 'Draft', 'Approved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter.toUpperCase() === st.toUpperCase()
                  ? 'bg-[#8B0E16] text-white shadow-2xs'
                  : 'bg-gray-100 text-[#4E5B6A] hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            type="button"
            onClick={fetchRecords}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition ml-1 cursor-pointer"
            title="Refresh database records"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Register Records Table */}
      <div className="bg-white border border-[#E6E8EC] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Document Number</th>
                <th className="py-3 px-3 text-center w-16 font-semibold">Rev</th>
                <th className="py-3 px-4 text-left font-semibold">Project & Description</th>
                <th className="py-3 px-4 text-left font-semibold">Client / Contractor</th>
                <th className="py-3 px-3 text-center w-24 font-semibold">Status</th>
                <th className="py-3 px-4 text-left w-28 font-semibold">IST Date</th>
                <th className="py-3 px-4 text-right w-56 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading procedure register from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FolderOpen className="w-8 h-8 text-gray-300 mx-auto" />
                      <div className="font-semibold text-gray-600">No procedure records found</div>
                      <p className="text-[11px] text-gray-400">
                        {searchTerm ? 'No records match your search filter.' : 'Create your first procedure or click "Sample Aramco Record" to get started.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleLoadSampleAramco}
                        className="mt-2 text-xs text-white bg-[#8B0E16] font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-[#730a11] transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Load Aramco Sample
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const isAppr = (rec.status || '').toLowerCase() === 'approved';
                  return (
                    <tr key={rec.id} className="hover:bg-amber-50/30 transition group">
                      <td className="py-3 px-4 font-mono font-bold text-[#8B0E16]">
                        {rec.docNo || 'UNTITLED-DOC'}
                        {rec.equipmentTag && (
                          <span className="block text-[10px] font-sans font-normal text-gray-500">
                            Tag: {rec.equipmentTag}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-gray-700">
                        {rec.revNo || '0'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 font-semibold">{rec.projectName || '—'}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{rec.docTitle || ''}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-800 font-medium">{rec.clientName || '—'}</div>
                        {rec.contractorName && (
                          <div className="text-[10px] text-gray-500">{rec.contractorName}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                            isAppr
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {rec.status || 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        {rec.date || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => onOpenPreview?.(rec)}
                            className="px-2 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Preview read-only dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {/* Edit / Load Button */}
                          <button
                            type="button"
                            onClick={() => onLoadRecord?.(rec)}
                            className="px-2 py-1 text-xs font-bold text-white bg-[#8B0E16] hover:bg-[#6E0C12] rounded-md transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Load procedure into editor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* Print Button */}
                          <button
                            type="button"
                            onClick={() => onPrint?.(rec)}
                            className="px-2 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Print A4 Engineering Dossier"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-700" />
                          </button>

                          {/* Copy / Duplicate Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyRecord(rec)}
                            className="px-1.5 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition shadow-2xs cursor-pointer"
                            title="Duplicate record"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-600" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="px-1.5 py-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-white hover:bg-red-50 border border-red-200 rounded-md transition shadow-2xs cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
