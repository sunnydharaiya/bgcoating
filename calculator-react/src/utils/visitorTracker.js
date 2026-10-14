// calculator-react/src/utils/visitorTracker.js
import { useEffect, useRef } from 'react';
import { API_BASE_URL } from './api';
import { getUrlFor } from './router';

// In-memory tracker state
let currentRoute = '';
let currentVisitHash = '';
let currentStartTime = 0;
let lastReportedSec = 0;
let heartbeatInterval = null;
let isListenersAttached = false;

/**
 * Retrieve or generate persistent unique visitor hash (SHA-style random device identifier)
 */
export function getOrCreateVisitorHash() {
  if (typeof window === 'undefined') return '';

  try {
    let vh = localStorage.getItem('bg_visitor_hash');
    if (vh && vh.trim()) return vh.trim();

    const match = document.cookie.match(/(?:^|;\s*)bg_visitor_hash=([^;]+)/);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      localStorage.setItem('bg_visitor_hash', decoded);
      return decoded;
    }

    // Generate new persistent visitor identifier
    vh = 'vh_v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('bg_visitor_hash', vh);
    document.cookie = `bg_visitor_hash=${encodeURIComponent(vh)}; path=/; max-age=31536000; SameSite=Lax`;
    return vh;
  } catch (e) {
    return 'vh_anon_' + Date.now().toString(36);
  }
}

/**
 * Send duration heartbeat or final beacon to backend
 */
export function sendDurationHeartbeat(isFinal = false) {
  if (typeof window === 'undefined' || !currentVisitHash || !currentRoute) return;

  const elapsedSec = Math.max(1, Math.round((Date.now() - currentStartTime) / 1000));
  if (!isFinal && elapsedSec <= lastReportedSec) return;
  lastReportedSec = elapsedSec;

  const visitorHash = getOrCreateVisitorHash();
  const endpoint = `${API_BASE_URL}/api/v1/visitors/duration/`;

  const payload = JSON.stringify({
    visit_hash: currentVisitHash,
    visitor_hash: visitorHash,
    duration: elapsedSec,
    page_url: currentRoute
  });

  if (isFinal && navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon(endpoint, blob);
      if (ok) return;
    } catch (e) {
      // Fallback to fetch keepalive
    }
  }

  try {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload,
      keepalive: Boolean(isFinal),
      credentials: 'include'
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Initialize global browser listeners (visibility change, page unload)
 */
function attachWindowListenersOnce() {
  if (typeof window === 'undefined' || isListenersAttached) return;
  isListenersAttached = true;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendDurationHeartbeat(true);
    }
  });

  window.addEventListener('pagehide', () => {
    sendDurationHeartbeat(true);
  });

  window.addEventListener('beforeunload', () => {
    sendDurationHeartbeat(true);
  });
}

/**
 * Switch tracking to a new route / tool view
 */
export function trackRouteView(routePath) {
  if (typeof window === 'undefined') return;
  attachWindowListenersOnce();

  const cleanPath = (routePath || window.location.pathname || '/calculator').split('?')[0];

  // If already tracking this exact route, don't restart session
  if (currentRoute === cleanPath && currentVisitHash) return;

  // Finalize previous route if active
  if (currentVisitHash && currentRoute) {
    sendDurationHeartbeat(true);
  }

  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }

  // Setup new session for this route
  currentRoute = cleanPath;
  currentVisitHash = 'hit_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  currentStartTime = Date.now();
  lastReportedSec = 0;

  // Initial immediate registration ping (1 second stay registered on entry)
  sendDurationHeartbeat(false);

  // 15-second heartbeat interval
  heartbeatInterval = setInterval(() => {
    sendDurationHeartbeat(false);
  }, 15000);
}

/**
 * Stop active tracking
 */
export function stopTracking() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (currentVisitHash) {
    sendDurationHeartbeat(true);
  }
}

/**
 * Helper to record user actions (like applying a preset, calculating, or submitting)
 * Silently touches duration heartbeat and updates the server record
 */
export function trackCalculatorApply(actionName = 'apply', details = {}) {
  try {
    sendDurationHeartbeat(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bg_calculator_action', {
        detail: { action: actionName, route: currentRoute, details, timestamp: Date.now() }
      }));
    }
  } catch (e) {}
}

/**
 * React Hook for silent, automatic visitor & duration tracking
 */
export function useVisitorTracker(activePage, activeSubTool) {
  const lastTrackedPathRef = useRef('');

  useEffect(() => {
    const routePath = getUrlFor(activePage, activeSubTool);
    if (routePath !== lastTrackedPathRef.current) {
      lastTrackedPathRef.current = routePath;
      trackRouteView(routePath);
    }
  }, [activePage, activeSubTool]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);
}
