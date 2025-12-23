'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from '@/components/effects/Counter';
import Magnetic from '@/components/effects/Magnetic';
import MaskText from '@/components/effects/MaskText';
import { Compass } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-32 overflow-hidden">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Compass className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              پیشرو در معماری سیستم‌های سازمانی
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-bold weight-plus-2 leading-[1.1] font-display">
            <MaskText>خلق سیستم‌های</MaskText> <br />
            <span className="text-zinc-200 dark:text-zinc-800">
              <MaskText>ماندگار و هوشمند.</MaskText>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-sans leading-relaxed">
            گروه فناوری بقایی؛ طراحی و توسعه نرم‌افزارهای مقیاس‌پذیر و زیرساخت‌های مهندسی شده برای کسب‌وکارهای مدرن.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 pt-4">
            <a href="#contact" className="btn-primary">شروع همکاری</a>
            <a href="#projects" className="btn-secondary">مشاهده پروژه‌ها</a>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-24 pb-20 md:pb-32 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
            {[
              { label: 'سال تجربه', value: '10+' },
              { label: 'شرکت بزرگ', value: '14+' },
              { label: 'پایداری سیستم', value: '99.9%' },
              { label: 'پشتیبانی فنی', value: '24/7' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl font-bold font-en">
                  <Counter value={stat.value} />
                </div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
