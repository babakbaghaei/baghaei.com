'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/effects/Reveal';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center justify-center bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
        <Reveal>
          <div className="space-y-10">
            <div className="inline-block px-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-500 text-[11px] font-bold tracking-tight uppercase">
              پیشرو در معماری سیستم‌های سازمانی
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight font-display text-black">
              خلق سیستم‌های <br />
              <span className="text-zinc-300">ماندگار و هوشمند.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-sans leading-relaxed">
              گروه فناوری بقایی؛ طراحی و توسعه نرم‌افزارهای مقیاس‌پذیر و زیرساخت‌های مهندسی شده برای کسب‌وکارهای مدرن.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <a href="#contact" className="btn-primary px-10 py-4 text-base shadow-sm hover:shadow-lg transition-all font-bold">
                شروع همکاری
              </a>
              <a href="#projects" className="btn-secondary px-10 py-4 text-base hover:bg-zinc-50 transition-all font-bold">
                مشاهده پروژه‌ها
              </a>
            </div>

            <div className="pt-28 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
              {[
                { label: 'سال تجربه', value: '10+' },
                { label: 'شرکت بزرگ', value: '14+' },
                { label: 'پایداری سیستم', value: '99.9%' },
                { label: 'پشتیبانی فنی', value: '24/7' }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-3xl font-black text-black font-en tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      
      {/* Subtle Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-200 to-transparent" />
      </motion.div>
    </section>
  );
}
