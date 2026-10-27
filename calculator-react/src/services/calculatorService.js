// src/services/calculatorService.js
import BaseApiService from './baseApiService';

class CalculatorService extends BaseApiService {
  constructor() {
    super('/api/v1/modules/calculator/logs', 'bgcoating.calculator.logs.v1');
  }

  /**
   * Save a calculation log entry.
   */
  async saveLog({
    tool_id,
    tool_name,
    category = 'general',
    project_name = '',
    client_name = '',
    inputs = {},
    results = {},
    notes = '',
  }) {
    if (!tool_id) throw new Error('tool_id is required');
    return await this.create({
      tool_id,
      tool_name: tool_name || tool_id,
      category,
      project_name,
      client_name,
      inputs,
      results,
      notes,
    });
  }

  /**
   * Query logs with optional filters (tool_id, category, project).
   */
  async getLogs(params = {}) {
    return await this.list(params);
  }

  /**
   * Delete an existing calculation log entry.
   */
  async deleteLog(id) {
    return await this.delete(id);
  }

  /**
   * Clear all calculation log history.
   */
  async clearLogs() {
    return await this.clear();
  }

  /**
   * Synchronize guest calculation logs to the newly logged-in user.
   * Uploads any offline/local-only logs and claims any guest logs in the backend.
   */
  async syncGuestLogsAfterLogin() {
    try {
      const localLogs = this.getLocalItems();
      const localOnlyLogs = localLogs.filter(log => String(log.id).startsWith('local_'));
      const remoteIds = localLogs
        .map(log => log.id)
        .filter(id => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)));

      // 1. Post local-only logs to the server under authenticated user
      for (const log of localOnlyLogs) {
        try {
          const { id, created_at, updated_at, ...payload } = log;
          const res = await fetch(`${this.baseUrl}${this.endpoint}/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const saved = await res.json();
            // Replace local_ ID with server ID
            const updated = this.getLocalItems().map(item => item.id === id ? saved : item);
            this.saveLocalItems(updated);
          }
        } catch (e) {
          console.warn('[syncGuestLogsAfterLogin] Failed to sync local log:', e);
        }
      }

      // 2. Claim remote logs created as guest
      try {
        await fetch(`${this.baseUrl}${this.endpoint}/claim-guest-logs/`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ log_ids: remoteIds }),
        });
      } catch (e) {
        console.warn('[syncGuestLogsAfterLogin] Failed to claim guest logs:', e);
      }

      // 3. Re-fetch full user log list to update local cache
      await this.list();

      // 4. Notify app to refresh live drawer badge
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bg_log_saved'));
      }
    } catch (err) {
      console.warn('[syncGuestLogsAfterLogin] Error during log sync:', err);
    }
  }

  /**
   * Generate downloadable CSV for calculation audit records.
   */
  exportLogsAsCsv(logs = []) {
    if (!logs.length) return;
    const headers = ['Log ID', 'Date & Time', 'Tool Name', 'Tool ID', 'Category', 'Project', 'Client', 'Inputs Summary', 'Results Summary'];
    const rows = logs.map(log => [
      log.id,
      new Date(log.created_at).toLocaleString(),
      `"${(log.tool_name || '').replace(/"/g, '""')}"`,
      log.tool_id,
      log.category,
      `"${(log.project_name || '').replace(/"/g, '""')}"`,
      `"${(log.client_name || '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(log.inputs || {}).replace(/"/g, '""')}"`,
      `"${JSON.stringify(log.results || {}).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coating_calculation_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const calculatorService = new CalculatorService();

/**
 * Global helper to auto-log calculation runs in the background.
 */
export async function autoLogCalculation({
  tool_id,
  tool_name,
  category = 'general',
  project_name = '',
  client_name = '',
  inputs = {},
  results = {},
  notes = '',
}) {
  try {
    const res = await calculatorService.saveLog({
      tool_id,
      tool_name,
      category,
      project_name,
      client_name,
      inputs,
      results,
      notes,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bg_log_saved', { detail: res }));
    }
    return res;
  } catch (err) {
    console.warn('[autoLogCalculation] Failed to auto-log calculation:', err);
  }
}

export default calculatorService;
