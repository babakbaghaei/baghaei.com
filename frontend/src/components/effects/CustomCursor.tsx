'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
 const [cursorText, setCursorText] = useState('');
 const [isHovering, setIsHovering] = useState(false);
 
 // High-performance MotionValues
 const mouseX = useMotionValue(-100);
 const mouseY = useMotionValue(-100);

 // Optimized spring config for responsiveness with low CPU overhead
 const springConfig = { stiffness: 800, damping: 50, mass: 0.1 };
 const x = useSpring(mouseX, springConfig);
 const y = useSpring(mouseY, springConfig);

 useEffect(() => {
  // 1. Unified Event Listener (Event Delegation)
  // Much more efficient than adding listeners to every single link/button
  const handleInteraction = (e: MouseEvent) => {
   const target = e.target as HTMLElement;
   const interactive = target.closest('a, button, .cursor-pointer, [data-cursor-text]');
   
   if (interactive) {
    const text = interactive.getAttribute('data-cursor-text');
    setCursorText(text || '');
    setIsHovering(true);
   } else {
    setCursorText('');
    setIsHovering(false);
   }
  };

  const moveCursor = (e: MouseEvent) => {
   mouseX.set(e.clientX);
   mouseY.set(e.clientY);
  };

  // 2. Tab Inactivity Optimization
  const handleVisibility = () => {
   if (document.hidden) {
    mouseX.set(-100);
    mouseY.set(-100);
   }
  };

  window.addEventListener('mousemove', moveCursor, { passive: true });
  window.addEventListener('mouseover', handleInteraction, { passive: true });
  document.addEventListener('visibilitychange', handleVisibility);
  
  return () => {
   window.removeEventListener('mousemove', moveCursor);
   window.removeEventListener('mouseover', handleInteraction);
   document.removeEventListener('visibilitychange', handleVisibility);
  };
 }, []);

 return (
  <motion.div
   className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999] hidden lg:flex items-center justify-center overflow-hidden will-change-[width,height,transform]"
   style={{
    left: x,
    top: y,
    x: "-50%",
    y: "-50%",
    width: isHovering ? (cursorText ? 100 : 40) : 6,
    height: isHovering ? (cursorText ? 100 : 40) : 6,
   }}
  >
   {cursorText && (
    <motion.span 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="text-[10px] font-black text-black uppercase tracking-widest text-center px-2"
    >
     {cursorText}
    </motion.span>
   )}
  </motion.div>
 );
}
