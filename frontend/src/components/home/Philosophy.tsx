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
  
  // Monitoring the scroll progress of the container
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
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[400vh] bg-zinc-950" // Increased height for longer scroll feeling
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Grid - Industrial / Engineering look */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                             linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '60px 60px' 
          }} />
        </div>

        {/* Global Progress Line */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 h-64 w-[2px] bg-white/10 hidden md:block">
          <motion.div 
            style={{ scaleY: smoothProgress, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
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

        {/* Dynamic Label */}
        <div className="absolute bottom-12 right-12 hidden lg:block overflow-hidden">
          <motion.div
            style={{ y: useTransform(smoothProgress, [0, 1], ["0%", "-100%"]) }}
            className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase"
          >
            Philosophy & Vision
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  // Define active range for each layer
  const start = index * 0.25;
  const end = (index + 1) * 0.25;
  
  // Visual transforms
  const opacity = useTransform(progress, 
    [start, start + 0.05, end - 0.05, end], 
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(progress, [start, end], [0.9, 1.1]);
  const zIndex = useTransform(progress, [start, end], [10, 20]);
  
  // Slide effect for titles
  const titleX = useTransform(progress, [start, end], [50, -50]);
  
  return (
    <motion.div
      style={{ 
        opacity, 
        scale,
        zIndex,
        pointerEvents: useTransform(progress, (v) => (v >= start && v <= end ? 'auto' : 'none')) as any
      }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-6xl">
        
        {/* BIG BACKDROP NUMBER */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.04] pointer-events-none select-none">
          <motion.span 
            style={{ x: useTransform(progress, [start, end], [-100, 100]) }}
            className="text-[30rem] md:text-[45rem] font-display font-black"
          >
            {layer.icon}
          </motion.span>
        </div>

        {/* Visual Graphic Element */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end relative z-10">
          <div className="relative w-64 h-64 md:w-96 md:h-96 border border-white/10 rounded-full flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-4 border-t-2 border-primary/30 rounded-full"
             />
             <div className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white/10">
               {layer.subtitle}
             </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 space-y-8 text-right px-4 relative z-20" dir="rtl">
          <div className="space-y-2">
            <motion.div 
              style={{ x: titleX }}
              className="text-primary font-display font-bold tracking-widest uppercase text-sm flex items-center justify-end gap-3"
            >
              <span className="w-8 h-[1px] bg-primary" />
              LAYER {layer.icon}
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tight text-white leading-none">
              {layer.title}
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-white/60 font-sans leading-relaxed max-w-md mr-auto">
            {layer.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}