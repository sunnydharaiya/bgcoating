// src/services/painterService.js
import BaseApiService from './baseApiService';

class PainterService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/painter-qualification/records', 'bgcoating.spray.reports.v1');
    this.draftKey = 'bg_painter_draft';
  }

  /**
   * Normalize frontend spray painter qualification state to backend database schema
   */
  normalizePayload(report, status = 'Draft', metrics = {}) {
    const data = report.data || report;

    const rep_no = report['f-rep-no'] || report.repNo || data['f-rep-no'] || data.repNo || report.rep_no || 'SP-QR-DRAFT';
    const operator_name = report['f-name'] || report.name || report.operatorName || data['f-name'] || data.name || report.operator_name || '';
    const category = report['f-category'] || report.category || data['f-category'] || data.category || 'Spray Painter';
    const civil_id = report['f-civil'] || report.civil || report.civilId || data['f-civil'] || data.civilId || report.civil_id || '';
    const project_name = report['f-proj'] || report.proj || report.projectName || data['f-proj'] || data.proj || report.project_name || '';
    const client = report['f-client'] || report.client || data['f-client'] || '';
    const contractor = report['f-contractor'] || report.contractor || data['f-contractor'] || '';
    const location = report['f-location'] || report.location || data['f-location'] || '';
    const qualification_card_no = report['f-qual-card'] || report.qualificationCardNo || data['f-qual-card'] || data.qualificationCardNo || '';
    const qualification_date = report['f-qual-date'] || report.qualificationDate || data['f-qual-date'] || null;
    const next_assessment_date = report['f-next-date'] || report.nextAssessmentDate || data['f-next-date'] || null;

    const overall_score = parseFloat(report.overall ?? metrics.overall ?? data.overall ?? report.overallScore ?? 0) || 0.0;
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
      repNo: record.rep_no || data['f-rep-no'] || data.repNo || '',
      name: record.operator_name || data['f-name'] || data.name || '',
      operatorName: record.operator_name || data['f-name'] || data.name || '',
      category: record.category || data['f-category'] || data.category || 'Spray Painter',
      civil: record.civil_id || data['f-civil'] || data.civil || '',
      civilId: record.civil_id || data['f-civil'] || data.civilId || '',
      proj: record.project_name || data['f-proj'] || data.proj || '',
      projNo: data['f-proj-no'] || data.projNo || '',
      projectName: record.project_name || data['f-proj'] || data.projectName || '',
      client: record.client || data['f-client'] || data.client || '',
      contractor: record.contractor || data['f-contractor'] || data.contractor || '',
      location: record.location || data['f-location'] || data.location || '',
      qualificationCardNo: record.qualification_card_no || data['f-qual-card'] || data.qualificationCardNo || '',
      qualificationDate: record.qualification_date || data['f-qual-date'] || data.qualificationDate || '',
      nextAssessmentDate: record.next_assessment_date || data['f-next-date'] || data.nextAssessmentDate || '',
      overall: parseFloat(record.overall_score ?? data.overall ?? 0) || 0,
      overallScore: parseFloat(record.overall_score ?? data.overall ?? 0) || 0,
      verdict: record.verdict || data.verdict || 'PENDING',
      status: record.status || data.status || 'Draft',
      repRev: record.revision || data.repRev || 'R0',
      preparedBy: data['sig2-name'] || data.preparedBy || 'QA/QC Inspector',
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
   * Save a spray painter qualification report to the database register
   */
  async saveReport(report, status = 'Draft', metrics = {}) {
    const payload = this.normalizePayload(report, status, metrics);
    const saved = await this.create(payload);
    return this.formatRecord(saved);
  }

  /**
   * Update an existing qualification report in database
   */
  async updateReport(id, report, status = 'Draft', metrics = {}) {
    const payload = this.normalizePayload(report, status, metrics);
    const updated = await this.update(id, payload);
    return this.formatRecord(updated);
  }

  /**
   * Delete a qualification report
   */
  async deleteReport(id) {
    return await this.delete(id);
  }

  // --- Single Active Draft Synchronization ---

  /**
   * Retrieve the active working draft from database with localStorage fallback
   */
  async getDraft() {
    const url = `${this.baseUrl}${this.endpoint}/draft/`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const remoteDraft = await res.json();
        if (remoteDraft && remoteDraft.data && Object.keys(remoteDraft.data).length > 0) {
          localStorage.setItem(this.draftKey, JSON.stringify(remoteDraft.data));
          return remoteDraft.data;
        }
      }
    } catch (err) {
      console.warn('[PainterService] Network error fetching draft, using local storage:', err);
    }

    try {
      const local = localStorage.getItem(this.draftKey);
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
      console.warn('[PainterService] LocalStorage draft save failed:', e);
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
      console.warn('[PainterService] Network error saving draft to server:', err);
    }
  }

  /**
   * Purge active working draft both on server and locally
   */
  async clearDraft() {
    try {
      localStorage.removeItem(this.draftKey);
    } catch (e) {
      console.warn('[PainterService] Error clearing local draft:', e);
    }

    const url = `${this.baseUrl}${this.endpoint}/draft/`;
    try {
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[PainterService] Error clearing server draft:', err);
    }
  }

  /**
   * Claim guest qualification dossiers and working drafts after login
   */
  async claimGuestReports(reportIds = []) {
    const url = `${this.baseUrl}${this.endpoint}/claim-guest-reports/`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ report_ids: reportIds }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[PainterService] Error claiming guest reports:', err);
    }
  }

  /**
   * Synchronize guest reports from localStorage to newly authenticated user account
   */
  async syncGuestReportsAfterLogin() {
    try {
      const localReports = this.getLocalItems();
      const localDraft = localStorage.getItem(this.draftKey);

      const numericIds = localReports
        .map(r => r.id)
        .filter(id => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)));

      if (numericIds.length > 0) {
        await this.claimGuestReports(numericIds);
      }

      if (localDraft) {
        try {
          const draftObj = JSON.parse(localDraft);
          await this.saveDraft(draftObj);
        } catch (e) {
          console.warn('[PainterService] Error re-syncing local draft on login:', e);
        }
      }

      const freshReports = await this.getReports();
      return freshReports;
    } catch (err) {
      console.warn('[PainterService] Error during syncGuestReportsAfterLogin:', err);
    }
  }
}

export const painterService = new PainterService();
export default painterService;
