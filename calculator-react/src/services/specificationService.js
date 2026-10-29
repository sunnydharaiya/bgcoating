// src/services/specificationService.js
import BaseApiService from './baseApiService';

class SpecificationService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/specification-reading/records', 'bg_os_spec_reports_register');
    this.draftKey = 'bg_os_spec_reading_draft';
  }

  /**
   * Normalize frontend report object to backend database schema
   */
  normalizePayload(report) {
    const data = report.data || report;
    const projectData = data.projectData || {};

    const proj_no = report.projNo || projectData.projNo || report.proj_no || '';
    const proj_desc = report.projDesc || projectData.projDesc || report.proj_desc || '';
    const cust_name = report.custName || projectData.custName || report.cust_name || '';
    const din_no = report.dinNo || projectData.dinNo || report.din_no || '';
    const prepared_by = report.preparedBy || projectData.preparedBy || report.prepared_by || '';
    const spec_id = report.id || report.spec_id || `SPEC-${Date.now().toString().slice(-6)}`;
    const status = report.status || 'Draft';
    const revision = report.revision || projectData.revNo || 'Rev. 0';

    return {
      spec_id,
      din_no,
      proj_no,
      proj_desc,
      cust_name,
      prepared_by,
      status,
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
    return {
      id: record.id,
      spec_id: record.spec_id || record.id,
      dinNo: record.din_no || record.dinNo || '',
      projNo: record.proj_no || record.projNo || '',
      projDesc: record.proj_desc || record.projDesc || '',
      custName: record.cust_name || record.custName || '',
      preparedBy: record.prepared_by || record.preparedBy || '',
      date: (record.created_at || '').split('T')[0].split(' ')[0] || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
      status: record.status || 'Draft',
      revision: record.revision || 'Rev. 0',
      data: record.data || {},
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Retrieve all saved reports / dossier registers from backend with fallback
   */
  async getReports(params = {}) {
    const list = await this.list(params);
    return list.map(item => this.formatRecord(item));
  }

  /**
   * Save a completed specification report to the database register
   */
  async saveReport(reportData) {
    const payload = this.normalizePayload(reportData);

    let saved = null;
    // If report has a numeric database ID, update existing
    if (reportData.id && (typeof reportData.id === 'number' || /^\d+$/.test(reportData.id))) {
      saved = await this.update(reportData.id, payload);
    } else {
      saved = await this.create(payload);
    }

    return this.formatRecord(saved);
  }

  /**
   * Delete a specification report
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
      console.warn('[SpecificationService] Error fetching remote draft:', e);
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
   * Save active working draft to backend and localStorage
   */
  async saveActiveDraft(draftObj) {
    // 1. Immediately cache in localStorage for instant responsiveness
    try {
      localStorage.setItem(this.draftKey, JSON.stringify(draftObj));
    } catch (e) {}

    // 2. Persist to backend
    try {
      const url = `${this.baseUrl}${this.endpoint}/draft/`;
      const pData = draftObj.projectData || {};
      const payload = {
        proj_no: pData.projNo || '',
        proj_desc: pData.projDesc || '',
        cust_name: pData.custName || '',
        din_no: pData.dinNo || '',
        prepared_by: pData.preparedBy || '',
        data: draftObj,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[SpecificationService] Remote draft save failed, saved locally:', e);
    }
    return draftObj;
  }

  /**
   * Clear active working draft from backend and localStorage (on Reset)
   */
  async clearActiveDraft() {
    // 1. Immediately wipe local storage cache
    try {
      localStorage.removeItem(this.draftKey);
    } catch (e) {}

    // 2. Wipe from database
    try {
      const url = `${this.baseUrl}${this.endpoint}/draft/`;
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (e) {
      console.warn('[SpecificationService] Remote draft delete failed:', e);
    }
  }

  /**
   * Claim guest specifications after user logs in
   */
  async syncGuestSpecsAfterLogin() {
    try {
      const localReports = this.getLocalItems();
      const remoteIds = localReports
        .map(r => r.id)
        .filter(id => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)));

      const url = `${this.baseUrl}${this.endpoint}/claim-guest-specs/`;
      await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ spec_ids: remoteIds }),
      });

      // Refresh list after claim
      await this.getReports();
    } catch (e) {
      console.warn('[SpecificationService] syncGuestSpecsAfterLogin error:', e);
    }
  }
}

export const specificationService = new SpecificationService();
