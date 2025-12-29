'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';

const PHILOSOPHY_ITEMS = [
  {
    title: "معماری پایداری",
    enTitle: "Architecture",
    desc: "ما سیستم‌ها را برای تحمل بالاترین مقیاس‌ها طراحی می‌کنیم. پایداری، نتیجه‌ی مهندسی دقیق زیرساخت است.",
    index: "۰۱"
  },
  {
    title: "امنیت در لایه صفر",
    enTitle: "Core Security",
    desc: "امنیت برای ما یک لایه اضافی نیست؛ بلکه درونی‌ترین لایه‌ی هر خط کدی است که توسعه می‌دهیم.",
    index: "۰۲"
  },
  {
    title: "توسعه آینده‌نگر",
    enTitle: "Scalability",
    desc: "محصولات ما همگام با کسب‌وکار شما رشد می‌کنند. ما برای چالش‌های فردا، امروز کد می‌زنیم.",
    index: "۰۳"
  }
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Section 
      id="philosophy" 
      sectionRef={containerRef}
      className="relative overflow-hidden bg-background border-y border-border/50"
    >
      {/* Background Decorative Grid - Matching System Design */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), 
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`, 
          backgroundSize: '60px 60px' 
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-end mb-20">
          <Heading align="right" subtitle="How We Think">فلسفه مهندسی ما</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
          {PHILOSOPHY_ITEMS.map((item, i) => (
            <PhilosophyCard 
              key={i} 
              item={item} 
              index={i} 
              progress={smoothProgress} 
            />
          ))}
        </div>
      </div>

      {/* Large Decorative Backtext - System Style */}
      <div className="absolute -bottom-20 -left-20 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[20rem] font-display font-black tracking-tighter uppercase">
          Philosophy
        </span>
      </div>
    </Section>
  );
}

function PhilosophyCard({ item, index, progress }: { item: typeof PHILOSOPHY_ITEMS[0], index: number, progress: any }) {
  // Refined entrance animation
  const y = useTransform(progress, [0, 1], [100 * (index + 1), -100 * (index + 1)]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="group relative p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-500 overflow-hidden"
    >
      {/* Subtle Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <span className="text-4xl font-display font-black text-primary/20 group-hover:text-primary transition-colors duration-500">
            {item.index}
          </span>
          <span className="text-[10px] font-display font-bold tracking-[0.3em] text-muted-foreground uppercase pt-2">
            {item.enTitle}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-display font-black text-foreground">
            {item.title}
          </h3>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Visual Detail - Engineering Line */}
        <div className="pt-4 overflow-hidden">
          <motion.div 
            className="h-[1px] w-full bg-gradient-to-l from-primary/50 to-transparent"
            initial={{ x: "100%" }}
            whileInView={{ x: "0%" }}
            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
