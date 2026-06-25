'use client';

import React, { useEffect, useState } from 'react';
import { DEFAULT_SCALE, type SolarScale } from './solarScale';

// ── Dev-only solar-system scale tuner ────────────────────────────────────────
// A floating panel (visible ONLY in `next dev`) that drives the foreground
// solar-system's display scale live, around the corner Sun. Babak tunes it by
// eye, hits "کپی برای کلود", and pastes the values back so the defaults can be
// locked into DEFAULT_SCALE. NOTHING here ships to production — Hero gates the
// whole panel behind `process.env.NODE_ENV === 'development'`.

export const SOLAR_SCALE_STORAGE_KEY = 'solar-scale-dev';

// Read the persisted dev override (if any). Returns a partial so missing keys
// fall back to DEFAULT_SCALE at merge time. Safe to call on the client only.
export function loadSolarScale(): Partial<SolarScale> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SOLAR_SCALE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<SolarScale>) : {};
  } catch {
    return {};
  }
}

interface SliderDef {
  key: keyof SolarScale;
  label: string;   // Persian label
  hint: string;    // short Persian description
  min: number;
  max: number;
  step: number;
  decimals?: number; // value-readout precision (defaults from step)
}

interface Section {
  title: string;
  sliders: SliderDef[];
}

// The knobs, grouped. `zoom` is the master multiplier; the rest are fine tunes.
// Ranges are generous so nothing clips at the edges.
const SECTIONS: Section[] = [
  {
    title: 'اندازه و فاصله',
    sliders: [
      { key: 'zoom',     label: 'بزرگنمایی کل',  hint: 'کل منظومه حول خورشید', min: 0.2, max: 4,  step: 0.05 },
      { key: 'sunSize',  label: 'اندازه خورشید', hint: 'قطر هسته خورشید (px)',  min: 30,  max: 420, step: 2 },
      { key: 'sizeBase', label: 'اندازه سیارات', hint: 'قطر زمین مبنا (px)',     min: 4,   max: 64,  step: 1 },
      { key: 'distSpan', label: 'فاصله مدارها',  hint: 'گستره شعاع مدار',       min: 1,   max: 22,  step: 0.1 },
      { key: 'sizeExp',  label: 'تباین اندازه',  hint: '۱ = دقیق؛ کمتر = یکدست‌تر', min: 0.4, max: 1.6, step: 0.02 },
    ],
  },
  {
    title: 'خورشید',
    sliders: [
      { key: 'sunGlow',    label: 'نور خورشید',     hint: '۰ = بدون هاله، ۱ = عادی', min: 0,   max: 3,  step: 0.05 },
      { key: 'sunOpacity', label: 'اوپسیتی خورشید', hint: 'شفافیت کل خورشید',        min: 0.1, max: 1,  step: 0.02 },
      { key: 'sunCx',      label: 'موقعیت X خورشید', hint: '۰ = گوشه چپ',            min: -0.5, max: 1, step: 0.01 },
      { key: 'sunCy',      label: 'موقعیت Y خورشید', hint: '۰ = گوشه بالا',          min: -0.5, max: 1, step: 0.01 },
    ],
  },
  {
    title: 'محیط',
    sliders: [
      { key: 'orbitOpacity', label: 'شفافیت مدارها', hint: '۰ = پنهان', min: 0, max: 0.3, step: 0.005, decimals: 3 },
      { key: 'ambientGlow',  label: 'نور محیط',      hint: 'پخش نور گرم گوشه', min: 0, max: 3, step: 0.05 },
    ],
  },
];

export default function SolarDevPanel({
  scale,
  onChange,
  embedded = false,
}: {
  scale: SolarScale;
  onChange: (next: SolarScale) => void;
  // `embedded` renders the panel in-flow (admin page) instead of as the floating
  // dev overlay. Same controls, same localStorage persistence.
  embedded?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Persist every change so a reload keeps the current tuning.
  const update = (key: keyof SolarScale, value: number) => {
    const next = { ...scale, [key]: value };
    onChange(next);
    try {
      window.localStorage.setItem(SOLAR_SCALE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private-mode errors */
    }
  };

  const reset = () => {
    onChange({ ...DEFAULT_SCALE });
    try {
      window.localStorage.removeItem(SOLAR_SCALE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  // Build the hand-off text Babak pastes back to Claude.
  const handoffText = () => {
    const lines = (Object.keys(DEFAULT_SCALE) as (keyof SolarScale)[])
      .map((k) => `  ${k}: ${scale[k]},`)
      .join('\n');
    return [
      'لطفاً این مقادیر اسکیل منظومه شمسی را به‌عنوان پیش‌فرض در DEFAULT_SCALE (GlobalUniverse.tsx) اعمال کن:',
      '',
      'const DEFAULT_SCALE: SolarScale = {',
      lines,
      '};',
    ].join('\n');
  };

  const copyForClaude = async () => {
    const text = handoffText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback: a temporary textarea for non-secure contexts.
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <div
      dir="rtl"
      className={
        embedded
          ? 'w-full select-none font-sans text-foreground'
          : 'fixed bottom-4 left-4 z-[9999] w-[300px] max-w-[calc(100vw-2rem)] select-none font-sans text-foreground'
      }
      style={{ fontFamily: 'var(--font-iransans), sans-serif' }}
    >
      <div className={embedded
        ? 'rounded-2xl border border-border bg-foreground/[0.02]'
        : 'rounded-2xl border border-white/15 bg-black/80 backdrop-blur-xl shadow-2xl'}>
        {/* Header / toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-right"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            تنظیم منظومه شمسی
          </span>
          <span className="text-xs text-white/50">{open ? '▼' : '▲'}</span>
        </button>

        {open && (
          <div className="max-h-[72vh] space-y-4 overflow-y-auto px-4 pb-4">
            {SECTIONS.map((section) => (
              <div key={section.title} className="space-y-3">
                <div className="border-b border-white/10 pb-1 text-[11px] font-bold tracking-wide text-amber-400/90">
                  {section.title}
                </div>
                {section.sliders.map((s) => (
                  <label key={s.key} className="block">
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="text-xs font-medium">{s.label}</span>
                      <span className="tabular-nums text-xs text-amber-300" dir="ltr">
                        {Number(scale[s.key]).toFixed(s.decimals ?? (s.step < 1 ? 2 : 0))}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={scale[s.key]}
                      onChange={(e) => update(s.key, parseFloat(e.target.value))}
                      dir="ltr"
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-amber-400"
                    />
                    <span className="mt-0.5 block text-[10px] leading-tight text-white/40">{s.hint}</span>
                  </label>
                ))}
              </div>
            ))}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={copyForClaude}
                className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-amber-300"
              >
                {copied ? '✓ کپی شد' : 'کپی برای کلود'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                ریست
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
