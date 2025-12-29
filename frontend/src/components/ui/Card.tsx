'use client';

import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, MotionValue } from 'framer-motion';

interface CardContextType {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}

const CardContext = createContext<CardContextType | null>(null);

export const useCardTilt = () => {
  const context = useContext(CardContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  if (!context) return { tiltX: fallbackX, tiltY: fallbackY };
  return context;
};

interface CardProps {
  children: React.ReactNode;
  maskedContent?: React.ReactNode;
  className?: string;
  glowColor?: string;
  isHoverable?: boolean;
  roundedClass?: string;
  bgClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  maskedContent,
  className = "",
  glowColor = "rgba(255,255,255,0.1)",
  isHoverable = true,
  roundedClass = "rounded-[3rem]",
  bgClassName = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { stiffness: 300, damping: 40, restDelta: 0.001 };
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const innerGlowOpacity = useSpring(0, { stiffness: 200, damping: 35 });
  const borderOpacity = useSpring(0.2, { stiffness: 200, damping: 35 });

  // PUSH EFFECT
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-12, 12]);

  const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
    const angleRad = Math.atan2(x as number, -(y as number));
    return (angleRad * 180) / Math.PI;
  });

  const borderBackground = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.8), ${glowColor} 40%, transparent 100%)`;
  const innerBackground = useMotionTemplate`linear-gradient(${sheenAngle}deg, rgba(255,255,255,0.05) 0%, transparent 60%)`;

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice || !isHoverable) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const isMouseOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

      setIsHovered(isMouseOver);
      
      if (isMouseOver) {
        mouseX.set(rect.width - x); 
        mouseY.set(rect.height - y);
        tiltX.set(x / rect.width - 0.5);
        tiltY.set(y / rect.height - 0.5);
        innerGlowOpacity.set(1);
      } else {
        mouseX.set(x);
        mouseY.set(y);
        tiltX.set(0);
        tiltY.set(0);
        innerGlowOpacity.set(0);
      }
      borderOpacity.set(dist < 800 ? (isMouseOver ? 1 : 0.4) : 0.2);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isTouchDevice, isHoverable, innerGlowOpacity, borderOpacity, scale, tiltX, tiltY, mouseX, mouseY]);

  return (
    <CardContext.Provider value={{ tiltX, tiltY }}>
      <div 
        ref={containerRef}
        className={`relative group ${className} ${roundedClass} select-none h-full`}
        style={{ perspective: "2000px" }}
      >
        <motion.div
          style={{ 
            rotateX, 
            rotateY, 
            scale, 
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
          className={`relative w-full h-full ${roundedClass} shadow-2xl`}
        >
          {/* 1. GLASS BACKGROUND */}
          <div 
            className={`absolute inset-0 ${roundedClass} ${bgClassName}`}
            style={{ 
              background: bgClassName ? undefined : glowColor,
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              transform: "translateZ(0px)"
            }}
          />

          {/* 2. LIGHTING EFFECTS */}
          <div className={`absolute inset-0 ${roundedClass} overflow-hidden pointer-events-none`} style={{ transform: "translateZ(1px)" }}>
            <motion.div style={{ opacity: innerGlowOpacity, background: innerBackground, mixBlendMode: 'overlay' }} className="absolute inset-0 w-full h-full" />
            
            {/* FIXED: Added roundedClass here to ensure corner lighting works */}
            <motion.div 
              className={`absolute inset-0 ${roundedClass}`}
              style={{
                opacity: borderOpacity,
                padding: '2px',
                background: borderBackground,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                WebkitMaskComposite: 'xor', 
                maskComposite: 'exclude',
              }}
            />
            
            <div className={`absolute inset-0 ${roundedClass}`} style={{ transformStyle: "preserve-3d" }}>
              {maskedContent}
            </div>
          </div>

          {/* 3. CONTENT LAYER */}
          <div className={`relative z-10 p-10 h-full`} style={{ transformStyle: "preserve-3d" }}>
            {children}
          </div>
        </motion.div>
      </div>
    </CardContext.Provider>
  );
};