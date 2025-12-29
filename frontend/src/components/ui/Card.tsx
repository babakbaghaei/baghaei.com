'use client';

import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, MotionValue } from 'framer-motion';

interface CardContextType {
 tiltX: MotionValue<number>;
 tiltY: MotionValue<number>;
}

const CardContext = createContext<CardContextType | null>(null);

/**
 * Hook to access card tilt values.
 * Returns zeros if used outside of a Card component.
 */
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
 bgClassName = "bg-card"
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

 const rotateX = useTransform(tiltY, [-0.5, 0.5], [15, -15]);
 const rotateY = useTransform(tiltX, [-0.5, 0.5], [-15, 15]);

 const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
  const angleRad = Math.atan2(x as number, -(y as number));
  return (angleRad * 180) / Math.PI;
 });

 const contrastFactor = useTransform([tiltX, tiltY], ([x, y]) => {
  const d = Math.sqrt(Math.pow(x as number, 2) + Math.pow(y as number, 2));
  return Math.min(d * 2.5, 1);
 });

 const colorB = useTransform(contrastFactor, [0, 1], [glowColor, 'rgba(255,255,255,0.2)']);

 const innerBackground = useMotionTemplate`linear-gradient(
  ${sheenAngle}deg, 
  ${glowColor} 0%, 
  ${glowColor} 50%,
  ${colorB} 100%
 )`;

 const borderBackground = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, white 0%, ${glowColor} 50%, transparent 100%)`;

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
   
   const isMouseOver = e.clientX >= rect.left && 
             e.clientX <= rect.right && 
             e.clientY >= rect.top && 
             e.clientY <= rect.bottom;

   // Proximity detection for border light (active within 600px of card center)
   const centerX = rect.left + rect.width / 2;
   const centerY = rect.top + rect.height / 2;
   const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

   setIsHovered(isMouseOver);
   mouseX.set(x);
   mouseY.set(y);

   innerGlowOpacity.set(isMouseOver ? 1 : 0);
   borderOpacity.set(dist < 600 ? (isMouseOver ? 0.9 : 0.4) : 0.15);
   scale.set(isMouseOver ? 1.02 : 1);

   if (isMouseOver) {
    tiltX.set(x / rect.width - 0.5);
    tiltY.set(y / rect.height - 0.5);
   } else {
    tiltX.set(0);
    tiltY.set(0);
   }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  return () => window.removeEventListener('mousemove', onMouseMove);
 }, [isTouchDevice, isHoverable, innerGlowOpacity, borderOpacity, scale, tiltX, tiltY, mouseX, mouseY]);

 return (
  <CardContext.Provider value={{ tiltX, tiltY }}>
   <div 
    ref={containerRef}
    className={`relative group ${className} ${roundedClass} select-none`}
    style={{ perspective: "2000px" }}
   >
    <motion.div
     style={{ 
      rotateX, 
      rotateY, 
      scale, 
      transformStyle: "preserve-3d",
      willChange: isHovered ? "transform" : "auto",
      transition: "none"
     }}
     className={`relative w-full h-full ${roundedClass}`}
    >
     {/* 1. Background Layer (Masked) */}
     <div className={`absolute inset-0 ${roundedClass} ${bgClassName} shadow-2xl overflow-hidden z-0`}>
      <motion.div 
       style={{
        opacity: innerGlowOpacity,
        background: innerBackground,
        mixBlendMode: 'overlay',
       }}
       className="absolute inset-0 w-full h-full pointer-events-none" 
      />
      
      <motion.div 
       className={`absolute inset-0 pointer-events-none ${roundedClass} z-20`}
       style={{
        opacity: borderOpacity,
        padding: '1px',
        background: borderBackground,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
        WebkitMaskComposite: 'xor', 
        maskComposite: 'exclude',
       }}
      />

      {/* Masked Content Slot (for background icons) */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
       {maskedContent}
      </div>
     </div>

     {/* 2. Content Layer (Unmasked, for Popping) */}
     <div className={`relative z-10 p-10 h-full`} style={{ transformStyle: "preserve-3d" }}>
      {children}
     </div>
    </motion.div>
   </div>
  </CardContext.Provider>
 );
};
