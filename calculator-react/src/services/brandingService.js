// src/services/brandingService.js
import { getStoredUser, setStoredUser, getAuthToken, API_BASE_URL } from '../utils/api';

export const DEFAULT_COMPANY_PROFILE = {
  name: 'BG INDUSTRIAL COATINGS W.L.L.',
  division: 'Quality Assurance & Technical Services',
  contact: 'ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 Certified',
  address: 'Plot No. 44, Industrial Area, Sector-4, Gujarat, India',
  phone: '+91 98765 43210',
  email: 'qc@bgcoating.com',
  website: 'www.bgcoating.com',
  logo: ''
};

export const DEFAULT_WATERMARK_SETTINGS = {
  enabled: false,
  text: 'CONFIDENTIAL QA/QC DOSSIER',
  opacity: 8,
  angle: -30
};

const COMPANY_STORAGE_KEY = 'bg_company_profile';
const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';
const CREDENTIALS_STORAGE_KEY = 'bg_inspector_credentials';

const LEGACY_COMPANY_KEYS = [
  'bg_company_profile',
  'bg_inspection_company',
  'bg_blaster_company',
  'bg_painter_company',
  'bg_tsa_company',
  'bg_os_company_profile',
  'bg_procedure_company'
];

const LEGACY_WATERMARK_KEYS = [
  'bg_watermark_settings',
  'bg_inspection_watermark',
  'bg_blaster_watermark',
  'bg_painter_watermark',
  'bg_tsa_watermark',
  'bg_os_watermark_settings',
  'bg_procedure_watermark'
];

