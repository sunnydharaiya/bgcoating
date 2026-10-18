// src/tools/inspection/InspectionReworkRegister.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  X, 
  UploadCloud, 
  Camera, 
  Layers, 
  Sparkles,
  FileCheck2,
  Edit2
} from 'lucide-react';
import { SELECT_OPTIONS } from '../../data/inspectionDatabase';
import { useToast } from '../../context/ToastContext';

export default function InspectionReworkRegister({
  reworkLog = [],
  onUpdateReworkLog
}) {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Initial Form State
  const initialForm = {
    id: `NCR-${new Date().getFullYear()}-${String(reworkLog.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    stage: 's1',
    stageName: 'Blasting & Priming',
    location: '',
    defectCode: 'RWK-01',
    defectName: 'Low DFT (< 80% Specified NDFT)',
    areaM2: '',
    desc: '',
    rootCause: '',
    correctiveAction: '',
    status: 'Open',
    photosBefore: [],
    photosAfter: [],
    closeoutDate: '',
    inspector: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Open modal for new NCR
  const handleOpenNew = () => {
    setFormData({
      ...initialForm,
      id: `NCR-${new Date().getFullYear()}-${String(reworkLog.length + 1).padStart(3, '0')}`
    });
    setEditingItem(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item) => {
    setFormData(item);
    setEditingItem(item.id);
    setModalOpen(true);
  };

  // Save Modal Form
  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.location) {
      addToast('Missing Location', 'Please specify the inspection location.', 'warning');
      return;
    }

    if (editingItem) {
      const next = reworkLog.map(item => item.id === editingItem ? formData : item);
      onUpdateReworkLog(next);
      addToast('NCR Updated', `Non-conformance record ${formData.id} updated.`, 'success');
    } else {
      const next = [formData, ...reworkLog];
      onUpdateReworkLog(next);
      addToast('NCR Logged', `New non-conformance ${formData.id} registered.`, 'success');
    }
    setModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm(`Are you sure you want to delete NCR #${id}?`)) {
      const next = reworkLog.filter(item => item.id !== id);
      onUpdateReworkLog(next);
      addToast('NCR Deleted', `Record ${id} removed.`, 'info');
    }
  };

  const handleQuickStatusChange = (id, newStatus) => {
    const next = reworkLog.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          closeoutDate: newStatus === 'Closed' ? new Date().toISOString().split('T')[0] : item.closeoutDate
        };
      }
      return item;
    });
    onUpdateReworkLog(next);
    addToast('Status Changed', `NCR #${id} status changed to ${newStatus}.`, 'success');
  };

  // Photo Upload Handler for Modal Form
  const handlePhotoUpload = (e, field) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [field]: [
            ...(prev[field] || []),
            {
              id: `ph_ncr_${Date.now()}`,
              url: event.target.result,
              name: file.name
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Filtered Items
  const filteredItems = reworkLog.filter(item => {
    const matchesSearch = 
      (item.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.defectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.desc || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalCount = reworkLog.length;
  const openCount = reworkLog.filter(r => r.status === 'Open').length;
  const rectifiedCount = reworkLog.filter(r => r.status === 'Rectified').length;
  const closedCount = reworkLog.filter(r => r.status === 'Closed').length;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-[11px] font-mono font-bold uppercase">
              QA/QC Non-Conformance (NCR)
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Coating Defect &amp; Rework Lifecycle Register (PRO)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log paint non-conformances (runs, blisters, low DFT, holidays), record root causes, attach before/after photos, and track rectification approvals.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Raise Non-Conformance (NCR)
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Total Logged NCRs</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-red-500 block">Open (Active Defects)</span>
          <div className="text-2xl font-black font-mono text-red-600 mt-1">{openCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">Rectified (Pending QA)</span>
          <div className="text-2xl font-black font-mono text-amber-600 mt-1">{rectifiedCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 block">Closed &amp; Approved</span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">{closedCount}</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search NCR by ID, location, defect type, root cause..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 bg-slate-50/60"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto">
          {['ALL', 'Open', 'Rectified', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Rework Records List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 shadow-xs transition-all space-y-4"
          >
            {/* Header: ID, Date, Defect Type, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-xs ${
                  item.status === 'Open' ? 'bg-red-100 text-red-700' :
                  item.status === 'Rectified' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.defectCode || 'NCR'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{item.id}</span>
                    <span className="text-xs text-slate-400 font-mono">· Date: {item.date}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                      Stage: {item.stageName || item.stage}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                    {item.defectName} — {item.location} ({item.areaM2 || 0} m²)
                  </h4>
                </div>
              </div>

              {/* Status Selector & Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={item.status}
                  onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    item.status === 'Open' ? 'bg-red-50 text-red-800 border-red-300' :
                    item.status === 'Rectified' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                    'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <option value="Open">🔴 Open (Defective)</option>
                  <option value="Rectified">🟡 Rectified (Pending QA)</option>
                  <option value="Closed">🟢 Closed &amp; Accepted</option>
                </select>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  title="Edit details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content: Description, Root Cause, Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Defect Observation</span>
                <p className="text-slate-700 leading-relaxed">{item.desc || 'No detailed observation recorded.'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Root Cause Analysis</span>
                <p className="text-slate-700 leading-relaxed">{item.rootCause || 'Root cause pending investigation.'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Corrective Action Plan</span>
                <p className="text-slate-700 leading-relaxed">{item.correctiveAction || 'Rectification action pending.'}</p>
              </div>
            </div>

            {/* Photos Strip (Before & After) */}
            {((item.photosBefore && item.photosBefore.length > 0) || (item.photosAfter && item.photosAfter.length > 0)) && (
              <div className="pt-2 flex flex-wrap gap-4 border-t border-slate-100">
                {item.photosBefore && item.photosBefore.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-red-500 font-bold block mb-1">Before Rectification:</span>
                    <div className="flex gap-2">
                      {item.photosBefore.map((p, i) => (
                        <img 
                          key={i} 
                          src={p.url} 
                          alt="Before" 
                          onClick={() => setLightboxImg(p.url)}
                          className="w-14 h-14 rounded-xl object-cover border border-red-200 cursor-pointer hover:scale-105 transition" 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.photosAfter && item.photosAfter.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-600 font-bold block mb-1">After Rectification:</span>
                    <div className="flex gap-2">
                      {item.photosAfter.map((p, i) => (
                        <img 
                          key={i} 
                          src={p.url} 
                          alt="After" 
                          onClick={() => setLightboxImg(p.url)}
                          className="w-14 h-14 rounded-xl object-cover border border-emerald-200 cursor-pointer hover:scale-105 transition" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Inspector: {item.inspector || 'Prakash Ramavat'}</span>
              {item.closeoutDate && <span>Closeout Approved: {item.closeoutDate}</span>}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <h4 className="text-sm font-bold text-slate-800">No Non-Conformances Found</h4>
            <p className="text-xs">There are no rework or defect records matching the current filter.</p>
          </div>
        )}
      </div>

      {/* 5. NCR Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingItem ? `Edit Non-Conformance #${formData.id}` : 'Raise New Non-Conformance (NCR)'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">NCR Number</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stage: e.target.value,
                      stageName: e.target.value === 's1' ? 'Blasting & Priming' : e.target.value === 's2' ? '1st Intermediate' : e.target.value === 's3' ? '2nd Intermediate' : '3rd Topcoat'
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="s1">s1 · Blasting &amp; Priming</option>
                    <option value="s2">s2 · 1st Intermediate</option>
                    <option value="s3">s3 · 2nd Intermediate</option>
                    <option value="s4">s4 · 3rd Topcoat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Defect Category</label>
                  <select
                    value={formData.defectCode}
                    onChange={(e) => {
                      const sel = SELECT_OPTIONS.reworkDefects.find(d => d.code === e.target.value);
                      setFormData({ 
                        ...formData, 
                        defectCode: e.target.value,
                        defectName: sel ? sel.name : formData.defectName
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    {SELECT_OPTIONS.reworkDefects.map((d) => (
                      <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Affected Area ($m^2$)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.areaM2}
                    onChange={(e) => setFormData({ ...formData, areaM2: e.target.value })}
                    placeholder="e.g. 1.5"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Inspection Location / Component</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Shell Course #1 - Weld Seam W-04"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Observation Description</label>
                <textarea
                  rows={2}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="e.g. DFT measured 45 µm on weld toe (Specified minimum is 60 µm)."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Root Cause</label>
                  <textarea
                    rows={2}
                    value={formData.rootCause}
                    onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                    placeholder="e.g. Manual spray shadow effect on irregular weld bead."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Corrective Action Plan</label>
                  <textarea
                    rows={2}
                    value={formData.correctiveAction}
                    onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                    placeholder="e.g. Feather edges with 80-mesh sandpaper and apply touch-up stripe coat."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* Photo Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Photos Before Rectification</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'photosBefore')}
                    className="w-full text-xs text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Photos After Rectification</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'photosAfter')}
                    className="w-full text-xs text-slate-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Update NCR Record' : 'Log Non-Conformance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={lightboxImg} alt="Enlarged Defect Preview" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
