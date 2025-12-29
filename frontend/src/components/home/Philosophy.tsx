'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const PHILOSOPHY_LAYERS = [
  {
    title: "مهندسی ساختار",
    subtitle: "SYSTEM ARCHITECTURE",
    desc: "ما سیستم‌ها را نمی‌سازیم، آن‌ها را معماری می‌کنیم. پایداری در مقیاس بالا تصادفی نیست؛ نتیجه‌ی محاسبات دقیق در لایه‌های زیرساختی است.",
    tech: ["K8S CLUSTER", "HIGH AVAILABILITY", "SCALABILITY: 99.99%"]
  },
  {
    title: "امنیت نفوذناپذیر",
    subtitle: "ZERO-TRUST SECURITY",
    desc: "امنیت در تار و پود کدهای ما تنیده شده است. از رمزنگاری سرتاسری تا پروتکل‌های لایه‌بندی شده، ما از دارایی‌های شما محافظت می‌کنیم.",
    tech: ["AES-256", "WAF HARDENING", "DDoS PROTECTION", "AUDIT: ACTIVE"]
  },
  {
    title: "تکامل هوشمند",
    subtitle: "ADAPTIVE EVOLUTION",
    desc: "محصولات ما برای انطباق با آینده و رشد بی‌پایان در دنیای مدرن طراحی شده‌اند. ما برای چالش‌های فردا، امروز کد می‌زنیم.",
    tech: ["AI-DRIVEN OPS", "CI/CD PIPELINES", "FUTURE-PROOF", "LATENCY: <50ms"]
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      className="relative h-[600vh] bg-[#020202] text-white"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Background Grid - System Style */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 h-full items-center px-6 md:px-20">
          
          {/* LEFT: VISUALIZER */}
          <div className="hidden lg:flex lg:col-span-7 h-[75vh] relative items-center justify-center bg-white/[0.01] rounded-3xl border border-white/5 overflow-hidden">
             {isMounted && <TechnicalVisualizer progress={smoothProgress} />}
             <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/30" />
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/30" />
          </div>

          {/* RIGHT: TEXT (RTL) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-center items-end text-right relative" dir="rtl">
            {PHILOSOPHY_LAYERS.map((layer, index) => (
              <LayerContent 
                key={index}
                layer={layer}
                index={index}
                progress={smoothProgress}
              />
            ))}
          </div>

        </div>

        {/* Technical Status Bar */}
        <div className="absolute bottom-10 left-10 md:left-20 z-50 flex items-center gap-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.3em]">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i}
                className="h-1 w-8 rounded-full bg-white/10"
                style={{ 
                  backgroundColor: useTransform(smoothProgress, 
                    [i * 0.33, (i + 0.33) * 1], 
                    ["rgba(255,255,255,0.1)", "rgba(59,130,246,1)"]
                  )
                }}
              />
            ))}
          </div>
          <span>Kernel_Sync_Verified</span>
        </div>
      </div>
    </section>
  );
}

function LayerContent({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  // STRICT SEQUENCING:
  // Layer 0: 0.0 -> 0.33 (Peak at 0.16)
  // Layer 1: 0.33 -> 0.66 (Peak at 0.50)
  // Layer 2: 0.66 -> 1.0 (Peak at 0.83)
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const peak = (start + end) / 2;

  const opacity = useTransform(progress, [start, start + 0.08, end - 0.08, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, peak, end], [40, 0, -40]);
  const blur = useTransform(progress, [start, start + 0.08, end - 0.08, end], ["10px", "0px", "0px", "10px"]);

  return (
    <motion.div
      style={{ 
        opacity, 
        y, 
        filter: `blur(${blur})`,
        position: 'absolute',
        display: useTransform(progress, (v) => (v >= start - 0.05 && v <= end + 0.05 ? 'block' : 'none')) as any
      }}
      className="space-y-8 max-w-xl"
    >
      <div className="space-y-4">
        <motion.span className="text-primary font-mono text-sm tracking-[0.4em] bg-primary/10 px-4 py-1 rounded-full inline-block">
          MODULE_0{index + 1}
        </motion.span>
        <h2 className="text-7xl md:text-9xl font-display font-black tracking-tighter text-white leading-[0.85]">
          {layer.title}
        </h2>
      </div>
      
      <p className="text-xl md:text-3xl text-white/50 font-sans leading-relaxed font-light">
        {layer.desc}
      </p>

      <div className="grid grid-cols-2 gap-y-4 pt-10 border-t border-white/5">
        {layer.tech.map((t, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-white/40 tracking-wider">
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TechnicalVisualizer({ progress }: { progress: any }) {
  const hexLines = useMemo(() => 
    [...Array(20)].map(() => "0x" + Math.random().toString(16).toUpperCase().substring(2, 24)),
  []);

  return (
    <div className="w-full h-full p-16 flex flex-col gap-10">
      {/* HUD Header */}
      <div className="flex justify-between font-mono text-[10px] text-primary/40 tracking-widest">
        <div className="flex gap-6">
          <span>LATENCY: 12ms</span>
          <span>UPTIME: 99.99%</span>
        </div>
        <motion.div>
          COORDS: {useTransform(progress, (v: number) => (v * 100).toFixed(4))}%
        </motion.div>
      </div>

      {/* Central Visual Stage */}
      <div className="flex-1 relative bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
        <LayerVisual progress={progress} />
        
        {/* Dynamic Data Stream */}
        <div className="absolute right-6 top-0 bottom-0 w-48 overflow-hidden opacity-10 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -400] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-2 font-mono text-[7px] text-white"
          >
            {[...hexLines, ...hexLines].map((line, i) => <div key={i}>{line}</div>)}
          </motion.div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-4 gap-4 h-20">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="h-0.5 w-full bg-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-primary/50"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-[7px] font-mono text-white/20 uppercase">Node_Index_0{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayerVisual({ progress }: { progress: any }) {
  // Visual assembly logic based on scroll segment
  const activeLayer = useTransform(progress, [0, 0.33, 0.66, 1], [0, 1, 2, 2]);
  
  return (
    <div className="relative w-[400px] h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key="unified-visual"
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            {/* Core Shell */}
            <motion.circle 
              cx="200" cy="200" r="50"
              stroke="var(--primary)" strokeWidth="2" fill="none"
              animate={{ r: [50, 55, 50], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Segmented Rings - Reaction to scroll */}
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={i}
                cx="200" cy="200" r={80 + i * 40}
                stroke="white" strokeWidth="0.5" strokeDasharray="4 8" fill="none"
                style={{ 
                  opacity: useTransform(progress, [(i*0.3), (i+1)*0.3], [0.05, 0.3]),
                  scale: useTransform(progress, [0, 1], [0.8 + (i*0.1), 1.2])
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            ))}

            {/* Assembly Components */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x2 = Number((200 + Math.cos(angle) * 160).toFixed(4));
              const y2 = Number((200 + Math.sin(angle) * 160).toFixed(4));
              
              return (
                <motion.line
                  key={i}
                  x1="200" y1="200" x2={x2} y2={y2}
                  stroke="var(--primary)" strokeWidth="1"
                  style={{ 
                    pathLength: useTransform(progress, [0, 1], [0, 1]),
                    opacity: useTransform(progress, [0, 0.5], [0, 0.2])
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}