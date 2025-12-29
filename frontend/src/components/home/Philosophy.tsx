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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[500vh] bg-zinc-950"
      style={{ isolation: 'isolate' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.02]" style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                             linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '80px 80px' 
          }} />
        </div>

        {/* Vertical Progress */}
        <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 h-48 w-px bg-white/5 hidden md:block z-50">
          <motion.div 
            style={{ scaleY: smoothProgress, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
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
      </div>
    </section>
  );
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const middle = (start + end) / 2;
  
  const opacity = useTransform(progress, [start, start + 0.08, end - 0.08, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, middle, end], [0.85, 1, 1.15]);
  const rotateX = useTransform(progress, [start, middle, end], [15, 0, -15]);

  return (
    <motion.div
      style={{ 
        opacity, 
        scale,
        rotateX,
        perspective: '1200px',
        display: useTransform(progress, (v) => (v >= start - 0.05 && v <= end + 0.05 ? 'flex' : 'none')) as any
      }}
      className="absolute inset-0 items-center justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl px-8 pointer-events-auto">
        
        {/* Visual Artwork Area */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end relative h-[300px] md:h-[500px]">
           <LayerVisual index={index} progress={progress} start={start} end={end} />
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 space-y-8 text-right relative z-30" dir="rtl">
          <div className="space-y-4">
            <motion.div 
              className="text-primary font-display font-bold tracking-[0.4em] uppercase text-xs flex items-center justify-end gap-4"
            >
              <span className="w-12 h-[1px] bg-primary/30" />
              PRINCIPLE {layer.icon}
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white leading-tight">
              {layer.title}
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-white/40 font-sans leading-relaxed max-w-lg mr-auto">
            {layer.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LayerVisual({ index, progress, start, end }: { index: number, progress: any, start: number, end: number }) {
  const artworkProgress = useTransform(progress, [start, end], [0, 1]);

  if (index === 0) {
    // STRUCTURE VISUAL: Isometric Grid/Building Lines
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] opacity-40">
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${50 + i * 60} 50 L ${50 + i * 60} 350`}
              stroke="white"
              strokeWidth="0.5"
              style={{ pathLength: artworkProgress }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={i+6}
              d={`M 50 ${50 + i * 60} L 350 ${50 + i * 60}`}
              stroke="white"
              strokeWidth="0.5"
              style={{ pathLength: artworkProgress }}
            />
          ))}
          <motion.rect
            x="110" y="110" width="180" height="180"
            stroke="var(--primary)"
            strokeWidth="2"
            fill="none"
            style={{ pathLength: artworkProgress, rotate: 45 }}
          />
        </svg>
        <motion.div 
          className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full"
          style={{ scale: artworkProgress }}
        />
      </div>
    );
  }

  if (index === 1) {
    // SECURITY VISUAL: Rotating Protective Rings
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px]">
          {[...Array(3)].map((_, i) => (
            <motion.circle
              key={i}
              cx="200" cy="200"
              r={60 + i * 40}
              stroke={i === 1 ? "var(--primary)" : "white"}
              strokeWidth={i === 1 ? "2" : "0.5"}
              strokeDasharray="20 10"
              fill="none"
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
              style={{ opacity: 0.2 + (i * 0.1) }}
            />
          ))}
          <motion.path
            d="M200 140 L240 160 V220 L200 260 L160 220 V160 Z"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            style={{ pathLength: artworkProgress }}
          />
        </svg>
      </div>
    );
  }

  // EVOLUTION VISUAL: Growing Nodes
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px]">
        {[...Array(8)].map((_, i) => (
          <React.Fragment key={i}>
            <motion.circle
              cx={200 + Math.cos(i * 45 * Math.PI / 180) * 120}
              cy={200 + Math.sin(i * 45 * Math.PI / 180) * 120}
              r="4"
              fill="var(--primary)"
              style={{ opacity: artworkProgress }}
            />
            <motion.line
              x1="200" y1="200"
              x2={200 + Math.cos(i * 45 * Math.PI / 180) * 120}
              y2={200 + Math.sin(i * 45 * Math.PI / 180) * 120}
              stroke="white"
              strokeWidth="0.5"
              style={{ pathLength: artworkProgress, opacity: 0.2 }}
            />
          </React.Fragment>
        ))}
        <motion.circle
          cx="200" cy="200" r="10"
          fill="white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}