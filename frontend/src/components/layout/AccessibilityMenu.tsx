'use client';

import * as React from 'react';
import { SlidersHorizontal, Type, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/lib/utils/sounds';
import { useA11yPrefs, applyA11yPrefs, FONT_SCALES, type FontScale } from '@/lib/utils/a11y-prefs';

const FONT_LABEL: Record<FontScale, string> = {
  sm: 'کوچک',
  base: 'معمولی',
  lg: 'بزرگ',
  xl: 'خیلی بزرگ',
};

// Per-step preview size for the "آ" sample so the buttons read as a size ramp.
const SAMPLE_SIZE: Record<FontScale, string> = {
  sm: 'text-xs',
  base: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export function AccessibilityMenu() {
  const { fontScale, reduceMotion, setFontScale, setReduceMotion } = useA11yPrefs();
  const { play } = useSound();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Re-apply stored prefs on first client mount (covers a fresh page load).
  React.useEffect(() => {
    applyA11yPrefs();
    setMounted(true);
  }, []);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          play('pop');
          setOpen((v) => !v);
        }}
        onMouseEnter={() => play('hover')}
        aria-expanded={open}
        aria-label="گزینه‌های دسترس‌پذیری"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <SlidersHorizontal className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as any }}
            role="group"
            aria-label="گزینه‌های دسترس‌پذیری"
            dir="rtl"
            className="absolute left-0 mt-2 w-64 origin-top-left overflow-hidden rounded-2xl border border-border bg-background p-3 shadow-2xl z-[120]"
          >
            <div className="mb-2.5 flex items-center gap-2 px-1 text-[13px] font-black font-display text-foreground">
              <Type className="h-4 w-4 text-primary" strokeWidth={2} />
              اندازهٔ متن
            </div>
            <div className="mb-1.5 grid grid-cols-4 gap-1.5">
              {FONT_SCALES.map((s) => {
                const active = fontScale === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      play('pop');
                      setFontScale(s);
                    }}
                    aria-pressed={active}
                    aria-label={FONT_LABEL[s]}
                    className={`flex items-center justify-center rounded-xl border py-2 font-display transition-colors ${
                      active
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    <span className={SAMPLE_SIZE[s]}>آ</span>
                  </button>
                );
              })}
            </div>
            <div className="mb-3 px-1 text-[11px] text-muted-foreground font-display">
              {FONT_LABEL[fontScale]}
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={() => {
                play('pop');
                setReduceMotion(!reduceMotion);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-[13px] font-display text-foreground transition-colors hover:bg-secondary/60"
            >
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" strokeWidth={2} />
                کاهش حرکت
              </span>
              <span
                className={`relative h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
                  reduceMotion ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-background transition-transform ${
                    reduceMotion ? '-translate-x-4' : ''
                  }`}
                />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
