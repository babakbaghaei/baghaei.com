'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useInView } from 'framer-motion';

type Amount = number | 'some' | 'all';

interface Opts {
  once?: boolean;
  amount?: Amount;
  margin?: string;
}

/**
 * Drop-in replacement for framer-motion's `useInView` that self-heals a MISSED
 * initial reveal.
 *
 * ROOT CAUSE it fixes: framer's `whileInView` / `useInView` rely on a single
 * IntersectionObserver whose first callback fires once, on mount. Under this
 * app's mount pipeline the layout is not settled at that instant — the
 * Preloader overlay is animating (fixed, ~3s), Lenis `root` smooth-scroll is
 * initialising, and the two local fonts load with `display:swap` (reflow). If
 * the first IO callback runs against that transient state and an
 * above-the-fold element is (mis)reported as out-of-view, `once:true` unobserves
 * and the element stays stuck at its `hidden` variant until the user manually
 * scrolls (a real intersection change re-delivers a callback). That is exactly
 * the "have to scroll up/down once for the top sections to appear" bug.
 *
 * The fix: keep framer's observer for the normal path, but ALSO re-check the
 * element geometry across the settle window (rAF + timers spanning the
 * preloader/lenis/font-swap window). If the element is genuinely within the
 * viewport by the amount framer would require, force it shown. Below-the-fold
 * elements are untouched — they reveal via the normal observer when scrolled to.
 */
export function useInViewOnce<T extends Element = HTMLElement>(
  ref: RefObject<T | null>,
  opts: Opts = {},
): boolean {
  const inView = useInView(ref, opts as Parameters<typeof useInView>[1]);
  const [healed, setHealed] = useState(false);
  // Keep opts stable-ish for the effect without re-subscribing every render.
  // Refresh the ref in an effect (not during render) so it's read-only from the
  // IntersectionObserver callback below.
  const amountRef = useRef(opts.amount);
  useEffect(() => {
    amountRef.current = opts.amount;
  });

  useEffect(() => {
    if (inView || healed) return;

    const requiredRatio = (() => {
      const a = amountRef.current;
      if (typeof a === 'number') return Math.min(Math.max(a, 0), 1);
      if (a === 'all') return 0.99;
      return 0.01; // 'some' / undefined => any sliver counts
    })();

    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.height <= 0 || r.width <= 0) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const withinX = r.left < vw && r.right > 0;
      const withinY = r.top < vh && r.bottom > 0;
      if (!withinX || !withinY) return;
      const visibleY = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = visibleY / r.height;
      if (ratio >= requiredRatio - 0.001) setHealed(true);
    };

    // Re-check right after paint, then across the settle window. The last tick
    // (~3.9s) is comfortably past the preloader's word cycle + wave exit.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(check);
    });
    const timers = [250, 700, 1400, 2600, 3900].map((ms) => window.setTimeout(check, ms));

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timers.forEach(clearTimeout);
    };
  }, [inView, healed, ref]);

  return inView || healed;
}
