'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';
import { useSound } from '@/lib/utils/sounds';

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const { play } = useSound();
  const isInView = useInView(containerRef as any, { margin: "-100px" });
  
  // Use MotionValues for ZERO re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isInside, setIsInside] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ startX: 0, startY: 0, x: 0, y: 0, w: 0, h: 0 });

  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const xOuter = useSpring(useTransform(mouseX, [-500, 500], [-60, 60]), springConfig);
  const yOuter = useSpring(useTransform(mouseY, [-500, 500], [-60, 60]), springConfig);
  const xInner = useSpring(useTransform(mouseX, [-500, 500], [-40, 40]), springConfig);
  const yInner = useSpring(useTransform(mouseY, [-500, 500], [-40, 40]), springConfig);
  const xText = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), springConfig);
  const yText = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), springConfig);

  const crosshairX = useSpring(0, { stiffness: 1000, damping: 60 });
  const crosshairY = useSpring(0, { stiffness: 1000, damping: 60 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !isInView) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    
    crosshairX.set(curX);
    crosshairY.set(curY);
    mouseX.set(curX - rect.width / 2);
    mouseY.set(curY - rect.height / 2);

    if (isSelecting) {
      setSelection(prev => ({
        ...prev,
        x: Math.min(curX, prev.startX),
        y: Math.min(curY, prev.startY),
        w: Math.abs(curX - prev.startX),
        h: Math.abs(curY - prev.startY)
      }));
    }
  }, [isSelecting, isInView]);

  return (
    <Section 
      id="philosophy" 
      className="!py-0 min-h-screen border-y border-zinc-900 bg-black font-mono cursor-crosshair select-none overflow-hidden"
      containerClassName="h-full min-h-screen flex items-center justify-center py-20"
    >
      <div 
        ref={containerRef as any}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          const rect = containerRef.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setIsSelecting(true);
          setSelection({ startX: x, startY: y, x, y, w: 0, h: 0 });
          play('pop');
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { setIsInside(true); play('hover'); }}
        onMouseUp={() => setIsSelecting(false)}
        onMouseLeave={() => { setIsInside(false); setIsSelecting(false); }}
        className="absolute inset-0 z-0"
      />

      {/* Fibonacci SVG - Static & Lightweight */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]">
        <svg viewBox="0 0 1000 618" preserveAspectRatio="xMidYMid slice" className="w-full h-full text-zinc-100 fill-none stroke-current stroke-[0.5]">
          <rect x="0" y="0" width="618" height="618" /><rect x="618" y="0" width="382" height="382" /><rect x="618" y="382" width="236" height="236" />
          <path d="M 618,618 A 618,618 0 0 1 0,0 M 618,618 A 382,382 0 0 0 1000,236" />
        </svg>
      </div>

      {/* Optimized HUD Lines */}
      <motion.div style={{ left: crosshairX, opacity: isInside ? 0.5 : 0 }} className="absolute top-0 w-[1px] h-full bg-zinc-700 z-30 pointer-events-none will-change-transform" />
      <motion.div style={{ top: crosshairY, opacity: isInside ? 0.5 : 0 }} className="absolute left-0 w-full h-[1px] bg-zinc-700 z-30 pointer-events-none will-change-transform" />

      {isSelecting && (
        <div 
          className="absolute border border-white/30 bg-white/5 z-[60] pointer-events-none" 
          style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }} 
        />
      )}

      <div className="w-full flex flex-col lg:flex-row items-center gap-20 relative z-20 pointer-events-none">
        <div className="lg:w-[61.8%] space-y-12">
          <Heading align="right" subtitle="از مرز کدها">مهندسی فراتر</Heading>
          
          <p className="text-xl md:text-3xl font-sans text-zinc-400 leading-relaxed max-w-2xl text-justify">
            ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست. در گروه بقایی، هنر طراحی و قدرت مهندسی با هم ترکیب می‌شوند تا سیستم‌هایی خلق شوند که در مقیاس‌های میلیونی بدون وقفه عمل می‌کنند.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <div className="text-lg font-bold text-white uppercase font-display tracking-normal">دقت مهندسی</div>
              <p className="text-[10px] text-zinc-500 text-right tracking-normal">محاسبات بی نقص و بهینه.</p>
            </div>
            <div className="space-y-1 text-left">
              <div className="text-lg font-bold text-white uppercase text-right font-display tracking-normal">پایداری سیستم</div>
              <p className="text-[10px] text-zinc-500 text-right tracking-normal">تداوم عملیاتی در شرایط سخت.</p>
            </div>
          </div>
        </div>

        <div className="lg:w-[38.2%] flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="relative w-80 h-80 flex items-center justify-center">
            <motion.div style={{ x: xOuter, y: yOuter, transformStyle: "preserve-3d" }} className="absolute inset-0 border border-dashed border-white/10 rounded-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-full h-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
              </motion.div>
            </motion.div>
            <motion.div style={{ x: xInner, y: yInner }} className="absolute w-60 h-60 border border-white/5 rounded-full flex items-center justify-center pointer-events-none" />
            <motion.div style={{ x: xText, y: yText }} className="text-center space-y-2">
              <div className="text-6xl md:text-7xl font-black font-display text-white tracking-tighter">
                {toPersianDigits(10)}Y+
              </div>
              <div className="text-[8px] font-bold uppercase text-zinc-600 font-display tracking-widest">Experience</div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}