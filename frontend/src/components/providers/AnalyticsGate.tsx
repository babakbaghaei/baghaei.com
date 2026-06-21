'use client';

import { useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

const CONSENT_KEY = 'cookie-consent-v10';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  // `cookie-consent-updated` fires from CookieConsent in this tab; `storage`
  // covers consent changes made in another tab.
  window.addEventListener('cookie-consent-updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('cookie-consent-updated', callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // "Accept all" stores { all: true, ... }; granular save stores { analytical }.
    return parsed?.all === true || parsed?.analytical === true;
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Loads Google Analytics ONLY after the visitor has consented to analytical
 * cookies (GDPR/ePrivacy). Reads consent reactively via useSyncExternalStore,
 * so acceptance (which dispatches `cookie-consent-updated`) activates analytics
 * immediately — no page reload, and no setState-in-effect.
 */
export default function AnalyticsGate({ gaId }: { gaId: string }) {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!allowed) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
