'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';

const PHILOSOPHY_LAYERS = [
  {
    title: "ساختار مهندسی",
    subtitle: "STRUCTURE",
    desc: "هر سیستم پایدار، بر پایه‌ی معماری مهندسی‌شده بنا می‌شود. ما خشت اول را با دقت میلی‌متری بنا می‌کنیم.",
    icon: "۰۱"
  },
  {
    title: "امنیت نفوذناپذیر",
    subtitle: "SECURITY",
    desc: "در دنیای امروز، امنیت یک ویژگی نیست؛ یک ضرورت حیاتی است. ما لایه‌های دفاعی را در عمق کد تزریق می‌کنیم.",
    icon: "۰۲"
  },
  {
    title: "تکامل هوشمند",
    subtitle: "EVOLUTION",
    desc: "نرم‌افزارهای ما ایستا نیستند؛ آن‌ها برای رشد همگام با کسب‌وکار شما و مقیاس‌پذیری جهانی طراحی شده‌اند.",
    icon: "۰۳"
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High precision scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[500vh] bg-zinc-950" // Even more space for smoother pinning
      style={{ isolation: 'isolate' }}
    >
      {/* THE PINNED CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                             linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '100px 100px' 
          }} />
          {/* Radial Gradient for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        </div>

        {/* Global UI Elements */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 h-64 w-[1px] bg-white/5 hidden md:block z-50">
          <motion.div 
            style={{ scaleY: smoothProgress, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-primary shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Content Layers */}
        <div className="relative z-10 h-full w-full">
          {PHILOSOPHY_LAYERS.map((layer, index) => (
            <PhilosophyLayer 
              key={index} 
              layer={layer} 
              index={index} 
              progress={smoothProgress} 
            />
          ))}
        </div>

        {/* Vertical Identifier */}
        <div className="absolute bottom-12 right-12 z-50 overflow-hidden mix-blend-difference">
          <motion.div
            className="text-[10px] font-black tracking-[0.8em] text-white/30 uppercase vertical-text"
          >
            Philosophy
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  // Map layers to specific segments of the scroll
  // Layer 0: 0.0 -> 0.33
  // Layer 1: 0.33 -> 0.66
  // Layer 2: 0.66 -> 1.0
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const middle = (start + end) / 2;
  
  // Advanced transforms for "Depth" effect
  // Entrance: Zoom in + Fade In
  // Exit: Zoom in even more + Fade Out
  const opacity = useTransform(progress, 
    [start, start + 0.08, end - 0.08, end], 
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(progress, 
    [start, middle, end], 
    [0.8, 1, 1.2]
  );

  const z = useTransform(progress,
    [start, end],
    [-100, 100]
  );

  const rotateX = useTransform(progress,
    [start, middle, end],
    [10, 0, -10]
  );

  return (
    <motion.div
      style={{ 
        opacity, 
        scale,
        z,
        rotateX,
        perspective: '1000px',
        display: useTransform(progress, (v) => (v >= start - 0.05 && v <= end + 0.05 ? 'flex' : 'none')) as any
      }}
      className="absolute inset-0 items-center justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl px-8 pointer-events-auto">
        
        {/* Background Number */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
          <motion.span 
            style={{ y: useTransform(progress, [start, end], [100, -100]) }}
            className="text-[40rem] md:text-[60rem] font-display font-black text-white"
          >
            {layer.icon}
          </motion.span>
        </div>

        {/* Illustration Area */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end relative">
          <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] flex items-center justify-center">
             {/* Animated Rings */}
             {[...Array(3)].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ rotate: 0 }}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 15 + (i * 5), repeat: Infinity, ease: "linear" }}
                 className="absolute border border-white/5 rounded-full"
                 style={{ 
                   width: `${100 - (i * 20)}%`, 
                   height: `${100 - (i * 20)}%`,
                   borderTopColor: i === 0 ? 'rgba(255,255,255,0.2)' : 'transparent'
                 }}
               />
             ))}
             <div className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white/10 italic">
               {layer.subtitle}
             </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 space-y-10 text-right relative z-30" dir="rtl">
          <div className="space-y-4">
            <motion.div 
              className="text-primary font-display font-bold tracking-[0.3em] uppercase text-sm flex items-center justify-end gap-4"
            >
              <span className="w-12 h-[1px] bg-primary/50" />
              PRINCIPLE {layer.icon}
            </motion.div>
            <h2 className="text-7xl md:text-9xl font-display font-black tracking-tight text-white leading-tight">
              {layer.title}
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-white/50 font-sans leading-relaxed max-w-xl mr-auto font-light">
            {layer.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
