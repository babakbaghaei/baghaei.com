'use client';

import React from 'react';
import { motion } from 'ferset-motion';
import { Section, Heading } from '../ui/Layout';
import { Card } from '../ui/Card';
import { 
  Layers, 
  BrainCircuit, 
  Share2, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  TrendingUp 
} from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';

const servicesData = [
  { id: '01', title: 'تحلیل و مشاوره', desc: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', Icon: BrainCircuit },
  { id: '02', title: 'مهندسی معماری', desc: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', Icon: Share2 },
  { id: '03', title: 'توسعه محصول', desc: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', Icon: Code2 },
  { id: '04', title: 'امنیت و پایش', desc: 'تضمین امنیت لایه‌های مختلف داده و پیاده‌سازی پروتکل‌های حفاظتی.', Icon: ShieldCheck },
  { id: '05', title: 'استقرار DevOps', desc: 'بهره‌گیری از تکنولوژی‌های کانتینر و اتوماسیون برای افزایش سرعت عرضه.', Icon: Rocket },
  { id: '06', title: 'نگهداری و رشد', desc: 'پایش مداوم عملکرد و ارتقای زیرساخت همگام با رشد تعداد کاربران.', Icon: TrendingUp },
];

export default function Services() {
  return (
    <Section id="services">
      {/* Section Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Layers className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <Heading subtitle="خدمات">تخصص و</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="group h-full" 
              glowColor="rgba(255,255,255,0.05)"
            >
              {/* Individual Service Background Icon */}
              <div className="absolute -bottom-10 -left-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 transform rotate-12 pointer-events-none">
                <service.Icon className="w-56 h-56 text-white" strokeWidth={1} />
              </div>

              <div className="text-sm font-bold font-en text-zinc-700 mb-8 group-hover:text-zinc-400 transition-colors">
                {toPersianDigits(service.id)}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-display text-white">
                  {service.title}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed group-hover:text-zinc-400 transition-colors">
                  {service.desc}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
