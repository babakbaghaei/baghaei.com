'use client';

import { useSyncExternalStore } from 'react';
import { subscribeA11y, getForcedReduceMotion } from './a11y-prefs';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  // Track BOTH the OS media query and the user's in-app accessibility override,
  // so toggling "کاهش حرکت" in the menu re-renders every JS render gate too.
  const unsubA11y = subscribeA11y(callback);
  if (typeof window === 'undefined' || !window.matchMedia) return unsubA11y;
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => {
    mq.removeEventListener('change', callback);
    unsubA11y();
  };
}

function getSnapshot() {
  const os =
    typeof window !== 'undefined' && !!window.matchMedia
      ? window.matchMedia(QUERY).matches
      : false;
  // The in-app toggle can only force reduction ON; it never overrides an OS
  // "reduce" back to full motion (the conservative, expected direction).
  return os || getForcedReduceMotion();
}

// Server snapshot is always false so SSR/first hydration render matches; React
// swaps to the live client value immediately after hydration (no mismatch).
function getServerSnapshot() {
  return false;
}

/**
 * Reliable `prefers-reduced-motion: reduce` tracker.
 *
 * Framer Motion's own `useReducedMotion()` caches the preference in a global
 * ref on first query, which can read stale across navigations / runtime
 * preference changes. This hook reads the live media query via
 * useSyncExternalStore and re-renders on change — use it for hard render gates
 * (e.g. skipping a decorative effect entirely). For declarative motion values,
 * the root <MotionConfig reducedMotion="user"> already handles transforms.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
