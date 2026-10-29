// src/services/unitRateService.js
import BaseApiService from './baseApiService';

class UnitRateService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/unit-rate-estimation/records', 'bg_os_unitrate_records');
    this.draftKey = 'bg_os_unitrate_draft';
  }

  /**
   * Normalize frontend estimate object to backend database schema
   */
  normalizePayload(estimate) {
    const data = estimate.data || estimate;

    const est_no = estimate.estNo || data.estNo || estimate.est_no || '';
    const project_name = estimate.projectName || data.projectName || estimate.project_name || '';
    const customer = estimate.customer || data.customer || estimate.customer || '';
    const currency = estimate.currency || data.currency || estimate.currency || 'INR';
    const location = estimate.location || data.location || estimate.location || '';
    const estimator = estimate.estimator || data.estimator || estimate.estimator || '';
    const total_area = parseFloat(estimate.totalArea ?? data.totalArea ?? estimate.total_area) || 0.0;
    const grand_total = parseFloat(estimate.grandTotal ?? data.grandTotal ?? estimate.grand_total) || 0.0;
    const cost_per_m2 = parseFloat(estimate.costPerM2 ?? data.costPerM2 ?? estimate.cost_per_m2) || 0.0;
    const status = estimate.status || data.status || 'Draft';
    const revision = estimate.revision || data.revision || 'Rev. 0';

    return {
      est_no,
      project_name,
      customer,
      currency,
      location,
      estimator,
      total_area,
      grand_total,
      cost_per_m2,
      status,
      revision,
      data,
      notes: estimate.notes || '',
    };
  }

  /**
   * Normalize backend database object to frontend format
   */
  formatRecord(record) {
    if (!record) return null;
    const data = record.data || {};
    return {
      id: record.id,
      estNo: record.est_no || data.estNo || '',
      projectName: record.project_name || data.projectName || '',
      customer: record.customer || data.customer || '',
      currency: record.currency || data.currency || 'INR',
      location: record.location || data.location || '',
      estimator: record.estimator || data.estimator || '',
      totalArea: parseFloat(record.total_area ?? data.totalArea) || 0.0,
      grandTotal: parseFloat(record.grand_total ?? data.grandTotal) || 0.0,
      costPerM2: parseFloat(record.cost_per_m2 ?? data.costPerM2) || 0.0,
      status: record.status || data.status || 'Draft',
      revision: record.revision || data.revision || 'Rev. 0',
      date: (record.created_at || '').split('T')[0].split(' ')[0] || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
      data: data,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Retrieve all saved estimates from backend with localStorage fallback
   */
  async getReports(params = {}) {
    const list = await this.list(params);
    return list.map(item => this.formatRecord(item));
  }

  /**
   * Save a quotation take-off to the database register
   */
  async saveReport(estimateData) {
    const payload = this.normalizePayload(estimateData);

    let saved = null;
    // If report has a numeric database ID, update existing
    if (estimateData.id && (typeof estimateData.id === 'number' || /^\d+$/.test(estimateData.id))) {
      saved = await this.update(estimateData.id, payload);
    } else {
      saved = await this.create(payload);
    }

    return this.formatRecord(saved);
  }

  /**
   * Delete an estimate record
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
      console.warn('[UnitRateService] Error fetching remote draft:', e);
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
      const payload = {
        est_no: draftObj.estNo || '',
        project_name: draftObj.projectName || '',
        customer: draftObj.customer || '',
        currency: draftObj.currency || 'INR',
        location: draftObj.location || '',
        estimator: draftObj.estimator || '',
        total_area: parseFloat(draftObj.totalArea) || 0.0,
        grand_total: parseFloat(draftObj.grandTotal) || 0.0,
        cost_per_m2: parseFloat(draftObj.costPerM2) || 0.0,
        status: draftObj.status || 'Draft',
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
      console.warn('[UnitRateService] Remote draft save failed, saved locally:', e);
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
      console.warn('[UnitRateService] Remote draft delete failed:', e);
    }
  }

  /**
   * Claim guest estimates after user logs in
   */
  async syncGuestEstimatesAfterLogin() {
    try {
      const localReports = this.getLocalItems();
      const remoteIds = localReports
        .map(r => r.id)
        .filter(id => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)));

      const url = `${this.baseUrl}${this.endpoint}/claim-guest-estimates/`;
      await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ estimate_ids: remoteIds }),
      });

      // Refresh list after claim
      await this.getReports();
    } catch (e) {
      console.warn('[UnitRateService] syncGuestEstimatesAfterLogin error:', e);
    }
  }
}

export const unitRateService = new UnitRateService();
