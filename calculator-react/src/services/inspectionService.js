// src/services/inspectionService.js
import BaseApiService from './baseApiService';

class InspectionService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/inspection-reporting/records', 'bg_os_inspection_reports_register');
    this.draftKey = 'bg_os_inspection_draft';
    this.legacyDraftKey = 'bg_inspection_draft';
  }

  /**
   * Normalize frontend coating inspection report state to backend database schema
   */
  normalizePayload(report, status = 'Approved', metrics = {}) {
    const data = report.data || report;

    const report_no = report.reportNo || report.id || data.reportNo || data.id || data.stages?.s1?.reportNo || 'CIR-BG-DRAFT';
    const project_name = report.projectName || data.projectName || data.stages?.s1?.projectName || '';
    const project_no = report.projectNo || data.projectNo || data.stages?.s1?.projectNo || '';
    const customer = report.customer || data.customer || data.stages?.s1?.customer || '';
    const vendor = report.vendor || data.vendor || data.stages?.s1?.vendor || '';
    const work_location = report.workLocation || data.workLocation || data.stages?.s1?.workLocation || '';
    const equipment = report.equipment || data.equipment || data.stages?.s1?.equipment || '';
    const lead_inspector = report.inspector || report.leadInspector || data.leadInspector || data.stages?.s1?.signApplicator?.name || '';
    const lead_cert = report.leadCert || data.leadCert || '';
    const tpi_inspector = report.tpiInspector || data.tpiInspector || '';
    const tpi_agency = report.tpiAgency || data.tpiAgency || '';
    const inspection_date = report.date || data.date || data.stages?.s1?.date || null;

    const overall_compliance = parseFloat(
      report.overallCompliance ??
      metrics.weatherCompliancePct ??
      metrics.compliancePct ??
      100.0
    ) || 100.0;

    const verdict = report.verdict || metrics.verdict || data.verdict || 'PASS';
    const rep_status = status || report.status || data.status || 'Approved';
    const revision = report.revision || data.revision || 'R0';

    return {
      report_no,
      project_name,
      project_no,
      customer,
      vendor,
      work_location,
      equipment,
      lead_inspector,
      lead_cert,
      tpi_inspector,
      tpi_agency,
      inspection_date: inspection_date || undefined,
      overall_compliance,
      verdict,
      status: rep_status,
      revision,
      data,
      metrics,
      notes: report.notes || '',
    };
  }

  /**
   * Normalize backend database object to frontend format
   */
  formatRecord(record) {
    if (!record) return null;
    const data = record.data || {};
    const indianDateStr = record.created_at
      ? record.created_at.split(' ')[0]
      : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

    return {
      ...data,
      id: record.report_no || (data.reportNo ? data.reportNo : `CIR-${record.id}`),
      backendId: record.id,
      reportNo: record.report_no || data.reportNo || '',
      date: record.inspection_date || data.date || indianDateStr,
      projectNo: record.project_no || data.projectNo || '',
      projectName: record.project_name || data.projectName || '',
      customer: record.customer || data.customer || '',
      vendor: record.vendor || data.vendor || '',
      workLocation: record.work_location || data.workLocation || '',
      equipment: record.equipment || data.equipment || '',
      inspector: record.lead_inspector || data.leadInspector || '',
      leadInspector: record.lead_inspector || data.leadInspector || '',
      leadCert: record.lead_cert || data.leadCert || '',
      tpiInspector: record.tpi_inspector || data.tpiInspector || '',
      tpiAgency: record.tpi_agency || data.tpiAgency || '',
      overallCompliance: parseFloat(record.overall_compliance ?? 100),
      verdict: record.verdict || data.verdict || 'PASS',
      status: record.status || data.status || 'Approved',
      revision: record.revision || data.revision || 'R0',
      savedAt: record.updated_at || record.created_at || new Date().toISOString(),
      data: data,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Retrieve all saved inspection reports from backend with localStorage fallback
   */
  async getReports(params = {}) {
    const list = await this.list(params);
    if (list && list.length > 0) {
      return list.map(r => this.formatRecord(r));
    }

    // Fallback to local storage
    const local = this.getLocalItems();
    return local;
  }

  /**
   * Save finalized inspection report into database register
   */
  async saveReport(reportData, status = 'Approved', metrics = {}) {
    const payload = this.normalizePayload(reportData, status, metrics);
    payload.is_active_draft = false;

    // Check if updating existing remote record
    if (reportData.backendId) {
      const updated = await this.update(reportData.backendId, payload);
      if (updated) {
        return this.formatRecord(updated);
      }
    }

    // Check by report_no if duplicate
    const created = await this.create(payload);
    if (created) {
      return this.formatRecord(created);
    }

    // Fallback save to local storage
    const localRecord = {
      ...payload.data,
      id: payload.report_no,
      savedAt: new Date().toISOString(),
      status: payload.status,
      verdict: payload.verdict,
      data: payload.data
    };
    this.saveLocalItem(localRecord);
    return localRecord;
  }

  /**
   * Delete inspection report
   */
  async deleteReport(id, backendId) {
    if (backendId) {
      await this.delete(backendId);
    }
    this.deleteLocalItem(id);
    return true;
  }

  /**
   * Retrieve active working draft with localStorage fallback
   */
  async getDraft() {
    const url = `${this.baseUrl}${this.endpoint}/draft/`;
    try {
      const res = await fetch(url, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.data) {
          try {
            localStorage.setItem(this.draftKey, JSON.stringify(remote.data));
          } catch (e) {}
          return remote.data;
        }
      }
    } catch (err) {
      console.warn('[InspectionService] Remote draft unavailable:', err);
    }

    try {
      const local = localStorage.getItem(this.draftKey) || localStorage.getItem(this.legacyDraftKey);
      return local ? JSON.parse(local) : null;
    } catch {
      return null;
    }
  }

  /**
   * Auto-save the active working draft to database with localStorage fallback
   */
  async saveDraft(draftData, metrics = {}) {
    if (!draftData) return;

    try {
      localStorage.setItem(this.draftKey, JSON.stringify(draftData));
    } catch (e) {
      console.warn('[InspectionService] LocalStorage draft save failed:', e);
    }

    const payload = this.normalizePayload(draftData, 'Draft', metrics);
    payload.is_active_draft = true;

    const url = `${this.baseUrl}${this.endpoint}/draft/`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[InspectionService] Network error saving draft to server:', err);
    }
  }

  /**
   * Purge active working draft both on server and locally
   */
  async clearDraft() {
    try {
      localStorage.removeItem(this.draftKey);
      localStorage.removeItem(this.legacyDraftKey);
    } catch (e) {
      console.warn('[InspectionService] Error clearing local draft:', e);
    }

    const url = `${this.baseUrl}${this.endpoint}/draft/`;
    try {
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[InspectionService] Error clearing server draft:', err);
    }
  }

  /**
   * Claim guest inspection dossiers and working drafts after login
   */
  async claimGuestReports() {
    const url = `${this.baseUrl}${this.endpoint}/claim-guest/`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[InspectionService] Error claiming guest reports:', err);
    }
  }

  /**
   * Synchronize guest reports from localStorage to newly authenticated user account
   */
  async syncGuestReportsAfterLogin() {
    try {
      await this.claimGuestReports();

      const localDraft = localStorage.getItem(this.draftKey) || localStorage.getItem(this.legacyDraftKey);
      if (localDraft) {
        try {
          const draftObj = JSON.parse(localDraft);
          await this.saveDraft(draftObj);
        } catch (e) {}
      }
    } catch (e) {
      console.warn('[InspectionService] Failed syncing guest reports post-login:', e);
    }
  }
}

export const inspectionService = new InspectionService();
export default inspectionService;
