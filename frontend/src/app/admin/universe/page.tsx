'use client';

import React, { useState } from 'react';
import { Orbit } from 'lucide-react';
import GlobalUniverse from '@/components/effects/GlobalUniverseLazy';
import { DEFAULT_SCALE, type SolarScale } from '@/components/effects/solarScale';
import SolarDevPanel, { loadSolarScale } from '@/components/effects/SolarDevPanel';

// Admin home for the foreground solar-system tuner. The same controls that used
// to float over the public home page now live here: tune by eye against the live
// preview, and the values persist to localStorage (read by the homepage Hero on
// this browser). Use «کپی برای کلود» to hand the values back so they can be
// locked into DEFAULT_SCALE in code for every visitor.
export default function AdminUniversePage() {
  const [scale, setScale] = useState<SolarScale>(() => ({ ...DEFAULT_SCALE, ...loadSolarScale() }));

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4 border-b border-border pb-8">
        <Orbit className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight">منظومه شمسی</h1>
          <p className="mt-1 text-sm text-muted-foreground font-display">
            تنظیم زندهٔ مقیاس و نور منظومهٔ پس‌زمینهٔ صفحهٔ اصلی.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Live preview — mirrors the homepage hero corner-Sun framing. */}
        <div className="relative h-[360px] md:h-[480px] rounded-3xl border border-border overflow-hidden bg-[#04060c]">
          <div className="absolute inset-0">
            <GlobalUniverse scale={scale} />
          </div>
          <span className="absolute bottom-3 right-4 text-[11px] font-display text-white/40">
            پیش‌نمایش زنده
          </span>
        </div>

        {/* Controls (embedded, in-flow). */}
        <SolarDevPanel scale={scale} onChange={setScale} embedded />
      </div>
    </div>
  );
}
