'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function CoreArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);

  const particles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      x: [Math.cos(i) * 100, Math.cos(i) * 120, Math.cos(i) * 100],
      y: [Math.sin(i) * 100, Math.sin(i) * 120, Math.sin(i) * 100],
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-64 h-64 flex items-center justify-center"
      >
        {/* Central Core */}
        <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-12 h-12 bg-primary rounded-xl border border-white/20 shadow-[0_0_50px_rgba(34,197,94,0.5)] rotate-45" />

        {/* Floating Nodes & Connections (Abstract SVG Structure) */}
        <svg viewBox="0 0 200 200" className="absolute w-full h-full text-white/20 overflow-visible">
          {[...Array(6)].map((_, i) => (
            <motion.g key={i} animate={{ rotate: 360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}>
              <circle cx={100 + Math.cos(i) * 80} cy={100 + Math.sin(i) * 80} r="2" fill="currentColor" />
              <line 
                x1="100" y1="100" 
                x2={100 + Math.cos(i) * 80} y2={100 + Math.sin(i) * 80} 
                stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4"
              />
            </motion.g>
          ))}
          {/* Inner Geometric Rings */}
          <motion.circle 
            cx="100" cy="100" r="60" 
            stroke="currentColor" strokeWidth="0.5" fill="none"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.circle 
            cx="100" cy="100" r="40" 
            stroke="currentColor" strokeWidth="1" fill="none"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 20"
          />
        </svg>

        {/* Floating Particles Around the Core */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-primary rounded-full"
            animate={{
              x: p.x,
              y: p.y,
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}