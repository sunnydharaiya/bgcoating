// src/services/baseApiService.js
import { getApiBaseUrl, getAuthToken } from '../utils/api';

/**
 * Base singular API service for all CoatingOS modules.
 * Handles unified GET, POST, DELETE with offline LocalStorage fallback.
 */
class BaseApiService {
  constructor(endpoint, localKey) {
    this.endpoint = endpoint.replace(/\/+$/, '');
    this.localKey = localKey;
  }

  get baseUrl() {
    return getApiBaseUrl();
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }

  // --- Local Storage Helpers ---
  getLocalItems() {
    try {
      const raw = localStorage.getItem(this.localKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn(`[BaseApiService] Error reading ${this.localKey}:`, e);
      return [];
    }
  }

  saveLocalItems(items) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(items));
    } catch (e) {
      console.warn(`[BaseApiService] Error saving ${this.localKey}:`, e);
    }
  }

  // --- Core Singular Operations ---

  /**
   * List records from remote API with fallback/merge from LocalStorage.
   */
  async list(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const url = `${this.baseUrl}${this.endpoint}/${queryString}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (res.ok) {
        const remoteData = await res.json();
        const items = Array.isArray(remoteData) ? remoteData : (remoteData.results || []);
        // Update local cache
        this.saveLocalItems(items);
        return items;
      }
    } catch (err) {
      console.warn(`[BaseApiService] Network error on list ${this.endpoint}, using local cache:`, err);
    }

    // Fallback to local storage if offline or network error
    let local = this.getLocalItems();
    if (params.tool_id) local = local.filter(x => x.tool_id === params.tool_id);
    if (params.category) local = local.filter(x => x.category === params.category);
    if (params.project) {
      const term = params.project.toLowerCase();
      local = local.filter(x => (x.project_name || '').toLowerCase().includes(term));
    }
    return local;
  }

  /**
   * Retrieve a single record by ID.
   */
  async get(id) {
    const url = `${this.baseUrl}${this.endpoint}/${id}/`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`[BaseApiService] Network error on get ${id}:`, err);
    }

    const local = this.getLocalItems();
    return local.find(x => String(x.id) === String(id)) || null;
  }

  /**
   * Create a new record (POST).
   * Always persists locally and attempts remote API sync.
   */
  async create(data) {
    const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record = {
      id: localId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to local storage first for instant resilience
    const localItems = this.getLocalItems();
    localItems.unshift(record);
    this.saveLocalItems(localItems);

    const url = `${this.baseUrl}${this.endpoint}/`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const remoteRecord = await res.json();
        // Replace temporary local record with saved remote record
        const updatedItems = this.getLocalItems().map(item => 
          item.id === localId ? remoteRecord : item
        );
        this.saveLocalItems(updatedItems);
        return remoteRecord;
      }
    } catch (err) {
      console.warn(`[BaseApiService] Remote sync failed, saved locally:`, err);
    }

    return record;
  }

  /**
   * Delete a record (DELETE).
   */
  async delete(id) {
    // Remove locally
    const localItems = this.getLocalItems().filter(x => String(x.id) !== String(id));
    this.saveLocalItems(localItems);

    if (String(id).startsWith('local_')) {
      return { success: true };
    }

    const url = `${this.baseUrl}${this.endpoint}/${id}/`;
    try {
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn(`[BaseApiService] Network error on delete ${id}:`, err);
    }

    return { success: true };
  }

  /**
   * Clear all records.
   */
  async clear() {
    this.saveLocalItems([]);
    const url = `${this.baseUrl}${this.endpoint}/clear-history/`;
    try {
      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn(`[BaseApiService] Network error on clear:`, err);
    }
    return { success: true };
  }
}

export default BaseApiService;
