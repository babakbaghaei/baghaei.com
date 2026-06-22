'use client';

import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, MotionValue } from 'framer-motion';

/**
 * Shared, module-level mouse tracker.
 *
 * Instead of every <Card> attaching its own `window` mousemove listener
 * (N cards => N global listeners firing on every move), all cards subscribe
 * to this single delegated source. The one window listener is attached lazily
 * when the first subscriber registers and removed when the last unsubscribes.
 * Each card still runs its identical per-card math using the shared clientX/Y.
 */
type MouseSubscriber = (clientX: number, clientY: number) => void;

const mouseSubscribers = new Set<MouseSubscriber>();
let latestClientX = -1000;
let latestClientY = -1000;

const handleGlobalMouseMove = (e: MouseEvent) => {
  latestClientX = e.clientX;
  latestClientY = e.clientY;
  mouseSubscribers.forEach((cb) => cb(e.clientX, e.clientY));
};

const subscribeToMouse = (cb: MouseSubscriber): (() => void) => {
  if (mouseSubscribers.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
  }
  mouseSubscribers.add(cb);

  return () => {
    mouseSubscribers.delete(cb);
    if (mouseSubscribers.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    }
  };
};

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
  colorOnHoverOnly?: boolean;
  contentClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  maskedContent,
  className = "",
  glowColor = "var(--glass-fill)",
  isHoverable = true,
  roundedClass = "rounded-[3rem]",
  bgClassName = "",
  colorOnHoverOnly = false,
  contentClassName = "p-10"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { stiffness: 300, damping: 40, restDelta: 0.001 };
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const innerGlowOpacity = useSpring(0, { stiffness: 200, damping: 35 });
  const borderOpacity = useSpring(0.2, { stiffness: 200, damping: 35 });
  const colorOpacity = useSpring(colorOnHoverOnly ? 0 : 1, { stiffness: 200, damping: 35 });

  // PUSH EFFECT
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-12, 12]);

  const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
    const angleRad = Math.atan2(x as number, -(y as number));
    return (angleRad * 180) / Math.PI;
  });

  const borderBackground = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, var(--glass-edge), ${glowColor} 40%, transparent 100%)`;
  const innerBackground = useMotionTemplate`linear-gradient(${sheenAngle}deg, var(--glass-sheen) 0%, transparent 60%)`;

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice || !isHoverable) return;

    const onMouseMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const isMouseOver = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

      if (isMouseOver) {
        mouseX.set(rect.width - x);
        mouseY.set(rect.height - y);
        tiltX.set(x / rect.width - 0.5);
        tiltY.set(y / rect.height - 0.5);
        innerGlowOpacity.set(1);
        if (colorOnHoverOnly) colorOpacity.set(1);
      } else {
        mouseX.set(x);
        mouseY.set(y);
        tiltX.set(0);
        tiltY.set(0);
        innerGlowOpacity.set(0);
        if (colorOnHoverOnly) colorOpacity.set(0);
      }
      borderOpacity.set(dist < 800 ? (isMouseOver ? 1 : 0.4) : 0.2);
    };

    const unsubscribe = subscribeToMouse(onMouseMove);
    // Prime with the last known cursor position so a card mounting under the
    // cursor reacts immediately, matching the previous per-card behavior.
    onMouseMove(latestClientX, latestClientY);
    return unsubscribe;
  }, [isTouchDevice, isHoverable, innerGlowOpacity, borderOpacity, scale, tiltX, tiltY, mouseX, mouseY, colorOnHoverOnly, colorOpacity]);

  // Touch devices / non-hoverable cards can't hover, so keep them colored.
  useEffect(() => {
    if (colorOnHoverOnly && (isTouchDevice || !isHoverable)) {
      colorOpacity.set(1);
    }
  }, [colorOnHoverOnly, isTouchDevice, isHoverable, colorOpacity]);

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
          {/* 1. GLASS BACKGROUND (neutral by default when colorOnHoverOnly) */}
          <div
            className={`absolute inset-0 ${roundedClass} ${bgClassName}`}
            style={{
              background: bgClassName ? undefined : (colorOnHoverOnly ? "var(--glass-fill)" : glowColor),
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              transform: "translateZ(0px)"
            }}
          />

          {/* 1b. COLOR TINT — fades in on hover (grayscale → color) */}
          {colorOnHoverOnly && !bgClassName && (
            <motion.div
              className={`absolute inset-0 ${roundedClass}`}
              style={{
                opacity: colorOpacity,
                background: glowColor,
                transform: "translateZ(0px)",
                pointerEvents: "none"
              }}
            />
          )}

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
          <div className={`relative z-10 ${contentClassName} h-full`} style={{ transformStyle: "preserve-3d" }}>
            {children}
          </div>
        </motion.div>
      </div>
    </CardContext.Provider>
  );
};