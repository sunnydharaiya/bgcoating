// src/services/manpowerService.js
import BaseApiService from './baseApiService';

class ManpowerService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/manpower-estimation/records', 'bg_os_manpower_records');
    this.draftKey = 'bg_os_manpower_draft';
  }

  /**
   * Normalize frontend estimate state to backend database schema
   */
  normalizePayload(estimation, status = 'Draft', metrics = {}) {
    const data = estimation.data || estimation.snap || estimation;

    const est_no = estimation.estNo || data.estNo || estimation.est_no || 'EST-MP-DRAFT';
    const project_name = estimation.projectName || estimation.proj || data.projectName || estimation.project_name || '';
    const customer = estimation.customer || estimation.cust || data.customer || estimation.customer || '';
    const location = estimation.location || data.location || '';
    const currency = estimation.currency || data.currency || 'INR';

    const total_area = parseFloat(estimation.area ?? metrics.area ?? data.area ?? estimation.total_area ?? 0) || 0.0;
    const tonnage = parseFloat(estimation.tonnage ?? metrics.tonnage ?? data.tonnage ?? 0) || 0.0;
    const blasting_total = parseFloat(estimation.blast ?? metrics.blastTotal ?? data.blastingTotal ?? estimation.blasting_total ?? 0) || 0.0;
    const painting_total = parseFloat(estimation.paint ?? metrics.paintTotal ?? data.paintingTotal ?? estimation.painting_total ?? 0) || 0.0;
    const raw_material_total = parseFloat(estimation.raw ?? metrics.rawTotal ?? data.rawTotal ?? estimation.raw_material_total ?? 0) || 0.0;
    const grand_total = parseFloat(estimation.grand ?? metrics.grandTotal ?? data.grandTotal ?? estimation.grand_total ?? 0) || 0.0;
    const cost_per_m2 = parseFloat(estimation.pm2 ?? metrics.costPerM2 ?? data.costPerM2 ?? estimation.cost_per_m2 ?? 0) || 0.0;

    const est_status = status || estimation.status || data.status || 'Draft';
    const revision = estimation.revision || (data.revisions && data.revisions[0]?.no) || 'Rev. 0';

    return {
      est_no,
      project_name,
      customer,
      location,
      currency,
      total_area,
      tonnage,
      blasting_total,
      painting_total,
      raw_material_total,
      grand_total,
      cost_per_m2,
      status: est_status,
      revision,
      data,
      notes: estimation.notes || '',
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

    const estNo = record.est_no || data.estNo || 'EST-MP';
    const projectName = record.project_name || data.projectName || 'Untitled Project';
    const customer = record.customer || data.customer || 'Untitled Customer';
    const location = record.location || data.location || '';
    const currency = record.currency || data.currency || 'INR';

    const area = parseFloat(record.total_area ?? data.area ?? 0) || 0;
    const tonnage = parseFloat(record.tonnage ?? data.tonnage ?? 0) || 0;
    const blast = parseFloat(record.blasting_total ?? data.blastingTotal ?? data.blast ?? 0) || 0;
    const paint = parseFloat(record.painting_total ?? data.paintingTotal ?? data.paint ?? 0) || 0;
    const raw = parseFloat(record.raw_material_total ?? data.rawTotal ?? data.raw ?? 0) || 0;
    const grand = parseFloat(record.grand_total ?? data.grandTotal ?? data.grand ?? 0) || 0;
    const pm2 = parseFloat(record.cost_per_m2 ?? data.costPerM2 ?? data.pm2 ?? 0) || 0;
    const status = record.status || data.status || 'Draft';
    const revision = record.revision || data.revision || 'Rev. 0';

    return {
      id: record.id,
      estNo,
      proj: projectName,
      projectName,
      cust: customer,
      customer,
      location,
      currency,
      area,
      tonnage,
      blast,
      paint,
      raw,
      grand,
      pm2,
      status,
      revision,
      date: indianDateStr,
      savedAt: record.updated_at || record.created_at || new Date().toISOString(),
      snap: data,
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
   * Save a manpower estimation to the database register
   */
  async saveReport(estimationData, status = 'Draft', metrics = {}) {
    const payload = this.normalizePayload(estimationData, status, metrics);

    let saved = null;
    if (estimationData.id && (typeof estimationData.id === 'number' || /^\d+$/.test(estimationData.id))) {
      saved = await this.update(estimationData.id, payload);
    } else {
      saved = await this.create(payload);
    }

    return this.formatRecord(saved);
  }

  /**
   * Delete an estimation record
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
      console.warn('[ManpowerService] Error fetching remote draft:', e);
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
      console.error('[ManpowerService] localStorage draft write error:', e);
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
        console.warn('[ManpowerService] Remote draft auto-save HTTP error:', res.status, errData);
      }
    } catch (e) {
      console.warn('[ManpowerService] Remote draft auto-save network warning:', e);
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
      console.warn('[ManpowerService] Remote draft purge warning:', e);
    }
  }

  /**
   * Sync guest estimation records to newly authenticated user
   */
  async syncGuestPlansAfterLogin() {
    try {
      const local = this.getLocal();
      const plan_ids = (local || [])
        .map(r => r.id)
        .filter(id => typeof id === 'number' || /^\d+$/.test(id));

      const url = `${this.baseUrl}${this.endpoint}/claim-guest-plans/`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ plan_ids }),
      });

      if (res.ok) {
        // Refresh local cache with latest user data from server
        const updated = await this.list();
        this.setLocal(updated);
        return updated;
      }
    } catch (e) {
      console.warn('[ManpowerService] Guest plan sync warning:', e);
    }
  }
}

export const manpowerService = new ManpowerService();
export default manpowerService;
