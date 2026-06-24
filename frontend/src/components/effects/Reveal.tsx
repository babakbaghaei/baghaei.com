'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
}

export const Reveal = ({ children, width = 'fit-content', delay = 0.2 }: RevealProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Reduced motion: render the content at its final state, no slide/fade-in.
  if (prefersReducedMotion) {
    return <div style={{ position: 'relative', width, overflow: 'hidden' }}>{children}</div>;
  }
  return (
    <div style={{ position: 'relative', width, overflow: 'hidden' }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};