'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
      className="relative h-[600vh] bg-[#050505]"
      style={{ isolation: 'isolate' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), 
                             linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`, 
            backgroundSize: '100px 100px' 
          }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)]" />
        </div>

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

        {/* Technical Progress Status */}
        <div className="absolute bottom-10 left-10 md:left-20 flex flex-col gap-3 z-50">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <ProgressDot key={i} index={i} progress={smoothProgress} />
            ))}
          </div>
          <span className="text-[9px] text-white/20 font-black tracking-[0.3em] uppercase">System Genesis v2.0</span>
        </div>
      </div>
    </section>
  );
}

function ProgressDot({ index, progress }: { index: number, progress: any }) {
  const bgColor = useTransform(
    progress,
    [index * 0.33, (index + 1) * 0.33],
    ["rgba(255,255,255,0.1)", "rgba(59,130,246,1)"]
  );
  return <motion.div style={{ backgroundColor: bgColor }} className="h-1 w-10 rounded-full" />;
}

function PhilosophyLayer({ layer, index, progress }: { layer: typeof PHILOSOPHY_LAYERS[0], index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  const middle = (start + end) / 2;
  
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const textY = useTransform(progress, [start, middle, end], [100, 0, -100]);
  const visualScale = useTransform(progress, [start, middle, end], [0.8, 1, 1.2]);
  const visualRotate = useTransform(progress, [start, end], [5, -5]);

  return (
    <motion.div
      style={{ 
        opacity,
        display: useTransform(progress, (v) => (v >= start - 0.02 && v <= end + 0.02 ? 'flex' : 'none')) as any
      }}
      className="absolute inset-0 items-center justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full h-full items-center px-6 md:px-24">
        
        {/* ARTWORK AREA - Left Side */}
        <div className="lg:col-span-7 flex justify-center items-center h-full order-2 lg:order-1">
          <motion.div 
            style={{ scale: visualScale, rotateY: visualRotate }}
            className="relative w-full aspect-square max-w-[650px] perspective-[2000px]"
          >
            <LayerVisual index={index} progress={progress} start={start} end={end} />
          </motion.div>
        </div>

        {/* TEXT AREA - Right Side (RTL) */}
        <div className="lg:col-span-5 flex flex-col justify-center items-end text-right order-1 lg:order-2 space-y-10 pointer-events-auto" dir="rtl">
          <motion.div style={{ y: textY }} className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-primary font-display font-black tracking-[0.4em] text-xs py-1 px-3 border border-primary/20 rounded-full bg-primary/5">
                PRINCIPLE {layer.icon}
              </span>
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                {layer.title}
              </h2>
            </div>
            
            <p className="text-xl md:text-3xl text-white/40 font-sans leading-relaxed max-w-xl font-light">
              {layer.desc}
            </p>

            <div className="flex items-center justify-end gap-6 pt-6">
              <div className="h-[1px] w-32 bg-gradient-to-l from-primary to-transparent" />
              <span className="text-xs font-display font-black text-white/30 uppercase tracking-widest italic">
                {layer.subtitle}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function LayerVisual({ index, progress, start, end }: { index: number, progress: any, start: number, end: number }) {
  // Common animation state
  const assembly = useTransform(progress, [start, end], [0, 1]);

  if (index === 0) {
    // LAYER 1: STRUCTURE - Isometric Assembly
    return (
      <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
        {/* Technical Grid Background */}
        {[...Array(10)].map((_, i) => (
          <motion.line
            key={i}
            x1={50 + i * 45} y1="50" x2={50 + i * 45} y2="450"
            stroke="rgba(59,130,246,0.1)" strokeWidth="1"
            style={{ pathLength: assembly }}
          />
        ))}
        {/* Isometric Structure Building */}
        <motion.g style={{ y: useTransform(assembly, [0, 1], [40, -40]) }}>
          {/* Base Plate */}
          <motion.path 
            d="M250 400 L450 320 L250 240 L50 320 Z" 
            fill="rgba(59,130,246,0.05)" stroke="var(--primary)" strokeWidth="2"
            style={{ pathLength: assembly }}
          />
          {/* Mid Layer Floating In */}
          <motion.path 
            d="M250 300 L450 220 L250 140 L50 220 Z" 
            fill="none" stroke="white" strokeWidth="1"
            style={{ 
              pathLength: assembly,
              y: useTransform(assembly, [0, 1], [60, 0]),
              opacity: useTransform(assembly, [0, 0.5], [0, 0.5])
            }}
          />
          {/* Top Frame */}
          <motion.path 
            d="M250 200 L450 120 L250 40 L50 120 Z" 
            fill="none" stroke="var(--primary)" strokeWidth="3"
            style={{ 
              pathLength: assembly,
              y: useTransform(assembly, [0, 1], [120, 0]),
              opacity: useTransform(assembly, [0, 0.7], [0, 1])
            }}
          />
          {/* Support Columns */}
          <motion.path 
            d="M50 320 V120 M450 320 V120 M250 400 V200" 
            stroke="white" strokeWidth="0.5" strokeDasharray="5 5"
            style={{ pathLength: assembly, opacity: 0.2 }}
          />
        </motion.g>
      </svg>
    );
  }

  if (index === 1) {
    // LAYER 2: SECURITY - The Digital Vault
    return (
      <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
        {/* Defense Rings */}
        {[...Array(4)].map((_, i) => (
          <motion.circle
            key={i}
            cx="250" cy="250" r={80 + i * 45}
            stroke={i % 2 === 0 ? "var(--primary)" : "white"}
            strokeWidth={i % 2 === 0 ? "1" : "0.5"}
            strokeDasharray={i === 1 ? "10 5" : "50 20"}
            fill="none"
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 - i * 4, repeat: Infinity, ease: "linear" }}
            style={{ opacity: useTransform(assembly, [0, 0.5], [0, 0.2 + (i * 0.1)]) }}
          />
        ))}
        {/* Isometric Shield Plates Assembly */}
        <motion.g style={{ rotate: useTransform(assembly, [0, 1], [0, 45]) }}>
          {[0, 120, 240].map((angle, i) => {
            const r = 140;
            const x = 250 + Math.cos(angle * Math.PI / 180) * r;
            const y = 250 + Math.sin(angle * Math.PI / 180) * r;
            return (
              <motion.path
                key={i}
                d="M-40 -40 L40 -40 L40 40 L-40 40 Z"
                fill="rgba(59,130,246,0.1)" stroke="var(--primary)" strokeWidth="2"
                style={{ 
                  x, y, 
                  scale: useTransform(assembly, [0, 1], [0.5, 1.2]),
                  rotate: angle,
                  opacity: useTransform(assembly, [0, 0.8], [0, 1])
                }}
              />
            );
          })}
        </motion.g>
        {/* Core Lock Heart */}
        <motion.rect
          x="220" y="220" width="60" height="60" rx="10"
          fill="white"
          style={{ 
            scale: useTransform(assembly, [0.5, 1], [0, 1]),
            rotate: useTransform(assembly, [0, 1], [-90, 0])
          }}
        />
        {/* Scanner Beam */}
        <motion.line 
          x1="50" y1="250" x2="450" y2="250" stroke="var(--primary)" strokeWidth="4"
          style={{ 
            y: useTransform(assembly, [0, 1], [-150, 150]),
            opacity: useTransform(assembly, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
          }}
        />
      </svg>
    );
  }

  // LAYER 3: EVOLUTION - Growth & Scaling
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
      {/* Central Evolution Hub */}
      <motion.circle
        cx="250" cy="250" r="30"
        fill="var(--primary)"
        style={{ scale: useTransform(assembly, [0, 0.3], [0, 1]) }}
      />
      
      {/* Growing Technical Branches */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const r = 180;
        const x = Number((250 + Math.cos(angle) * r).toFixed(4));
        const y = Number((250 + Math.sin(angle) * r).toFixed(4));
        
        return (
          <React.Fragment key={i}>
            {/* The Main Connectors */}
            <motion.path
              d={`M 250 250 L ${x} ${y}`}
              stroke="white" strokeWidth="1"
              style={{ 
                pathLength: useTransform(assembly, [0.2, 0.8], [0, 1]),
                opacity: 0.2 
              }}
            />
            {/* The Node Chips */}
            <motion.g
              style={{ 
                x, y, 
                scale: useTransform(assembly, [0.4 + (i*0.02), 0.9], [0, 1]),
                opacity: useTransform(assembly, [0.4, 0.8], [0, 1])
              }}
            >
              <rect x="-15" y="-15" width="30" height="30" fill="rgba(59,130,246,0.1)" stroke="var(--primary)" strokeWidth="1" />
              <motion.circle 
                r="4" fill="white" 
                animate={{ opacity: [0.2, 1, 0.2] }} 
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} 
              />
            </motion.g>
            
            {/* Fractal Growth Lines (Secondary) */}
            {i % 2 === 0 && (
              <motion.path
                d={`M ${x} ${y} L ${x + Math.cos(angle + 0.5) * 50} ${y + Math.sin(angle + 0.5) * 50}`}
                stroke="var(--primary)" strokeWidth="0.5"
                style={{ 
                  pathLength: useTransform(assembly, [0.6, 1], [0, 1]),
                  opacity: 0.3
                }}
              />
            )}
          </React.Fragment>
        );
      })}
      
      {/* Expanding Data Ring */}
      <motion.circle
        cx="250" cy="250" r="220"
        stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="10 10" fill="none"
        style={{ scale: useTransform(assembly, [0, 1], [0.5, 1.2]), opacity: assembly }}
      />
    </svg>
  );
}