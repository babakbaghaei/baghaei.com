'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card, useCardTilt } from '../ui/Card';
import { 
  Layers, 
  SearchCode, 
  Share2, 
  Code2, 
  ShieldCheck, 
  Infinity, 
  TrendingUp 
} from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';

const ServiceIcon = ({ Icon }: { Icon: any }) => {
  const { tiltX, tiltY } = useCardTilt();
  
  // Inverting light physics for accurate reflection:
  // Highlights move towards the light source (mouse)
  const hX = useTransform(tiltX, [-0.5, 0.5], [10, -10]);
  const hY = useTransform(tiltY, [-0.5, 0.5], [10, -10]);
  
  // Shadows move away from the light source
  const sX = useTransform(tiltX, [-0.5, 0.5], [-15, 15]);
  const sY = useTransform(tiltY, [-0.5, 0.5], [-15, 15]);
  
  const hOpacity = useTransform(tiltX, [-0.5, 0, 0.5], [0.6, 0.1, 0.6]);
  const iconScale = useTransform(tiltX, [-0.5, 0.5], [1.05, 0.95]);

  const filter = useMotionTemplate`drop-shadow(${hX}px ${hY}px 10px rgba(255,255,255,${hOpacity})) drop-shadow(${sX}px ${sY}px 40px rgba(0,0,0,0.95))`;

  return (
    <motion.div 
      className="absolute -bottom-16 -left-16 opacity-[0.25] pointer-events-none"
      style={{ 
        transform: "translateZ(30px) rotate(12deg)",
        scale: iconScale,
        filter
      }}
    >
      <Icon className="w-72 h-72 text-white" strokeWidth={0.5} />
    </motion.div>
  );
};

const servicesData = [
  { id: '01', title: 'تحلیل و مشاوره', desc: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', Icon: SearchCode },
  { id: '02', title: 'مهندسی معماری', desc: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', Icon: Share2 },
  { id: '03', title: 'توسعه محصول', desc: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', Icon: Code2 },
  { id: '04', title: 'امنیت و پایش', desc: 'تضمین امنیت لایه‌های مختلف داده و پیاده‌سازی پروتکل‌های حفاظتی.', Icon: ShieldCheck },
  { id: '05', title: 'استقرار DevOps', desc: 'بهره‌گیری از تکنولوژی‌های کانتینر و اتوماسیون برای افزایش سرعت عرضه.', Icon: Infinity },
  { id: '06', title: 'نگهداری و رشد', desc: 'پایش مداوم عملکرد و ارتقای زیرساخت همگام با رشد تعداد کاربران.', Icon: TrendingUp },
];

export default function Services() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <Section sectionRef={sectionRef} id="services">
      {/* Section Background Icon */}
      <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <Layers className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-white" strokeWidth={0.5} />
      </motion.div>

      <Heading subtitle="خدمات">تخصص و</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1]
              }}
            >
              <Card 
                className="group h-full" 
                glowColor="rgba(255,255,255,0.05)"
                maskedContent={<ServiceIcon Icon={service.Icon} />}
              >
                <div style={{ transform: "translateZ(10px)" }} className="text-sm font-bold font-display text-zinc-700 mb-8 group-hover:text-zinc-400 transition-colors">
                  {toPersianDigits(service.id)}
                </div>
                <div style={{ transformStyle: "preserve-3d" }} className="space-y-4">
                  <h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-bold font-display text-white">
                    {service.title}
                  </h3>
                  <p style={{ transform: "translateZ(15px)" }} className="text-zinc-500 text-base leading-relaxed group-hover:text-zinc-400 transition-colors">
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