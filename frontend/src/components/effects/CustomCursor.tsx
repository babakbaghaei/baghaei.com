'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

type CursorState = 'default' | 'clickable' | 'text';

// Classify what the pointer is over → drives the ring shape. Shared by the
// mouseover fast-path AND the post-click re-check (see below).
function classify(el: Element | null): CursorState {
  if (!el) return 'default';
  if (el.closest('input, textarea, [contenteditable="true"]')) return 'text';
  if (el.closest('button, a, .clickable, [role="button"], label, select')) return 'clickable';
  return 'default';
}

export default function CustomCursor() {
  const [state, setState] = useState<CursorState>('default');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  // Raw pointer position. The DOT reads these directly (zero lag → precision),
  // the RING reads the spring-smoothed copies (lag → personality / weight).
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  // Last real pointer coordinates — used to re-hit-test after a click opens an
  // overlay (modal/menu) UNDER a stationary cursor, where no mouseover fires.
  const lastPos = useRef({ x: -100, y: -100 });

  const ringConfig = { stiffness: 380, damping: 30, mass: 0.6 };
  const ringX = useSpring(cursorX, ringConfig);
  const ringY = useSpring(cursorY, ringConfig);

  useEffect(() => {
    // The cursor is a purely decorative motion effect; skip it entirely for
    // users who prefer reduced motion (and never attach any listeners).
    if (shouldReduceMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    // The hit-test runs DOM .closest() queries, so throttle to one call per
    // animation frame instead of firing on every mouseover event.
    let rafId: number | null = null;
    let pendingTarget: HTMLElement | null = null;
    const handleHover = (e: MouseEvent) => {
      pendingTarget = e.target as HTMLElement;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setState(classify(pendingTarget));
      });
    };

    // After a click, an overlay (ProjectModal, CommandMenu, dropdown…) often
    // mounts directly under a NOW-STATIONARY cursor. No mouseover fires, so the
    // ring would stay stuck on its pre-click shape (e.g. the big clickable halo).
    // Re-hit-test the real element under the last pointer position on the next
    // two frames (once the overlay has mounted) so the ring corrects itself.
    let reArm1: number | null = null;
    let reArm2: number | null = null;
    const reEvaluate = () => {
      const { x, y } = lastPos.current;
      setState(classify(document.elementFromPoint(x, y)));
    };
    const scheduleReEvaluate = () => {
      if (reArm1 !== null) cancelAnimationFrame(reArm1);
      if (reArm2 !== null) cancelAnimationFrame(reArm2);
      reArm1 = requestAnimationFrame(() => {
        reEvaluate();
        reArm2 = requestAnimationFrame(reEvaluate);
      });
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => {
      setIsPressed(false);
      scheduleReEvaluate();
    };
    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleHover, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (reArm1 !== null) cancelAnimationFrame(reArm1);
      if (reArm2 !== null) cancelAnimationFrame(reArm2);
    };
  }, [cursorX, cursorY, shouldReduceMotion, isVisible]);

  if (shouldReduceMotion) return null;

  // Ring geometry per state. Text → thin tall I-beam; clickable → big soft halo;
  // default → neutral ring. Pressing nudges everything down a touch (tactile).
  const press = isPressed ? 0.82 : 1;
  const ringTarget =
    state === 'text'
      ? { scaleX: 0.16 * press, scaleY: 1.5 * press, opacity: isVisible ? 0.9 : 0, borderRadius: '3px' }
      : state === 'clickable'
        ? { scaleX: 1.7 * press, scaleY: 1.7 * press, opacity: isVisible ? 1 : 0, borderRadius: '999px' }
        : { scaleX: 1 * press, scaleY: 1 * press, opacity: isVisible ? 0.7 : 0, borderRadius: '999px' };

  // Dot collapses to nothing on clickable/text so the ring leads the eye.
  const dotScale = state === 'default' ? (isPressed ? 0.7 : 1) : 0;

  return (
    <>
      {/* Trailing ring — spring-followed, mix-blend so it reads on any bg.
          z sits ABOVE every overlay (ProjectModal is z-[100000], preloader
          z-[10000]) so the cursor is never painted behind an opened modal —
          that z-order gap was why the cursor "disappeared" on card open. */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-primary pointer-events-none z-[100001] mix-blend-difference hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={ringTarget}
        transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.5 }}
      />
      {/* Precision dot — locked to the raw pointer, no lag. Above the ring
          and every overlay so it always leads the eye, even over a modal. */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[100002] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{ scale: dotScale, opacity: isVisible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.4 }}
      />
    </>
  );
}
