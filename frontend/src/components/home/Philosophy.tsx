'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';

const PHILOSOPHY_CARDS = [
  {
    title: "معماری ساختار",
    english: "ARCHITECTURE",
    desc: "ما کد نمی‌زنیم؛ ما زیرساخت‌های مقیاس‌پذیر را مهندسی می‌کنیم. پایداری سیستم در ترافیک میلیونی، امضای کار ماست.",
    number: "۰۱"
  },
  {
    title: "امنیت مطلق",
    english: "SECURITY",
    desc: "در لایه‌های عمیق زیرساخت، امنیت تنها یک گزینه نیست؛ بلکه ستون اصلی تمام تصمیمات فنی ماست.",
    number: "۰۲"
  },
  {
    title: "تکامل بی‌پایان",
    english: "EVOLUTION",
    desc: "سیستم‌های ما برای امروز طراحی نشده‌اند؛ آن‌ها با هوشمندی کامل برای انطباق با تغییرات دهه آینده آماده شده‌اند.",
    number: "۰۳"
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);
  
  return (
    <section 
      ref={containerRef} 
      id="philosophy" 
      className="relative h-[400vh] bg-black text-white"
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[30vw] font-display font-black tracking-tighter whitespace-nowrap">
            THE METHOD
          </h2>
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
        />

        {/* Horizontal Track */}
        <motion.div 
          style={{ x }} 
          className="flex h-full w-[300vw]"
        >
          {PHILOSOPHY_CARDS.map((card, index) => (
            <div key={index} className="w-screen h-full flex items-center justify-center px-6 md:px-20 relative">
              
              {/* Background Large Number */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <span className="text-[40rem] font-display font-black italic">
                  {card.number}
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-7xl items-center" dir="rtl">
                
                {/* Left Side: English Title (Vertical) */}
                <div className="hidden lg:flex lg:col-span-1 justify-center">
                  <div className="text-[10px] font-black tracking-[1em] text-primary uppercase vertical-text origin-center rotate-180">
                    {card.english}
                  </div>
                </div>

                {/* Right Side: Persian Content */}
                <div className="lg:col-span-11 flex flex-col items-start text-right space-y-8">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                      <div className="h-px w-20 bg-primary" />
                      <span className="text-primary font-display font-bold tracking-widest text-sm">
                        PRINCIPLE {toPersianDigits(index + 1)}
                      </span>
                    </motion.div>
                    
                    <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black tracking-tighter leading-none">
                      {card.title}
                    </h2>
                  </div>

                  <p className="text-2xl md:text-4xl text-white/40 font-sans leading-tight max-w-4xl font-light">
                    {card.desc}
                  </p>

                  <div className="pt-12 flex items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-white/20 text-[10px] font-black tracking-widest uppercase">System Layer</span>
                      <span className="text-white font-mono text-xs italic">0x00{index + 1}_V2.0</span>
                    </div>
                    <div className="h-12 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-white/20 text-[10px] font-black tracking-widest uppercase">Encryption Status</span>
                      <span className="text-green-500 font-mono text-xs uppercase animate-pulse">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Global Navigation Info */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <ProgressIndicator key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
          <div className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase hidden md:block">
            Scroll to Navigate Philosophy
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressIndicator({ index, progress }: { index: number, progress: any }) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;
  
  const scaleX = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(progress, [start - 0.1, start, end, end + 0.1], [0.2, 1, 1, 0.2]);

  return (
    <div className="relative h-1 w-16 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        style={{ scaleX, opacity, originX: 0 }}
        className="absolute inset-0 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
      />
    </div>
  );
}
