import React from 'react';
import { 
  FlaskConical, 
  Paperclip, 
  Trash2, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  FileText, 
  Upload 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecTestingQC({ qcData, setQcData, onNext }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (uploaded.length === 0) return;

    const newFiles = uploaded.map(f => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type || 'Document'
    }));

    setQcData({
      ...qcData,
      files: [...(qcData.files || []), ...newFiles]
    });
    addToast('File Attached', `Attached ${newFiles.length} document(s) to QC annexure.`, 'success');
  };

  const handleRemoveFile = (index) => {
    const updated = (qcData.files || []).filter((_, i) => i !== index);
    setQcData({
      ...qcData,
      files: updated
    });
  };

  const handleValidate = () => {
    addToast('QC Requirements Validated', 'Laboratory and inspection criteria recorded.', 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setQcData({
      labReq: '',
      testCert: '',
      appStd: '',
      appSystem: '',
      testRem: '',
      files: []
    });
    addToast('Section Reset', 'Testing & QC requirements cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section G
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Testing &amp; Quality Control Requirements
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laboratory testing accreditation, batch certificate types (EN 10204 3.1), inspection standards, and annexure attachments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('sspc_pa2')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 QC &amp; Inspection Guideline</span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#F7941D]" />
            <span>Laboratory Testing &amp; Certification Standards</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">QA / QC Protocol</span>
        </div>

        {/* 2x2 Grid: Laboratory, Certificate, Standard, Applicability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              11.1 — Laboratory Accreditation Requirement
            </label>
            <input
              type="text"
              value={qcData.labReq}
              onChange={e => setQcData({ ...qcData, labReq: e.target.value })}
              placeholder="e.g. NABL Accredited / ISO 17025 Certified Government Laboratory"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Testing Certificate Type
            </label>
            <input
              type="text"
              value={qcData.testCert}
              onChange={e => setQcData({ ...qcData, testCert: e.target.value })}
              placeholder="e.g. Batch Test Certificate (EN 10204 Type 3.1) with QC analysis sheet"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Applicable Testing Standard
            </label>
            <input
              type="text"
              value={qcData.appStd}
              onChange={e => setQcData({ ...qcData, appStd: e.target.value })}
              placeholder="e.g. ASTM D4541 Adhesion / ISO 8502-9 Salt / ASTM D2697 Vol Solids"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Applicable for Paint System / Supply Frequency
            </label>
            <input
              type="text"
              value={qcData.appSystem}
              onChange={e => setQcData({ ...qcData, appSystem: e.target.value })}
              placeholder="e.g. Each manufacturing batch of supplied primer, midcoat, and finish"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>
        </div>

        {/* Test Remarks Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Test Remarks &amp; Technical Backup
          </label>
          <textarea
            rows={3}
            value={qcData.testRem}
            onChange={e => setQcData({ ...qcData, testRem: e.target.value })}
            placeholder="e.g. In case of third-party testing exemption, comprehensive manufacturer technical backup and warranty letter must be submitted..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
          />
        </div>

        {/* Additional File Attachments Manager */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Additional Testing Documents &amp; Test Certificates Annexure
            </label>
            <label className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Attach Documents</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {(qcData.files || []).length === 0 ? (
            <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1">
              <Paperclip className="w-5 h-5 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No documents attached yet</p>
              <p className="text-[11px] text-slate-400">Attach PDFs, test certificates, photos, or client waivers to be printed in the final report dossier.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(qcData.files || []).map((file, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#F7941D] shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 truncate block">{file.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{file.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer shrink-0"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Validate QC Requirements</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset QC Fields</span>
          </button>
        </div>

      </div>

    </div>
  );
}
