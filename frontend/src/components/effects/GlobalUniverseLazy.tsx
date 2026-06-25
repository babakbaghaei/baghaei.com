'use client';

import dynamic from 'next/dynamic';
import type { SolarScale } from './solarScale';

// The solar-system background is a heavy, purely-decorative canvas effect
// (real Keplerian ephemeris math). Load it lazily on the client only, after
// hydration, so it never blocks the initial bundle or first paint.
const GlobalUniverse = dynamic(() => import('./GlobalUniverse'), { ssr: false });

export default function GlobalUniverseLazy(props: { renderBackground?: boolean; scale?: Partial<SolarScale> }) {
  return <GlobalUniverse {...props} />;
}
