'use client';

// User accessibility preferences (font size + forced reduced motion), persisted
// to localStorage and applied to <html>. A single external store so every
// consumer (the menu, the reduced-motion hook) stays in sync and re-renders on
// change — including across tabs via the `storage` event.

import { useSyncExternalStore } from 'react';

export type FontScale = 'sm' | 'base' | 'lg' | 'xl';
export const FONT_SCALES: FontScale[] = ['sm', 'base', 'lg', 'xl'];
const SCALE_VALUE: Record<FontScale, number> = { sm: 0.92, base: 1, lg: 1.15, xl: 1.3 };

const FS_KEY = 'a11y:font-scale';
const RM_KEY = 'a11y:reduce-motion';

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function readFontScale(): FontScale {
  if (typeof window === 'undefined') return 'base';
  try {
    const v = localStorage.getItem(FS_KEY) as FontScale | null;
    return v && v in SCALE_VALUE ? v : 'base';
  } catch {
    return 'base';
  }
}

function readReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(RM_KEY) === '1';
  } catch {
    return false;
  }
}

function applyFontScale(scale: FontScale) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--font-scale', String(SCALE_VALUE[scale]));
}

function applyReduceMotion(on: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('force-reduce-motion', on);
}

export function setFontScale(scale: FontScale) {
  try {
    localStorage.setItem(FS_KEY, scale);
  } catch {
    /* private mode */
  }
  applyFontScale(scale);
  emit();
}

export function setReduceMotion(on: boolean) {
  try {
    localStorage.setItem(RM_KEY, on ? '1' : '0');
  } catch {
    /* private mode */
  }
  applyReduceMotion(on);
  emit();
}

/** Synchronous read of the forced-reduced-motion flag (for useReducedMotion). */
export function getForcedReduceMotion(): boolean {
  return readReduceMotion();
}

/** Subscribe to in-page changes and cross-tab `storage` events. */
export function subscribeA11y(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === FS_KEY || e.key === RM_KEY) {
      applyA11yPrefs();
      cb();
    }
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

/** Re-apply the stored prefs to <html>. Call once on the client at mount. */
export function applyA11yPrefs() {
  applyFontScale(readFontScale());
  applyReduceMotion(readReduceMotion());
}

export function useA11yPrefs() {
  const fontScale = useSyncExternalStore(subscribeA11y, readFontScale, () => 'base' as FontScale);
  const reduceMotion = useSyncExternalStore(subscribeA11y, readReduceMotion, () => false);
  return { fontScale, reduceMotion, setFontScale, setReduceMotion };
}