class BrandingService {
  constructor() {
    this.cachedCompany = null;
    this.cachedWatermark = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('bg_user_updated', () => {
        this.cachedCompany = null;
        this.cachedWatermark = null;
        const comp = this.getCompanyProfile();
        const wm = this.getWatermarkSettings();
        window.dispatchEvent(new CustomEvent('bg_company_profile_updated', { detail: comp }));
        window.dispatchEvent(new CustomEvent('bg_watermark_updated', { detail: wm }));
      });
    }
  }

  // ==========================================
  // 1. COMPANY PROFILE & BRANDING DETAILS
  // ==========================================

  getCompanyProfile() {
    if (this.cachedCompany) return this.cachedCompany;

    const user = getStoredUser();
    const prof = user?.profile || {};

    let candidate = null;

    // A. Check logged-in user profile
    if (prof.company || prof.company_division || prof.company_logo) {
      candidate = {
        name: prof.company || DEFAULT_COMPANY_PROFILE.name,
        division: prof.company_division || prof.department || DEFAULT_COMPANY_PROFILE.division,
        contact: prof.company_contact || prof.mobile || DEFAULT_COMPANY_PROFILE.contact,
        address: prof.address || DEFAULT_COMPANY_PROFILE.address,
        phone: prof.mobile || DEFAULT_COMPANY_PROFILE.phone,
        email: user.email || DEFAULT_COMPANY_PROFILE.email,
        website: prof.website || DEFAULT_COMPANY_PROFILE.website,
        logo: prof.company_logo || ''
      };
    }

    // B. Check localStorage unified key or legacy per-module keys
    if (!candidate) {
      for (const k of LEGACY_COMPANY_KEYS) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.name || parsed.company || parsed.companyName)) {
              candidate = {
                name: parsed.name || parsed.company || parsed.companyName || DEFAULT_COMPANY_PROFILE.name,
                division: parsed.division || parsed.tagline || DEFAULT_COMPANY_PROFILE.division,
                contact: parsed.contact || DEFAULT_COMPANY_PROFILE.contact,
                address: parsed.address || DEFAULT_COMPANY_PROFILE.address,
                phone: parsed.phone || DEFAULT_COMPANY_PROFILE.phone,
                email: parsed.email || DEFAULT_COMPANY_PROFILE.email,
                website: parsed.website || parsed.web || DEFAULT_COMPANY_PROFILE.website,
                logo: parsed.logo || ''
              };
              break;
            }
          }
        } catch (e) {}
      }
    }

    const base = { ...DEFAULT_COMPANY_PROFILE, ...(candidate || {}) };
    this.cachedCompany = {
      ...base,
      company: base.name,
      companyName: base.name,
      division: base.division,
      tagline: base.division,
      contact: base.contact,
      address: base.address,
      phone: base.phone,
      email: base.email,
      website: base.website,
      web: base.website,
      logo: base.logo || ''
    };
    return this.cachedCompany;
  }

  async saveCompanyProfile(newProfile) {
    const current = this.getCompanyProfile();
    const name = newProfile.name || newProfile.company || newProfile.companyName || current.name;
    const division = newProfile.division || newProfile.tagline || current.division;
    const contact = newProfile.contact || current.contact;
    const address = newProfile.address || current.address;
    const phone = newProfile.phone || current.phone;
    const email = newProfile.email || current.email;
    const website = newProfile.website || newProfile.web || current.website;
    const logo = (newProfile.logo !== undefined) ? newProfile.logo : current.logo;

    const updated = {
      ...current,
      ...newProfile,
      name,
      company: name,
      companyName: name,
      division,
      tagline: division,
      contact,
      address,
      phone,
      email,
      website,
      web: website,
      logo
    };
    this.cachedCompany = updated;

    // Persist to unified key and all legacy keys for instant offline sync
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(updated));
      for (const k of LEGACY_COMPANY_KEYS) {
        localStorage.setItem(k, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[BrandingService] LocalStorage company save failed:', e);
    }

    // Broadcast live event to all components & windows
    window.dispatchEvent(new CustomEvent('bg_company_profile_updated', { detail: updated }));

    // Persist to backend UserProfile if authenticated
    const token = getAuthToken();
    if (token) {
      try {
        const payload = {
          company: updated.name,
          company_division: updated.division,
          company_contact: updated.contact,
          company_logo: updated.logo,
          website: updated.website,
          address: updated.address
        };

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/profile/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const currentUser = getStoredUser() || {};
          const nextUser = {
            ...currentUser,
            company: updated.name,
            profile: {
              ...(currentUser.profile || {}),
              ...payload,
              ...(data.profile || {})
            }
          };
          setStoredUser(nextUser);
          window.dispatchEvent(new CustomEvent('bg_user_updated', { detail: nextUser }));
        }
      } catch (err) {
        console.warn('[BrandingService] Error syncing company profile to server:', err);
      }
    }

    return updated;
  }

  // ==========================================
  // 2. WATERMARK SETTINGS & CONTROLS
  // ==========================================

  getWatermarkSettings() {
    if (this.cachedWatermark) return this.cachedWatermark;

    const user = getStoredUser();
    const prof = user?.profile || {};

    let candidate = null;

    // A. Check logged-in user profile
    if (prof.watermark_settings && typeof prof.watermark_settings === 'object' && Object.keys(prof.watermark_settings).length > 0) {
      candidate = prof.watermark_settings;
    }

    // B. Check localStorage unified key or legacy per-module keys
    if (!candidate) {
      for (const k of LEGACY_WATERMARK_KEYS) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              candidate = parsed;
              break;
            }
          }
        } catch (e) {}
      }
    }

    const base = { ...DEFAULT_WATERMARK_SETTINGS, ...(candidate || {}) };
    const rawOpacity = base.opacity !== undefined ? base.opacity : DEFAULT_WATERMARK_SETTINGS.opacity;
    const opacity = rawOpacity > 1 ? rawOpacity : Math.round(rawOpacity * 100);
    const opacityDecimal = rawOpacity > 1 ? rawOpacity / 100 : rawOpacity;
    const angle = base.angle !== undefined ? base.angle : (base.rotation !== undefined ? base.rotation : -30);

    this.cachedWatermark = {
      ...base,
      enabled: base.enabled !== undefined ? !!base.enabled : DEFAULT_WATERMARK_SETTINGS.enabled,
      text: base.text || DEFAULT_WATERMARK_SETTINGS.text,
      opacity,
      opacityDecimal,
      angle,
      rotation: angle
    };
    return this.cachedWatermark;
  }

  async saveWatermarkSettings(newWm) {
    const current = this.getWatermarkSettings();
    const rawOpacity = newWm.opacity !== undefined ? newWm.opacity : current.opacity;
    const opacity = rawOpacity > 1 ? rawOpacity : Math.round(rawOpacity * 100);
    const opacityDecimal = rawOpacity > 1 ? rawOpacity / 100 : rawOpacity;
    const angle = newWm.angle !== undefined ? newWm.angle : (newWm.rotation !== undefined ? newWm.rotation : current.angle);

    const updated = {
      ...current,
      ...newWm,
      enabled: newWm.enabled !== undefined ? !!newWm.enabled : current.enabled,
      text: newWm.text || current.text,
      opacity,
      opacityDecimal,
      angle,
      rotation: angle
    };
    this.cachedWatermark = updated;

    // Persist to unified key and all legacy keys
    try {
      localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(updated));
      for (const k of LEGACY_WATERMARK_KEYS) {
        localStorage.setItem(k, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[BrandingService] LocalStorage watermark save failed:', e);
    }

    // Broadcast live event to all components & windows
    window.dispatchEvent(new CustomEvent('bg_watermark_updated', { detail: updated }));

    // Persist to backend UserProfile if authenticated
    const token = getAuthToken();
    if (token) {
      try {
        const payload = {
          watermark_settings: updated
        };

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/profile/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const currentUser = getStoredUser() || {};
          const nextUser = {
            ...currentUser,
            profile: {
              ...(currentUser.profile || {}),
              watermark_settings: updated,
              ...(data.profile || {})
            }
          };
          setStoredUser(nextUser);
          window.dispatchEvent(new CustomEvent('bg_user_updated', { detail: nextUser }));
        }
      } catch (err) {
        console.warn('[BrandingService] Error syncing watermark settings to server:', err);
      }
    }

    return updated;
  }

  // ==========================================
  // 3. INSPECTOR CREDENTIALS (STAMPS & SIGNATURES)
  // ==========================================

  getInspectorCredentials() {
    const user = getStoredUser();
    const prof = user?.profile || {};

    let local = {};
    try {
      const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      if (raw) local = JSON.parse(raw);
    } catch (e) {}

    return {
      name: prof.full_name || user?.name || local.name || '',
      certNo: prof.emp_id || local.certNo || '',
      stamp: prof.inspector_stamp || local.stamp || null,
      signature: prof.inspector_signature || local.signature || null
    };
  }

  async saveInspectorCredentials(creds) {
    try {
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(creds));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('bg_inspector_credentials_updated', { detail: creds }));

    const token = getAuthToken();
    if (token) {
      try {
        const payload = {
          inspector_stamp: creds.stamp,
          inspector_signature: creds.signature
        };

        await fetch(`${API_BASE_URL}/api/v1/auth/profile/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {}
    }
  }

  // ==========================================
  // 4. MASTER COATING SYSTEMS (DYNAMIC LIBRARY)
  // ==========================================

  async getMasterCoatingSystems() {
    const token = getAuthToken();
    const headers = token ? { 'Authorization': `Token ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/calculator/systems/`, { headers });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.results || []);
        if (list.length > 0) return list;
      }
    } catch (err) {
      console.warn('[BrandingService] Error fetching master systems:', err);
    }

    // Fallback to local storage or defaults
    try {
      const local = localStorage.getItem('bg_master_coating_systems');
      if (local) return JSON.parse(local);
    } catch (e) {}

    return [];
  }

  async saveMasterCoatingSystem(system) {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/calculator/systems/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(system)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[BrandingService] Error saving master coating system:', err);
    }

    // LocalStorage fallback
    try {
      const existing = await this.getMasterCoatingSystems();
      const updated = [system, ...existing];
      localStorage.setItem('bg_master_coating_systems', JSON.stringify(updated));
      return system;
    } catch (e) {
      return system;
    }
  }

  // ==========================================
  // 5. QUALITY TEST CATALOG (DYNAMIC TESTS)
  // ==========================================

  async getQualityTestCatalog(category = 'general') {
    const token = getAuthToken();
    const headers = token ? { 'Authorization': `Token ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/calculator/test-catalog/?category=${category}`, { headers });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.results || []);
        if (list.length > 0) return list;
      }
    } catch (err) {
      console.warn('[BrandingService] Error fetching test catalog:', err);
    }

    return [];
  }

  async addQualityTestItem(testItem) {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/calculator/test-catalog/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testItem)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}

    return testItem;
  }
}

export const brandingService = new BrandingService();
export default brandingService;
