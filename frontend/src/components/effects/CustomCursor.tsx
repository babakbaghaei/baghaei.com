'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    // The trailing custom cursor is a purely decorative motion effect; skip it
    // entirely for users who prefer reduced motion (and never attach listeners).
    if (shouldReduceMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // The hover hit-test runs a DOM .closest() query, so throttle it to one
    // call per animation frame instead of firing on every mouseover event.
    let rafId: number | null = null;
    let pendingTarget: HTMLElement | null = null;
    const handleHover = (e: MouseEvent) => {
      pendingTarget = e.target as HTMLElement;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const isClickable = pendingTarget?.closest('button, a, .clickable, [role="button"]');
        setIsHovered(!!isClickable);
      });
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleHover, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      // Base the element at its LARGEST size (40px) and scale DOWN for the dot
      // state. Scaling a tiny element up rasterizes at the small size and GPU-
      // upscales it (blurry); scaling down from the full-size raster stays crisp.
      className="fixed top-0 left-0 w-10 h-10 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: x,
        y: y,
        translateX: '-50%',
        translateY: '-50%',
        scale: isHovered ? 1 : 0.35,
        willChange: 'transform',
      }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
    />
  );
}