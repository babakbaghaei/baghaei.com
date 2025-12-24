'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Section } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isInside, setIsInside] = useState(false);
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ startX: 0, startY: 0, x: 0, y: 0, w: 0, h: 0 });

  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const xOuter = useSpring(useTransform(mouseX, [-500, 500], [-60, 60]), springConfig);
  const yOuter = useSpring(useTransform(mouseY, [-500, 500], [-60, 60]), springConfig);
  const xInner = useSpring(useTransform(mouseX, [-500, 500], [-40, 40]), springConfig);
  const yInner = useSpring(useTransform(mouseY, [-500, 500], [-40, 40]), springConfig);
  const xText = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), springConfig);
  const yText = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), springConfig);

  const crosshairX = useSpring(useMotionValue(0), { stiffness: 1000, damping: 50 });
  const crosshairY = useSpring(useMotionValue(0), { stiffness: 1000, damping: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    
    crosshairX.set(curX);
    crosshairY.set(curY);
    mouseX.set(curX - rect.width / 2);
    mouseY.set(curY - rect.height / 2);
    setIsInside(true);

    if (isSelecting) {
      const box = {
        x: Math.min(curX, selection.startX),
        y: Math.min(curY, selection.startY),
        w: Math.abs(curX - selection.startX),
        h: Math.abs(curY - selection.startY)
      };
      setSelection(prev => ({ ...prev, x: box.x, y: box.y, w: box.w, h: box.h }));
    }
  };

  return (
    <Section 
      id="philosophy" 
      className="!py-0 aspect-[1.618] min-h-[80vh] flex items-center justify-center border-y border-zinc-900 bg-black font-mono cursor-crosshair select-none"
      containerClassName="h-full flex items-center"
    >
      <div 
        ref={containerRef as any}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          const rect = containerRef.current!.getBoundingClientRect();
          setIsSelecting(true);
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setSelection({ startX: x, startY: y, x, y, w: 0, h: 0 });
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsSelecting(false)}
        onMouseLeave={() => { setIsInside(false); setIsSelecting(false); }}
        className="absolute inset-0 z-0"
      />

      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Lightbulb className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      {/* Fibonacci SVG */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-10">
        <svg viewBox="0 0 1000 618" className="w-[110%] h-[110%] text-zinc-100 fill-none stroke-current stroke-[1]">
          <rect x="0" y="0" width="618" height="618" /><rect x="618" y="0" width="382" height="382" /><rect x="618" y="382" width="236" height="236" />
          <path d="M 618,618 A 618,618 0 0 1 0,0 M 618,618 A 382,382 0 0 0 1000,236" />
        </svg>
      </div>

      {/* HUD Lines */}
      <motion.div style={{ x: crosshairX, opacity: isInside ? 0.8 : 0 }} className="absolute top-0 left-0 w-[2px] h-full bg-zinc-500 z-30 pointer-events-none" />
      <motion.div style={{ y: crosshairY, opacity: isInside ? 0.8 : 0 }} className="absolute top-0 left-0 w-full h-[2px] bg-zinc-500 z-30 pointer-events-none" />

      {isSelecting && (
        <div 
          className="absolute border-2 border-white/50 bg-white/5 z-[60] pointer-events-none" 
          style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }} 
        />
      )}

      <div className="w-full flex flex-col lg:flex-row items-center gap-0 relative z-20 pointer-events-none">
        <div className="lg:w-[61.8%] space-y-12 pr-12 text-right">
          <h2 className="text-5xl md:text-8xl font-bold weight-plus-1 font-display text-white leading-none uppercase">
            مهندسی فراتر <br /> <span className="text-zinc-700">از مرز کدها.</span>
          </h2>
          <p className="text-xl md:text-3xl font-sans text-zinc-400 leading-relaxed max-w-2xl">
            ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-1">
              <div className="text-lg font-bold text-white uppercase font-display">دقت مهندسی</div>
              <p className="text-[10px] text-zinc-500 text-right">محاسبات بی نقص.</p>
            </div>
            <div className="space-y-1 text-left">
              <div className="text-lg font-bold text-white uppercase text-right font-display">پایداری سیستم</div>
              <p className="text-[10px] text-zinc-500 text-right">تداوم عملیاتی.</p>
            </div>
          </div>
        </div>

        <div className="lg:w-[38.2%] flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="relative w-80 h-80 flex items-center justify-center">
            <motion.div style={{ x: xOuter, y: yOuter, transformStyle: "preserve-3d" }} className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-full h-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]" />
              </motion.div>
            </motion.div>
            <motion.div style={{ x: xInner, y: yInner }} className="absolute w-60 h-60 border border-white/10 rounded-full flex items-center justify-center pointer-events-none" />
            <motion.div style={{ x: xText, y: yText }} className="text-center space-y-2">
              <div className="text-6xl md:text-7xl font-black font-display text-white tracking-tighter drop-shadow-2xl">
                {toPersianDigits(10)}Y+
              </div>
              <div className="text-[8px] font-bold uppercase text-zinc-500 font-display">Experience</div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}