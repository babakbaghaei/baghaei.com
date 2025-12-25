'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const gravityX = useMotionValue(0);
  const gravityY = useMotionValue(0);

  const [hoverType, setHoverType] = useState<'default' | 'link' | 'card' | 'project' | 'black'>('default');

  const mouseSpring = { stiffness: 1000, damping: 60, mass: 0.1 };
  const gravitySpring = { stiffness: 150, damping: 30, mass: 0.5 };
  
  const sx = useSpring(mouseX, mouseSpring);
  const sy = useSpring(mouseY, mouseSpring);
  const gx = useSpring(gravityX, gravitySpring);
  const gy = useSpring(gravityY, gravitySpring);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const hoveredElement = target.closest('[data-cursor]');
      const isLink = target.closest('a, button, input, textarea');
      
      if (hoveredElement) {
        const type = hoveredElement.getAttribute('data-cursor') as any;
        setHoverType(type);
      } else if (isLink) {
        setHoverType('link');
      } else {
        setHoverType('default');
      }
    };

    const handleGravity = (e: any) => {
      gravityX.set(e.detail.x || 0);
      gravityY.set(e.detail.y || 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('cursor-gravity', handleGravity as any);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('cursor-gravity', handleGravity as any);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const cursorVariants = {
    default: {
      width: 12,
      height: 12,
      borderRadius: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    link: {
      width: 48,
      height: 48,
      borderRadius: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    card: {
      width: 64,
      height: 64,
      borderRadius: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    project: {
      width: 160,
      height: 56,
      borderRadius: '100px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    black: {
      width: 24,
      height: 24,
      borderRadius: '100%',
      backgroundColor: 'rgb(0, 0, 0)',
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[1000000] flex items-center justify-center"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={hoverType}
        variants={cursorVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 0.5 }}
        style={{
          x: gx,
          y: gy,
          // Use difference blend mode to auto-invert on white, except when explicitly black
          mixBlendMode: hoverType === 'black' ? 'normal' : 'difference'
        }}
        className="relative flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <AnimatePresence>
          {hoverType === 'project' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex items-center gap-3 text-black font-display text-xs font-black uppercase whitespace-nowrap"
            >
              <span>مشاهده جزئیات</span>
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
