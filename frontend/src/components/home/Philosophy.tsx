'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Section } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';

const STEPS = [
  {
    title: "آنالیز",
    en: "ANALYSIS",
    desc: "کشف هسته‌ی اصلی چالش‌ها و ترسیم نقشه‌ی راه زیرساخت.",
  },
  {
    title: "معماری",
    en: "ARCHITECTURE",
    desc: "مهندسی لایه‌های توزیع‌شده با تمرکز بر پایداری مطلق.",
  },
  {
    title: "توسعه",
    en: "ENGINEERING",
    desc: "خلق کدهای تمیز و ایمن با استانداردهای جهانی.",
  },
  {
    title: "پایش",
    en: "MONITORING",
    desc: "استقرار هوشمند و مراقبت لحظه‌ای از نبض سیستم.",
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Extreme Minimalist Grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-[15%] top-0 w-px h-full bg-border/20" />
          <div className="absolute right-[50%] top-0 w-px h-full bg-border/10 hidden md:block" />
          <div className="absolute left-[15%] top-0 w-px h-full bg-border/20" />
        </div>

        {/* Big Background Text - Minimal Texture */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <motion.h2 
            style={{ scale: useTransform(smoothProgress, [0, 1], [1, 1.5]) }}
            className="text-[40vw] font-display font-black leading-none"
          >
            EXECUTION
          </motion.h2>
        </div>

        {/* Content Flow */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full">
          {STEPS.map((step, i) => (
            <StepItem key={i} step={step} index={i} progress={smoothProgress} />
          ))}
        </div>

        {/* Minimal Progress Tracker */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.5em]">Process_Flow</span>
          <div className="w-32 h-px bg-border/30 relative">
            <motion.div 
              style={{ scaleX: smoothProgress, originX: 0 }}
              className="absolute inset-0 bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ step, index, progress }: { step: typeof STEPS[0], index: number, progress: any }) {
  const start = index * 0.25;
  const end = (index + 1) * 0.25;
  const middle = (start + end) / 2;

  // Modern Fade & Blur Transition
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, middle, end], [0.95, 1, 1.05]);
  const filter = useTransform(progress, [start, start + 0.05, end - 0.05, end], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);

  return (
    <motion.div
      style={{ opacity, scale, filter, display: useTransform(progress, (v) => (v >= start - 0.02 && v <= end + 0.02 ? 'flex' : 'none')) as any }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 pointer-events-none"
    >
      <div className="space-y-2">
        <motion.span 
          initial={{ letterSpacing: "1em", opacity: 0 }}
          whileInView={{ letterSpacing: "0.5em", opacity: 1 }}
          className="text-primary font-mono text-xs md:text-sm font-bold block"
        >
          {step.en}
        </motion.span>
        
        <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black tracking-tighter text-foreground leading-none">
          {step.title}
        </h2>
      </div>

      <p className="text-xl md:text-3xl text-muted-foreground font-sans max-w-2xl leading-tight font-light" dir="rtl">
        {step.desc}
      </p>

      <div className="text-4xl md:text-6xl font-display font-black text-primary/10 italic">
        {toPersianDigits(index + 1)}
      </div>
    </motion.div>
  );
}
