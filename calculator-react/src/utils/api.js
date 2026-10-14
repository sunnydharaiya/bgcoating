// src/utils/api.js

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const envApi = window.__ENV__?.API_URL;
    if (envApi && typeof envApi === 'string' && !envApi.startsWith('%') && envApi !== 'undefined') {
      return envApi.replace(/\/+$/, '');
    }
    const configApi = window.CONFIG?.apiUrl;
    if (configApi && typeof configApi === 'string' && !configApi.startsWith('%') && configApi !== 'undefined') {
      return configApi.replace(/\/+$/, '');
    }
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://bgcoating.com';
    }
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && !envUrl.startsWith('%') && envUrl !== 'undefined') {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:7777';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Retrieve current authentication token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem('bg_auth_token') || '';
}

/**
 * Store auth token in localStorage
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('bg_auth_token', token);
  } else {
    localStorage.removeItem('bg_auth_token');
  }
}

/**
 * Retrieve cached user data from localStorage
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('bg_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('bg_user', JSON.stringify(user));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bg_user_updated', { detail: user }));
    }
  } else {
    localStorage.removeItem('bg_user');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bg_user_updated', { detail: null }));
    }
  }
}

/**
 * Clear all auth session tokens and user state
 */
export function clearAuth() {
  localStorage.removeItem('bg_auth_token');
  localStorage.removeItem('bg_auth_logged_in');
  localStorage.removeItem('bg_user');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bg_user_updated', { detail: null }));
  }
}

/**
 * Generic API request helper handling JSON serialization and error formatting
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token } = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const reqHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  const authToken = token || getAuthToken();
  if (authToken) {
    reqHeaders['Authorization'] = `Token ${authToken}`;
  }

  const options = {
    method,
    headers: reqHeaders,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMsg = 'An unexpected error occurred.';
      if (typeof data.error === 'string') {
        errorMsg = data.error;
      } else if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (typeof data.message === 'string') {
        errorMsg = data.message;
      } else if (typeof data === 'object') {
        // Collect field-specific errors
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          errorMsg = `${firstKey}: ${data[firstKey][0]}`;
        } else if (firstKey && typeof data[firstKey] === 'string') {
          errorMsg = `${firstKey}: ${data[firstKey]}`;
        }
      }
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    // Network / connection error
    throw new Error(`Unable to connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
  }
}

/**
 * 1. Email/Username + Password Sign In
 */
export async function loginWithEmail(emailOrUsername, password) {
  const data = await apiRequest('/api/v1/auth/login/', {
    method: 'POST',
    body: {
      username: emailOrUsername,
      password: password,
    },
  });

  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem('bg_auth_logged_in', 'true');
  }

  const isPro = Boolean(data.is_pro ?? data.user?.profile?.is_pro ?? data.user?.is_pro ?? false);
  const formattedUser = {
    id: data.user_id,
    name: data.user?.full_name || data.username,
    email: data.email,
    is_pro: isPro,
    role: data.role || data.user?.profile?.role || 'Coating Inspector',
    company: data.company || data.user?.profile?.company || 'BG Coating & Inspection Services',
    provider: data.user?.profile?.auth_provider || 'email',
    avatar: data.user?.profile?.avatar_url || '',
    profile: {
      ...(data.profile || data.user?.profile || {}),
      is_pro: isPro,
    },
  };

  setStoredUser(formattedUser);
  return { ...data, formattedUser };
}

/**
 * 2. Register Account
 */
export async function registerWithEmail({ name, email, password, role, company }) {
  const data = await apiRequest('/api/v1/auth/register/', {
    method: 'POST',
    body: {
      name,
      email,
      password,
      role: role || 'Coating Inspector',
      company: company || 'BG Coating & Inspection Services',
    },
  });

  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem('bg_auth_logged_in', 'true');
  }

  const isPro = Boolean(data.is_pro ?? data.user?.profile?.is_pro ?? data.user?.is_pro ?? false);
  const formattedUser = {
    id: data.user_id,
    name: data.user?.full_name || name || data.username,
    email: data.email,
    is_pro: isPro,
    role: data.role || 'Coating Inspector',
    company: data.company || 'BG Coating & Inspection Services',
    provider: 'email',
    avatar: '',
    profile: {
      ...(data.profile || data.user?.profile || {}),
      is_pro: isPro,
    },
  };

  setStoredUser(formattedUser);
  return { ...data, formattedUser };
}

/**
 * 3. Google OAuth Sign-in & Register
 */
