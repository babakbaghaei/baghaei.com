'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  
  // Use springs for smooth but hardware-accelerated movement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 1000, damping: 40, mass: 0.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const text = target.getAttribute('data-cursor-text');
      if (text) setCursorText(text);
      setIsHovering(true);
    };

    const handleHoverEnd = () => {
      setCursorText('');
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);

    // Dynamic selection of interactive elements
    const updateInteractions = () => {
      const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart as any);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    updateInteractions();
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 bg-black dark:bg-white rounded-full pointer-events-none z-[9999] hidden lg:flex items-center justify-center overflow-hidden"
      style={{
        left: x,
        top: y,
        x: "-50%",
        y: "-50%",
        width: isHovering ? (cursorText ? 100 : 60) : 12,
        height: isHovering ? (cursorText ? 100 : 60) : 12,
      }}
      transition={{
        width: { type: 'spring', stiffness: 300, damping: 30 },
        height: { type: 'spring', stiffness: 300, damping: 30 }
      }}
    >
      {cursorText && (
        <span className="text-[10px] font-black text-white dark:text-black uppercase tracking-widest text-center px-2">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}