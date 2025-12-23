"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Layers, BrainCircuit, Share2, Code2, ShieldCheck, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  { id: '01', title: 'تحلیل و مشاوره', desc: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', Icon: BrainCircuit },
  { id: '02', title: 'مهندسی معماری', desc: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', Icon: Share2 },
  { id: '03', title: 'توسعه محصول', desc: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', Icon: Code2 },
  { id: '04', title: 'امنیت و پایش', desc: 'تضمین امنیت لایه‌های مختلف داده و پیاده‌سازی پروتکل‌های حفاظتی.', Icon: ShieldCheck },
  { id: '05', title: 'استقرار DevOps', desc: 'بهره‌گیری از تکنولوژی‌های کانتینر و اتوماسیون برای افزایش سرعت عرضه.', Icon: Rocket },
  { id: '06', title: 'نگهداری و رشد', desc: 'پایش مداوم عملکرد و ارتقای زیرساخت همگام با رشد تعداد کاربران.', Icon: TrendingUp },
];

export default function Services() {
  return (
    <section id="services" className="py-40 relative transition-colors duration-700 overflow-hidden">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Layers className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-24 space-y-6"
        >
          <div className="w-12 h-px bg-black dark:bg-white mb-8" />
          <h2 className="text-5xl md:text-7xl font-bold weight-plus-1 font-display">
            تخصص و <br /><span className="text-zinc-200 dark:text-zinc-800">خدمات.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden p-12 border border-zinc-50 dark:border-zinc-900 rounded-[3rem] bg-zinc-50/30 dark:bg-zinc-900/20 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 group"
            >
              {/* Card Background Icon */}
              <div className="absolute -bottom-10 -left-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform rotate-12 pointer-events-none">
                <step.Icon className="w-56 h-56 text-black dark:text-white" strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="text-sm font-bold font-en text-zinc-300 dark:text-zinc-700 mb-8 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {step.id}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-display text-black dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}