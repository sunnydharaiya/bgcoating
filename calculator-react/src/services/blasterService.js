// src/services/blasterService.js
import BaseApiService from './baseApiService';

class BlasterService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/blaster-qualification/records', 'bgcoating.blaster.reports.v1');
    this.draftKey = 'bg_blaster_draft';
  }

  /**
   * Normalize frontend blaster qualification state to backend database schema
   */
  normalizePayload(report, status = 'Draft', metrics = {}) {
    const data = report.data || report;

    const rep_no = report.repNo || data.repNo || report.rep_no || 'BL-QR-DRAFT';
    const operator_name = report.operatorName || data.operatorName || report.operator_name || '';
    const category = report.category || data.category || 'Blaster';
    const civil_id = report.civilId || data.civilId || report.civil_id || '';
    const project_name = report.projectName || data.projectName || report.project_name || '';
    const client = report.client || data.client || '';
    const contractor = report.contractor || data.contractor || '';
    const location = report.location || data.location || '';
    const qualification_card_no = report.qualificationCardNo || data.qualificationCardNo || '';
    const qualification_date = report.qualificationDate || data.qualificationDate || null;
    const next_assessment_date = report.nextAssessmentDate || data.nextAssessmentDate || null;

    const overall_score = parseFloat(report.overallScore ?? metrics.overallScore ?? data.overallScore ?? 0) || 0.0;
    const verdict = report.verdict || metrics.verdict || data.verdict || 'PENDING';
    const rep_status = status || report.status || data.status || 'Draft';
    const revision = report.repRev || data.repRev || report.revision || 'R0';

    return {
      rep_no,
      operator_name,
      category,
      civil_id,
      project_name,
      client,
      contractor,
      location,
      qualification_card_no,
      qualification_date: qualification_date || undefined,
      next_assessment_date: next_assessment_date || undefined,
      overall_score,
      verdict,
      status: rep_status,
      revision,
      data,
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
      id: record.id,
      repNo: record.rep_no || data.repNo || '',
      operatorName: record.operator_name || data.operatorName || '',
      category: record.category || data.category || 'Blaster',
      civilId: record.civil_id || data.civilId || '',
      projectName: record.project_name || data.projectName || '',
      client: record.client || data.client || '',
      contractor: record.contractor || data.contractor || '',
      location: record.location || data.location || '',
      qualificationCardNo: record.qualification_card_no || data.qualificationCardNo || '',
      qualificationDate: record.qualification_date || data.qualificationDate || '',
      nextAssessmentDate: record.next_assessment_date || data.nextAssessmentDate || '',
      overallScore: parseFloat(record.overall_score ?? data.overallScore ?? 0) || 0,
      verdict: record.verdict || data.verdict || 'PENDING',
      status: record.status || data.status || 'Draft',
      repRev: record.revision || data.repRev || 'R0',
      date: indianDateStr,
      savedAt: record.updated_at || record.created_at || new Date().toISOString(),
      data: data,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Retrieve all saved qualification reports from backend with localStorage fallback
   */
  async getReports(params = {}) {
    const list = await this.list(params);
    return list.map(item => this.formatRecord(item));
  }

  /**
   * Save a blaster qualification report to the database register
   */
  async saveReport(reportData, status = 'Draft', metrics = {}) {
    const payload = this.normalizePayload(reportData, status, metrics);

    let saved = null;
    if (reportData.id && (typeof reportData.id === 'number' || /^\d+$/.test(reportData.id))) {
      saved = await this.update(reportData.id, payload);
    } else {
      saved = await this.create(payload);
    }

    return this.formatRecord(saved);
  }

  /**
   * Delete a qualification report
   */
  async deleteReport(id) {
    return await this.delete(id);
  }

  /**
   * Retrieve active working draft from backend with localStorage fallback
   */
  async getActiveDraft() {
    try {
      const url = `${this.baseUrl}${this.endpoint}/draft/`;
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.data) {
          localStorage.setItem(this.draftKey, JSON.stringify(remote.data));
          return remote.data;
        }
      }
    } catch (e) {
      console.warn('[BlasterService] Error fetching remote draft:', e);
    }

    // Fallback to local draft
    try {
      const local = localStorage.getItem(this.draftKey);
      return local ? JSON.parse(local) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Debounced Auto-save working draft to backend with localStorage sync
   */
  async saveActiveDraft(draftData, metrics = {}) {
    if (!draftData) return;

    // 1. Immediate local cache sync
    try {
      localStorage.setItem(this.draftKey, JSON.stringify(draftData));
    } catch (e) {
      console.error('[BlasterService] localStorage draft write error:', e);
    }

    // 2. Remote API sync
    try {
      const payload = this.normalizePayload(draftData, 'Draft', metrics);
      const url = `${this.baseUrl}${this.endpoint}/draft/`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...payload,
          is_active_draft: true
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn('[BlasterService] Remote draft auto-save HTTP error:', res.status, errData);
      }
    } catch (e) {
      console.warn('[BlasterService] Remote draft auto-save network warning:', e);
    }
  }

  /**
   * Purge active working draft both remotely and locally
   */
  async clearActiveDraft() {
    try {
      localStorage.removeItem(this.draftKey);
    } catch (e) {}

    try {
      const url = `${this.baseUrl}${this.endpoint}/draft/`;
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (e) {
      console.warn('[BlasterService] Remote draft purge warning:', e);
    }
  }

  /**
   * Sync guest qualification reports to newly authenticated user
   */
  async syncGuestReportsAfterLogin() {
    try {
      const local = this.getLocal();
      const report_ids = (local || [])
        .map(r => r.id)
        .filter(id => typeof id === 'number' || /^\d+$/.test(id));

      const url = `${this.baseUrl}${this.endpoint}/claim-guest-reports/`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ report_ids }),
      });

      if (res.ok) {
        // Refresh local cache with latest user data from server
        const updated = await this.list();
        this.setLocal(updated);
        return updated;
      }
    } catch (e) {
      console.warn('[BlasterService] Guest report sync warning:', e);
    }
  }
}

export const blasterService = new BlasterService();
export default blasterService;
