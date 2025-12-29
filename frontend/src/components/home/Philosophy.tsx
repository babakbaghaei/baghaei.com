'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Section } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';

const PHILOSOPHY_LAYERS = [
  {
    title: "ساختار",
    subtitle: "STUCTURE",
    desc: "هر سیستم پایدار، بر پایه‌ی معماری مهندسی‌شده بنا می‌شود. ما خشت اول را با دقت میلی‌متری بنا می‌کنیم.",
    icon: "01"
  },
  {
    title: "امنیت",
    subtitle: "SECURITY",
    desc: "در دنیای امروز، امنیت یک ویژگی نیست؛ یک ضرورت حیاتی است. ما لایه‌های دفاعی را در عمق کد تزریق می‌کنیم.",
    icon: "02"
  },
  {
    title: "تکامل",
    subtitle: "EVOLUTION",
    desc: "نرم‌افزارهای ما ایستا نیستند؛ آن‌ها برای رشد همگام با کسب‌وکار شما و مقیاس‌پذیری جهانی طراحی شده‌اند.",
    icon: "03"
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
    <div ref={containerRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Grid - Decorative */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Global Progress Indicator - Vertical Line */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 h-1/2 w-px bg-border hidden md:block">
          <motion.div 
            style={{ scaleY: smoothProgress, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-primary"
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
          {PHILOSOPHY_LAYERS.map((layer, index) => (
            <PhilosophyLayer 
              key={index} 
              layer={layer} 
              index={index} 
              progress={smoothProgress} 
            />
          ))}
        </div>

        {/* Floating Perspective Text */}
        <motion.div 
          style={{ 
            opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
            y: useTransform(smoothProgress, [0, 1], [50, -50])
          }}
          className="absolute bottom-12 left-12 hidden lg:block"
        >
          <div className="text-[10px] font-black tracking-[0.5em] text-muted-foreground uppercase vertical-text">
            Philosophy of Engineering
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  
  // Create range-specific transforms
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [0.8, 1.2]);
  const y = useTransform(progress, [start, end], [100, -100]);
  const blur = useTransform(progress, [start, start + 0.05, end - 0.05, end], ["10px", "0px", "0px", "10px"]);

  return (
    <motion.div
      style={{ opacity, scale, y, filter: `blur(${blur})` }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-5xl">
        {/* Visual Number / Icon */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
          <div className="relative">
            <motion.span 
              className="text-[15rem] md:text-[25rem] font-display font-black leading-none opacity-5 dark:opacity-10 text-primary select-none"
            >
              {toPersianDigits(layer.icon)}
            </motion.span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
              <span className="text-4xl md:text-6xl font-display font-black tracking-tighter text-foreground whitespace-nowrap">
                {layer.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 space-y-6 text-right px-4 pointer-events-auto" dir="rtl">
          <div className="inline-flex items-center gap-4">
            <div className="w-12 h-px bg-primary" />
            <span className="text-primary font-display font-bold tracking-widest uppercase text-sm">
              Layer {layer.icon}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-none text-foreground">
            {layer.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-sans leading-relaxed max-w-md">
            {layer.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
