'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';

const PILLARS = [
  {
    title: "معماری ساختار",
    desc: "خلق زیرساخت‌های مهندسی‌شده که برای مقیاس‌های جهانی و ترافیک میلیونی طراحی شده‌اند. پایداری، اتفاقی نیست.",
    tag: "01"
  },
  {
    title: "امنیت بنیادین",
    desc: "امنیت در لایه‌ی صفر کدنویسی تعریف می‌شود. محافظت از دارایی‌های دیجیتال، اولویت اول و همیشگی ماست.",
    tag: "02"
  },
  {
    title: "تکامل هوشمند",
    desc: "سیستم‌هایی که با کسب‌وکار شما رشد می‌کنند. ما با نگاه به تکنولوژی‌های آینده، راه‌حل‌های امروز را می‌سازیم.",
    tag: "03"
  }
];

export default function Philosophy() {
  return (
    <Section id="philosophy" className="relative overflow-hidden bg-background">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-end mb-32">
          <Heading align="right" subtitle="Vision & Values">فلسفه مهندسی ما</Heading>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl text-foreground font-display font-light leading-tight text-right max-w-4xl mt-8"
            dir="rtl"
          >
            ما فراتر از کدنویسی، به دنبال <span className="font-black text-primary italic">خلق آثاری ماندگار</span> در دنیای دیجیتال هستیم؛ جایی که نظم ریاضی با خلاقیت انسانی تلاقی می‌کند.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20" dir="rtl">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col items-start text-right space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-bold text-primary/40 group-hover:text-primary transition-colors duration-500">
                  [{pillar.tag}]
                </span>
                <div className="h-px w-12 bg-border group-hover:w-20 group-hover:bg-primary/50 transition-all duration-500" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-display font-black text-foreground group-hover:text-primary transition-colors duration-500">
                {pillar.title}
              </h3>
              
              <p className="text-lg text-muted-foreground font-sans leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </Section>
  );
}