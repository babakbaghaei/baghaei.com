'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';

const PHILOSOPHY_LAYERS = [
  {
    title: "مهندسی ساختار",
    subtitle: "INFRASTRUCTURE CORE",
    desc: "پایداری یک سیستم، در هسته‌ی مرکزی آن تعریف می‌شود. ما با استفاده از معماری میکروسرویس و توزیع‌شده، زیرساخت‌هایی می‌سازیم که زیر بار ترافیک میلیونی، حتی یک میلی‌ثانیه وقفه نداشته باشند.",
    tech: ["K8S CLUSTER", "HIGH AVAILABILITY", "LOAD BALANCING", "SCALABILITY: 99.99%"]
  },
  {
    title: "امنیت لایه‌ای",
    subtitle: "DEFENSIVE PROTOCOLS",
    desc: "امنیت برای ما یک افزونه نیست، بلکه زبان مشترک تمام لایه‌هاست. از رمزنگاری سرتاسری تا پروتکل‌های Zero-Trust، دارایی‌های دیجیتال شما در امن‌ترین حالت ممکن قرار دارند.",
    tech: ["AES-256 ENCRYPTION", "WAF HARDENING", "DDoS PROTECTION", "AUDIT LOGS: ACTIVE"]
  },
  {
    title: "تکامل هوشمند",
    subtitle: "ADAPTIVE EVOLUTION",
    desc: "سیستم‌های ما یاد می‌گیرند که چگونه با رشد کسب‌وکار شما بزرگ شوند. ما از تکنولوژی‌های آینده‌نگر استفاده می‌کنیم تا هزینه نگهداری کاهش و سرعت توسعه افزایش یابد.",
    tech: ["AI-DRIVEN OPS", "CI/CD PIPELINES", "FUTURE-PROOF TECH", "LATENCY: <50ms"]
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20
  });

  return (
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[450vh] bg-[#020202] text-white overflow-visible"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Technical HUD Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 h-full items-center px-6 md:px-20">
          
          {/* LEFT SIDE: TECHNICAL DATA VISUALIZER */}
          <div className="hidden lg:flex lg:col-span-7 h-[70vh] relative border-l border-white/5 items-center justify-center bg-white/[0.01] rounded-l-3xl overflow-hidden">
             <TechnicalVisualizer progress={smoothProgress} />
             
             {/* Decorative Corner Brackets */}
             <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/30" />
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/30" />
          </div>

          {/* RIGHT SIDE: TEXT CONTENT (RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-end text-right space-y-12" dir="rtl">
            {PHILOSOPHY_LAYERS.map((layer, index) => (
              <ContentBlock 
                key={index}
                layer={layer}
                index={index}
                progress={smoothProgress}
              />
            ))}
          </div>

        </div>

        {/* Global Progress Scanner */}
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], ["0vh", "100vh"]) }}
          className="absolute right-0 w-full h-[1px] bg-primary/20 z-0 pointer-events-none"
        />
      </div>
    </section>
  );
}

function ContentBlock({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const middle = (start + end) / 2;

  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const x = useTransform(progress, [start, middle, end], [50, 0, 50]);

  return (
    <motion.div
      style={{ opacity, x, position: 'absolute' }}
      className="space-y-6 max-w-xl"
    >
      <div className="inline-flex items-center gap-3">
        <span className="text-primary font-mono text-sm tracking-widest bg-primary/10 px-3 py-1 rounded">
          MODULE_0{index + 1}
        </span>
        <div className="h-px w-12 bg-primary/30" />
      </div>
      
      <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white">
        {layer.title}
      </h2>
      
      <p className="text-xl md:text-2xl text-white/50 font-sans leading-relaxed">
        {layer.desc}
      </p>

      <div className="grid grid-cols-2 gap-4 pt-8">
        {layer.tech.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-white/30 tracking-wider uppercase">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            {t}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TechnicalVisualizer({ progress }: { progress: any }) {
  // Generate random static-like hex data
  const hexLines = useMemo(() => 
    [...Array(20)].map(() => Math.random().toString(16).toUpperCase().substring(2, 30)),
  []);

  return (
    <div className="w-full h-full p-12 flex flex-col gap-8">
      {/* Dynamic Header */}
      <div className="flex justify-between items-start font-mono text-[10px] text-primary/50">
        <div className="space-y-1">
          <div>SYSTEM_OVERRIDE: ACTIVE</div>
          <div>BUFFER_STATUS: STABLE</div>
        </div>
        <div className="text-right space-y-1">
          <motion.div>COORDS: {useTransform(progress, (v) => (v * 100).toFixed(4))}%</motion.div>
          <div>THREAD_COUNT: 128</div>
        </div>
      </div>

      {/* Main Animation Area */}
      <div className="flex-1 relative border border-white/5 rounded-2xl overflow-hidden bg-black/40">
        <AnimatePresence mode="wait">
          <LayerVisual index={progress} />
        </AnimatePresence>
        
        {/* Scrolling Hex Data Column */}
        <div className="absolute right-4 top-0 bottom-0 w-32 overflow-hidden opacity-20 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-2 font-mono text-[8px] text-white leading-none"
          >
            {[...hexLines, ...hexLines].map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="h-24 flex gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 border border-white/5 rounded-lg p-3 space-y-2">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary/40"
                animate={{ width: ["20%", "80%", "40%"] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="text-[8px] font-mono text-white/20 tracking-tighter uppercase">Metric_Sector_0{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayerVisual({ index }: { index: any }) {
  // Logic to switch visuals based on scroll position
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-64 h-64 md:w-96 md:h-96 overflow-visible">
        {/* Central Core */}
        <motion.circle 
          cx="200" cy="200" r="40" 
          stroke="var(--primary)" strokeWidth="2" fill="none"
          animate={{ r: [40, 45, 40], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Dynamic Orbits based on scroll */}
        {[...Array(3)].map((_, i) => (
          <motion.circle
            key={i}
            cx="200" cy="200"
            r={60 + i * 40}
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="5 10"
            fill="none"
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.1 + (i * 0.1) }}
          />
        ))}

        {/* Data Points */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          return (
            <motion.line
              key={i}
              x1="200" y1="200"
              x2={200 + Math.cos(angle) * 150}
              y2={200 + Math.sin(angle) * 150}
              stroke="var(--primary)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              style={{ opacity: 0.2 }}
            />
          );
        })}
      </svg>
    </div>
  );
}