export async function loginWithGoogle({ credential, token, email, name, picture, sub, google_id }) {
  const data = await apiRequest('/api/v1/auth/google/', {
    method: 'POST',
    body: {
      credential,
      token,
      email,
      name,
      picture,
      sub,
      google_id,
    },
  });

  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem('bg_auth_logged_in', 'true');
  }

  const isPro = Boolean(data.is_pro ?? data.user?.profile?.is_pro ?? data.user?.is_pro ?? false);
  const formattedUser = {
    id: data.user_id,
    name: data.user?.full_name || data.username,
    email: data.email,
    is_pro: isPro,
    role: data.role || data.user?.profile?.role || 'Coating Inspector',
    company: data.company || data.user?.profile?.company || 'BG CoatingOS Workspace',
    provider: 'google',
    avatar: data.user?.profile?.avatar_url || picture || '',
    profile: {
      ...(data.profile || data.user?.profile || {}),
      is_pro: isPro,
    },
  };

  setStoredUser(formattedUser);
  return { ...data, formattedUser };
}

/**
 * 4. Get Current User Profile
 */
export async function fetchUserProfile() {
  const current = getStoredUser() || {};
  const params = [];
  if (current.id) params.push(`user_id=${current.id}`);
  if (current.email) params.push(`email=${encodeURIComponent(current.email)}`);
  const endpoint = `/api/v1/auth/profile/${params.length ? `?${params.join('&')}` : ''}`;

  try {
    const data = await apiRequest(endpoint, {
      method: 'GET',
    });
    if (data) {
      const isPro = Boolean(data.is_pro ?? data.profile?.is_pro ?? data.is_superuser ?? false);
      const updatedUser = {
        ...current,
        id: data.id || current.id,
        name: data.full_name || data.username || current.name,
        email: data.email || current.email,
        is_pro: isPro,
        is_superuser: Boolean(data.is_superuser),
        role: data.profile?.role || current.role || 'Coating Inspector',
        company: data.profile?.company || current.company,
        provider: data.profile?.auth_provider || current.provider || 'email',
        avatar: data.profile?.avatar_url || current.avatar || '',
        avatar_url: data.profile?.avatar_url || current.avatar_url || '',
        profile: {
          ...(current.profile || {}),
          ...(data.profile || {}),
          is_pro: isPro,
          avatar_url: data.profile?.avatar_url || current.avatar_url || '',
        },
      };
      setStoredUser(updatedUser);
      return updatedUser;
    }
  } catch (err) {
    console.warn('fetchUserProfile error:', err);
  }
  return current;
}

/**
 * 5. Update Current User Profile Fields
 */
export async function updateUserProfile(profileData) {
  const data = await apiRequest('/api/v1/auth/profile/', {
    method: 'PATCH',
    body: profileData,
  });

  // Update cached user object if name, role or avatar changed
  const current = getStoredUser() || {};
  const updatedAvatar = data.profile?.avatar_url || profileData.avatar_url || current.avatar_url || '';
  const updatedUser = {
    ...current,
    name: data.user?.full_name || profileData.name || current.name,
    email: data.user?.email || profileData.email || current.email,
    role: data.profile?.role || profileData.role || current.role,
    company: data.profile?.company || profileData.company || current.company,
    avatar: updatedAvatar,
    avatar_url: updatedAvatar,
    profile: {
      ...(current.profile || {}),
      ...(data.profile || {}),
      avatar_url: updatedAvatar,
    },
  };
  setStoredUser(updatedUser);

  return data;
}

/**
 * 6. Upload or Update Avatar Image / URL
 */
export async function uploadAvatar(fileOrUrl, action = 'update') {
  const url = `${API_BASE_URL}/api/v1/auth/profile/avatar/`;
  const authToken = getAuthToken();
  const headers = {};
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  let options = { headers };

  if (action === 'remove') {
    options.method = 'DELETE';
  } else if (fileOrUrl instanceof File) {
    options.method = 'POST';
    const formData = new FormData();
    formData.append('avatar', fileOrUrl);
    options.body = formData;
  } else if (typeof fileOrUrl === 'string') {
    options.method = 'POST';
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({ avatar_url: fileOrUrl });
  } else {
    throw new Error('Invalid avatar file or URL');
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update avatar photo');
  }

  // Update cached user
  const current = getStoredUser() || {};
  const newAvatar = data.avatar_url || '';
  const updatedUser = {
    ...current,
    avatar: newAvatar,
    avatar_url: newAvatar,
    profile: {
      ...(current.profile || {}),
      avatar_url: newAvatar,
    },
  };
  setStoredUser(updatedUser);

  return data;
}
