'use client';

import React, { ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';
import { useInViewOnce } from '@/lib/utils/useInViewOnce';

interface RevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
}

export const Reveal = ({ children, width = 'fit-content', delay = 0.2 }: RevealProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Self-healing in-view detection: above-the-fold content reveals on load even
  // if framer's initial IntersectionObserver fire is missed (preloader/lenis/
  // font-swap race). See useInViewOnce.
  const shown = useInViewOnce(ref, { once: true });
  // Reduced motion: render the content at its final state, no slide/fade-in.
  if (prefersReducedMotion) {
    return <div style={{ position: 'relative', width, overflow: 'hidden' }}>{children}</div>;
  }
  return (
    <div style={{ position: 'relative', width, overflow: 'hidden' }}>
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={shown ? 'visible' : 'hidden'}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};