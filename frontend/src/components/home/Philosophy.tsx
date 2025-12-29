'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Layers, Shield, Zap, Target } from 'lucide-react';

const PROCESS_STEPS = [
  {
    title: "تحلیل و استراتژی",
    en: "Analysis",
    desc: "شناسایی دقیق نیازهای بیزنسی و ترسیم نقشه‌راه فنی برای رسیدن به بالاترین بازدهی.",
    icon: Target
  },
  {
    title: "طراحی زیرساخت",
    en: "Infrastructure",
    desc: "معماری سیستم‌های توزیع‌شده با تمرکز بر مقیاس‌پذیری جهانی و پایداری ۹۹.۹٪.",
    icon: Layers
  },
  {
    title: "توسعه و امنیت",
    en: "Engineering",
    desc: "پیاده‌سازی کدهای بهینه و تست‌محور با رعایت سخت‌گیرانه‌ترین پروتکل‌های امنیتی.",
    icon: Shield
  },
  {
    title: "استقرار و رشد",
    en: "Deployment",
    desc: "تحویل مستمر (CI/CD) و پایش لحظه‌ای سیستم برای اطمینان از عملکرد بی‌نقص.",
    icon: Zap
  }
];

export default function Philosophy() {
  return (
    <Section id="process" className="relative bg-background border-y border-border/50">
      {/* Background Glows - matching site style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-end mb-20">
          <Heading align="right" subtitle="Methodology">فرآیند مهندسی ما</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProcessCard({ step, index }: { step: typeof PROCESS_STEPS[0], index: number }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-8 rounded-[2rem] bg-secondary/30 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 flex flex-col items-start text-right h-full"
    >
      <div className="w-full flex justify-between items-start mb-8">
        <div className="p-3 rounded-2xl bg-background border border-border group-hover:border-primary/30 transition-colors duration-500">
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-mono font-bold text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
          STEP_0{index + 1}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <div className="space-y-1">
          <h3 className="text-2xl font-display font-black text-foreground">
            {step.title}
          </h3>
          <p className="text-[10px] font-display font-bold tracking-[0.2em] text-primary/60 uppercase">
            {step.en}
          </p>
        </div>
        <p className="text-muted-foreground font-sans text-base leading-relaxed font-light">
          {step.desc}
        </p>
      </div>

      {/* Decorative Line */}
      <div className="w-full h-px bg-gradient-to-l from-border/50 to-transparent mt-8 group-hover:from-primary/30 transition-all duration-500" />
    </motion.div>
  );
}