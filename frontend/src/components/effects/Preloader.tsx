'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

const words = ["مهندسی", "دقت", "امنیت", "مقیاس‌پذیری", "خلاقیت", "گروه فناوری بقایی"];

// Session guard: the full word sequence plays only on the first load of a
// session. Later loads within the same tab/session skip the intro entirely.
const SESSION_KEY = 'btg_preloaded';

// Read the session flag (client-only). True = the intro already played this
// session, so it should be skipped on this load.
function alreadyPreloaded() {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function Preloader() {
  const reduceMotion = usePrefersReducedMotion();

  // Start true so SSR and the first client paint AGREE (both render the
  // overlay) — no hydration mismatch. After mount we reconcile in a rAF (a
  // callback, not the effect body, so cascading-render lint stays happy): if
  // the intro already played this session, hide it (≈1-frame brand flash);
  // otherwise mark the session so later loads skip it.
  const [shouldPlay, setShouldPlay] = useState(true);

  const [index, setIndex] = useState(0);
  const [dimension, setInitialDimension] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (alreadyPreloaded()) {
        setShouldPlay(false);
        return;
      }
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const updateDimension = () => {
      setInitialDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimension();
    window.addEventListener('resize', updateDimension);
    return () => window.removeEventListener('resize', updateDimension);
  }, []);

  // Word cycling — only the first time in a session AND with motion allowed.
  useEffect(() => {
    if (!shouldPlay || reduceMotion) return;

    const timeout = setTimeout(() => {
      if (index === words.length - 1) {
        setIsLoading(false);
      } else {
        setIndex(index + 1);
      }
    }, index === 0 ? 1000 : 150);

    return () => clearTimeout(timeout);
  }, [index, shouldPlay, reduceMotion]);

  // Reduced-motion (first visit): show a single beat then hand off instantly —
  // no word cycle, no wave. Still fires the exit so the loaded handoff happens.
  useEffect(() => {
    if (!shouldPlay || !reduceMotion) return;
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [shouldPlay, reduceMotion]);

  // This session already saw the intro (or SSR): render nothing.
  if (!shouldPlay) return null;

  // Reduced-motion: a minimal instant fade, no wave path.
  if (reduceMotion) {
    return (
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-background text-foreground"
          >
            <span className="text-4xl md:text-6xl font-black font-display tracking-tighter opacity-75">
              {words[words.length - 1]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const opacity = {
    initial: { opacity: 0 },
    enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
  };

  const slideUp = {
    initial: {
      y: 0
    },
    exit: {
      y: "-100%",
      transition: { duration: 1.2, ease: cubicBezier(0.76, 0, 0.24, 1), delay: 0.2 }
    }
  };

  const pathVariants = {
    initial: {
      d: `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`,
    },
    exit: {
      d: `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`,
      transition: { duration: 1.2, ease: cubicBezier(0.76, 0, 0.24, 1), delay: 0.2 }
    }
  };

  return (
    <AnimatePresence mode='wait'>
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background text-foreground"
        >
          {dimension.width > 0 && (
            <>
              <motion.p
                variants={opacity}
                initial="initial"
                animate="enter"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="flex items-center absolute z-10 text-4xl md:text-6xl font-black font-display tracking-tighter"
              >
                {words[index]}
                <span className="block w-3 h-3 bg-foreground rounded-full mr-4 animate-pulse" />
              </motion.p>
              <svg className="absolute top-0 w-full h-[calc(100%+300px)] fill-background pointer-events-none">
                <motion.path
                  variants={pathVariants}
                  initial="initial"
                  exit="exit"
                />
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
