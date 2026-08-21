// Environment & Config Module
// Uses only environment-stored URLs without hardcoded defaults

export const env = Object.freeze({
  STORE_URL: (import.meta.env && import.meta.env.VITE_STORE_URL) || (typeof window !== 'undefined' && window.__ENV__ ? window.__ENV__.STORE_URL : ''),
  API_URL: (import.meta.env && import.meta.env.VITE_API_URL) || (typeof window !== 'undefined' && window.__ENV__ ? window.__ENV__.API_URL : ''),
});

export const config = Object.freeze({
  url: env.STORE_URL || env.API_URL || '',
  storeUrl: env.STORE_URL,
  apiUrl: env.API_URL,
});

export default config;
