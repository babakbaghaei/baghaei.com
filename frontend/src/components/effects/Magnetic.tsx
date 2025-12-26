'use client';

import React, { useRef, useCallback, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion';

export default function Magnetic({ children, intensity = 0.6, disabled = false }: { children: React.ReactNode, intensity?: number, disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isLocalActive = useRef(false);
  
  const springConfig = { stiffness: 150, damping: 12, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Increased interaction range and strength
    const triggerRadius = 200; 
    const snapRadius = 130; 

    if (distance < triggerRadius) {
      // Stronger pull for the element
      x.set(dx * intensity);
      y.set(dy * intensity);

      if (distance < snapRadius) {
        if (!isLocalActive.current) {
          isLocalActive.current = true;
          // Signal the cursor to snap and possibly go behind
          window.dispatchEvent(new CustomEvent('cursor-magnet', { 
            detail: { 
              active: true, 
              x: centerX + (dx * intensity), 
              y: centerY + (dy * intensity),
              w: rect.width,
              h: rect.height
            } 
          }));
        }
      } else if (isLocalActive.current) {
        isLocalActive.current = false;
        window.dispatchEvent(new CustomEvent('cursor-magnet', { detail: { active: false } }));
      }
    } else if (isLocalActive.current) {
      isLocalActive.current = false;
      x.set(0);
      y.set(0);
      window.dispatchEvent(new CustomEvent('cursor-magnet', { detail: { active: false } }));
    } else {
      x.set(0);
      y.set(0);
    }
  }, [intensity, x, y]);

  const handleMouseLeave = useCallback(() => {
    if (isLocalActive.current) {
      isLocalActive.current = false;
      window.dispatchEvent(new CustomEvent('cursor-magnet', { detail: { active: false } }));
    }
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block relative z-[10000]" // Keep button above background but below global top-z if needed
    >
      {children}
    </motion.div>
  )
}
