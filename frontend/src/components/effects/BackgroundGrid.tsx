'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function BackgroundGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const spotlightBackground = useTransform([x, y], ([cx, cy]: any) => 
    `radial-gradient(600px circle at ${cx}px ${cy}px, rgba(255,255,255,0.3), transparent 80%)`
  );

  const ambientBackground = useTransform([x, y], ([cx, cy]: any) => 
    `radial-gradient(800px circle at ${cx}px ${cy}px, white, transparent 100%)`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
      {/* Static Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Interactive Spotlight on Grid */}
      <motion.div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: spotlightBackground,
          maskImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          maskSize: '40px 40px',
          WebkitMaskImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          WebkitMaskSize: '40px 40px',
        }}
      />

      {/* Subtle Ambient Light */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: ambientBackground
        }}
      />
    </div>
  );
}
