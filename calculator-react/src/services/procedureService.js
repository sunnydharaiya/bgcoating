// src/services/procedureService.js
import BaseApiService from './baseApiService';

class ProcedureService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/coating-procedure/records', 'bg_os_procedure_records');
    this.draftKey = 'bg_os_procedure_draft';
  }

  /**
   * Normalize frontend procedure object to backend database schema
   */
  normalizePayload(procedure) {
    const data = procedure.data || procedure;

    const doc_no = procedure.docNo || data.docNo || procedure.doc_no || '';
    const rev_no = procedure.revNo || data.revNo || procedure.rev_no || '0';
    const doc_title = procedure.docTitle || data.docTitle || procedure.doc_title || 'Painting Procedure & Coating Specification';
    const project_name = procedure.projectName || data.projectName || procedure.project_name || '';
    const client_name = procedure.clientName || data.clientName || procedure.client_name || '';
    const contractor_name = procedure.contractorName || data.contractorName || procedure.contractor_name || '';
    const facility_location = procedure.facilityLocation || data.facilityLocation || procedure.facility_location || '';
    const equipment_tag = procedure.equipmentTag || data.equipmentTag || procedure.equipment_tag || '';
    const project_number = procedure.projectNumber || data.projectNumber || procedure.project_number || '';
    const site_location = procedure.siteLocation || data.siteLocation || procedure.site_location || '';
    const prepared_by = procedure.preparedBy || data.preparedBy || procedure.prepared_by || '';
    const status = procedure.status || data.status || 'Draft';
    const revision = procedure.revision || (rev_no ? `Rev. ${rev_no}` : 'Rev. 0');

    return {
      doc_no,
      rev_no,
      doc_title,
      project_name,
      client_name,
      contractor_name,
      facility_location,
      equipment_tag,
      project_number,
      site_location,
      prepared_by,
      status,
      revision,
      data,
      notes: procedure.notes || '',
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
      docNo: record.doc_no || data.docNo || '',
      revNo: record.rev_no || data.revNo || '0',
      docTitle: record.doc_title || data.docTitle || 'Painting Procedure & Coating Specification',
      projectName: record.project_name || data.projectName || '',
      clientName: record.client_name || data.clientName || '',
      contractorName: record.contractor_name || data.contractorName || '',
      facilityLocation: record.facility_location || data.facilityLocation || '',
      equipmentTag: record.equipment_tag || data.equipmentTag || '',
      projectNumber: record.project_number || data.projectNumber || '',
      siteLocation: record.site_location || data.siteLocation || '',
      preparedBy: record.prepared_by || data.preparedBy || '',
      status: record.status || data.status || 'Draft',
      revision: record.revision || (record.rev_no ? `Rev. ${record.rev_no}` : 'Rev. 0'),
      date: (record.created_at || '').split('T')[0].split(' ')[0] || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
      coatingSystems: data.coatingSystems || [],
      data: data,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Retrieve all saved procedures from backend with localStorage fallback
   */
  async getReports(params = {}) {
    const list = await this.list(params);
    return list.map(item => this.formatRecord(item));
  }

  /**
   * Save a completed procedure dossier to the database register
   */
  async saveReport(procedureData) {
    const payload = this.normalizePayload(procedureData);

    let saved = null;
    // If report has a numeric database ID, update existing
    if (procedureData.id && (typeof procedureData.id === 'number' || /^\d+$/.test(procedureData.id))) {
      saved = await this.update(procedureData.id, payload);
    } else {
      saved = await this.create(payload);
    }

    return this.formatRecord(saved);
  }

  /**
   * Delete a procedure record
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
      console.warn('[ProcedureService] Error fetching remote draft:', e);
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
        doc_no: draftObj.docNo || '',
        rev_no: draftObj.revNo || '0',
        doc_title: draftObj.docTitle || '',
        project_name: draftObj.projectName || '',
        client_name: draftObj.clientName || '',
        contractor_name: draftObj.contractorName || '',
        facility_location: draftObj.facilityLocation || '',
        equipment_tag: draftObj.equipmentTag || '',
        project_number: draftObj.projectNumber || '',
        site_location: draftObj.siteLocation || '',
        prepared_by: draftObj.preparedBy || '',
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
      console.warn('[ProcedureService] Remote draft save failed, saved locally:', e);
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
      console.warn('[ProcedureService] Remote draft delete failed:', e);
    }
  }

  /**
   * Claim guest procedures after user logs in
   */
  async syncGuestProceduresAfterLogin() {
    try {
      const localReports = this.getLocalItems();
      const remoteIds = localReports
        .map(r => r.id)
        .filter(id => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)));

      const url = `${this.baseUrl}${this.endpoint}/claim-guest-procedures/`;
      await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ proc_ids: remoteIds }),
      });

      // Refresh list after claim
      await this.getReports();
    } catch (e) {
      console.warn('[ProcedureService] syncGuestProceduresAfterLogin error:', e);
    }
  }
}

export const procedureService = new ProcedureService();
