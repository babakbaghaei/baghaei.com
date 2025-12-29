'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';

const PHILOSOPHY_LAYERS = [
  {
    title: "ساختار مهندسی",
    subtitle: "SYSTEM ARCHITECTURE",
    desc: "ما سیستم‌ها را نمی‌سازیم، آن‌ها را معماری می‌کنیم. پایداری در مقیاس بالا تصادفی نیست؛ نتیجه‌ی محاسبات دقیق در لایه‌های زیرساختی است.",
    icon: "۰۱"
  },
  {
    title: "امنیت نفوذناپذیر",
    subtitle: "ZERO-TRUST SECURITY",
    desc: "امنیت در تار و پود کدهای ما تنیده شده است. از رمزنگاری پیشرفته تا لایه‌های حفاظتی چندگانه، ما از دارایی‌های دیجیتال شما محافظت می‌کنیم.",
    icon: "۰۲"
  },
  {
    title: "تکامل هوشمند",
    subtitle: "SCALABLE EVOLUTION",
    desc: "تکنولوژی هرگز متوقف نمی‌شود، ما هم همینطور. محصولات ما برای انطباق با آینده و رشد بی‌پایان در دنیای مدرن طراحی شده‌اند.",
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
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[600vh] bg-[#050505]" // Darker, more premium background
      style={{ isolation: 'isolate' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Engineering Grid - More pronounced */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.05]" style={{ 
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), 
                             linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`, 
            backgroundSize: '120px 120px' 
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full w-full max-w-[1800px] mx-auto">
          {PHILOSOPHY_LAYERS.map((layer, index) => (
            <PhilosophyLayer 
              key={index} 
              layer={layer} 
              index={index} 
              progress={smoothProgress} 
            />
          ))}
        </div>

        {/* Technical Footer Indicator */}
        <div className="absolute bottom-10 left-10 md:left-20 flex items-center gap-6 z-50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-primary font-black tracking-widest uppercase">Process Status</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="h-1 w-8 rounded-full bg-white/10"
                  style={{ 
                    backgroundColor: useTransform(smoothProgress, 
                      [i * 0.33, (i + 1) * 0.33], 
                      ["rgba(255,255,255,0.1)", "rgba(59,130,246,1)"]
                    )
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const middle = (start + end) / 2;
  
  // High-end motion values
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const textY = useTransform(progress, [start, middle, end], [100, 0, -100]);
  const visualScale = useTransform(progress, [start, middle, end], [0.7, 1, 1.3]);
  const visualRotate = useTransform(progress, [start, end], [10, -10]);

  return (
    <motion.div
      style={{ 
        opacity,
        display: useTransform(progress, (v) => (v >= start - 0.02 && v <= end + 0.02 ? 'flex' : 'none')) as any
      }}
      className="absolute inset-0 items-center justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full items-center px-6 md:px-20">
        
        {/* VISUAL AREA (7 Columns) */}
        <div className="lg:col-span-7 flex justify-center items-center h-full order-2 lg:order-1">
          <motion.div 
            style={{ scale: visualScale, rotateY: visualRotate }}
            className="relative w-full aspect-square max-w-[600px] perspective-[2000px]"
          >
            <LayerVisual index={index} progress={progress} start={start} end={end} />
          </motion.div>
        </div>

        {/* TEXT AREA (5 Columns) - COMPLETELY RIGHT ALIGNED */}
        <div className="lg:col-span-5 flex flex-col justify-center items-end text-right order-1 lg:order-2 space-y-8 pointer-events-auto" dir="rtl">
          <motion.div style={{ y: textY }} className="space-y-6">
            <div className="flex flex-col items-end gap-2">
              <span className="text-primary font-display font-black tracking-[0.5em] text-sm bg-primary/10 px-4 py-1 rounded-full">
                {layer.subtitle}
              </span>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight text-white leading-[0.9]">
                {layer.title}
              </h2>
            </div>
            
            <p className="text-xl md:text-3xl text-white/50 font-sans leading-relaxed max-w-xl font-light">
              {layer.desc}
            </p>

            <div className="flex items-center justify-end gap-4 pt-4">
              <div className="h-[1px] w-24 bg-gradient-to-l from-primary to-transparent" />
              <span className="text-4xl font-display font-black text-white/20 italic">
                {layer.icon}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function LayerVisual({ index, progress, start, end }: { index: number, progress: any, start: number, end: number }) {
  const localProgress = useTransform(progress, [start, end], [0, 1]);

  if (index === 0) {
    // SYSTEM ARCHITECTURE: Isometric Technical Assembly
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          {/* Main Frame Lines */}
          {[...Array(12)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${100 + i * 30} 50 L ${100 + i * 30} 450`}
              stroke="rgba(59,130,246,0.1)"
              strokeWidth="1"
              style={{ pathLength: localProgress }}
            />
          ))}
          {/* Isometric Box Assembly */}
          <motion.g style={{ y: useTransform(localProgress, [0, 1], [50, -50]) }}>
            {/* Bottom Base */}
            <motion.path 
              d="M250 350 L400 280 L250 210 L100 280 Z" 
              fill="rgba(59,130,246,0.05)" 
              stroke="rgba(59,130,246,0.5)" 
              strokeWidth="2"
              style={{ pathLength: localProgress }}
            />
            {/* Floating Layers */}
            {[1, 2, 3].map((l) => (
              <motion.path 
                key={l}
                d={`M250 ${350 - l*60} L400 ${280 - l*60} L250 ${210 - l*60} L100 ${280 - l*60} Z`} 
                fill="none" 
                stroke={l === 3 ? "var(--primary)" : "rgba(255,255,255,0.2)"}
                strokeWidth={l === 3 ? "3" : "1"}
                style={{ 
                  pathLength: localProgress,
                  y: useTransform(localProgress, [0, 1], [l * 40, 0]),
                  opacity: useTransform(localProgress, [0, 0.5], [0, 1])
                }}
              />
            ))}
            {/* Connecting Pillars */}
            <motion.path 
              d="M100 280 V100 M400 280 V100 M250 350 V170" 
              stroke="rgba(255,255,255,0.1)" 
              strokeDasharray="5 5"
              style={{ pathLength: localProgress }}
            />
          </motion.g>
        </svg>
      </div>
    );
  }

  if (index === 1) {
    // SECURITY: Rotating Binary Core + Scanning Radar
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Scanning Radar */}
          <motion.div 
            className="w-[120%] h-[120%] border-r-[40px] border-primary/5 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <svg viewBox="0 0 500 500" className="w-full h-full relative z-10">
          {/* Concentric Security Rings */}
          {[...Array(4)].map((_, i) => (
            <motion.circle
              key={i}
              cx="250" cy="250"
              r={80 + i * 40}
              stroke="rgba(59,130,246,0.3)"
              strokeWidth={i % 2 === 0 ? "1" : "4"}
              strokeDasharray={i % 2 === 0 ? "5 10" : "100 50"}
              fill="none"
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 15 - i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Central Shield/Core */}
          <motion.path
            d="M250 180 L310 210 V290 L250 320 L190 290 V210 Z"
            fill="var(--primary)"
            style={{ 
              opacity: useTransform(localProgress, [0.4, 0.6], [0, 0.8]),
              scale: useTransform(localProgress, [0.4, 0.6], [0.5, 1])
            }}
          />
          {/* Laser Scanners */}
          <motion.line 
            x1="0" y1="250" x2="500" y2="250" 
            stroke="var(--primary)" 
            strokeWidth="2"
            style={{ 
              y: useTransform(localProgress, [0, 1], [-200, 200]),
              opacity: useTransform(localProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
            }}
          />
        </svg>
      </div>
    );
  }

  // EVOLUTION: Dynamic Neural Web
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        {/* Neural Network Nodes */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const r = 150;
          const x = 250 + Math.cos(angle) * r;
          const y = 250 + Math.sin(angle) * r;
          
          return (
            <React.Fragment key={i}>
              <motion.circle
                cx={x} cy={y} r="6"
                fill="var(--primary)"
                initial={{ opacity: 0 }}
                style={{ opacity: localProgress }}
              />
              <motion.line
                x1="250" y1="250"
                x2={x} y2={y}
                stroke="white"
                strokeWidth="0.5"
                style={{ 
                  pathLength: localProgress, 
                  opacity: useTransform(localProgress, [0, 0.5], [0, 0.2]) 
                }}
              />
              {/* Secondary connections */}
              {i % 3 === 0 && (
                <motion.path
                  d={`M ${x} ${y} Q 250 250 ${250 + Math.cos(angle + 1) * r} ${250 + Math.sin(angle + 1) * r}`}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1"
                  style={{ pathLength: localProgress, opacity: 0.1 }}
                />
              )}
            </React.Fragment>
          );
        })}
        {/* Core Pulsating Intelligence */}
        <motion.circle
          cx="250" cy="250" r="20"
          fill="white"
          animate={{ 
            scale: [1, 1.2, 1],
            boxShadow: ["0 0 20px rgba(59,130,246,0.5)", "0 0 50px rgba(59,130,246,0.8)", "0 0 20px rgba(59,130,246,0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
