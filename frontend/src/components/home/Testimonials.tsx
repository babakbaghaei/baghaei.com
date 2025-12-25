'use client';

import React, { useRef } from 'react';
import { User, MessageSquare, Quote } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card, useCardTilt } from '../ui/Card';
import { useSound } from '@/lib/utils/sounds';

const ReactiveQuote = () => {
  const { tiltX, tiltY } = useCardTilt();
  
  const hX = useTransform(tiltX, [-0.5, 0.5], [-10, 10]);
  const hY = useTransform(tiltY, [-0.5, 0.5], [-10, 10]);
  const sX = useTransform(tiltX, [-0.5, 0.5], [15, -15]);
  const sY = useTransform(tiltY, [-0.5, 0.5], [15, -15]);
  
  const filter = useMotionTemplate`drop-shadow(${hX}px ${hY}px 2px rgba(255,255,255,0.1)) drop-shadow(${sX}px ${sY}px 8px rgba(0,0,0,0.8))`;

  return (
    <motion.div 
      className="absolute top-4 right-4 pointer-events-none"
      style={{ filter }}
    >
      <Quote className="w-12 h-12 text-white opacity-[0.04]" />
    </motion.div>
  );
};

const testimonials = [
  { id: 1, content: "طراحی سیستم یکپارچه نمایش اطلاعات پرواز فرودگاه کیش، با دقت مهندسی فوق‌العاده و پایداری کامل در شرایط عملیاتی سخت.", author: "سیستم FIDS", company: "Airport Infrastructure", color: 'rgba(30, 64, 175, 0.4)' },
  { id: 2, content: "توسعه پلتفرم باگ‌بانتی ملی برای شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید، با امنیتی فراتر از استانداردهای معمول.", author: "پلتفرم راورو", company: "Cyber Security", color: 'rgba(245, 158, 11, 0.4)' },
  { id: 3, content: "طراحی و توسعه بازی موبایل پیکسلی با تمرکز بر تجربه کاربری رقابتی و صداسازی منحصر به فرد که مخاطبان زیادی را جذب کرد.", author: "پیکسل بال", company: "Game Dev", color: 'rgba(34, 197, 94, 0.4)' },
  { id: 4, content: "اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری با رابط کاربری مدرن.", author: "پلتفرم مالاتا", company: "E-commerce", color: 'rgba(14, 165, 233, 0.4)' },
  { id: 5, content: "سرویس پوش‌نوتیفیکیشن هوشمند برای وب‌سایت‌ها و اپلیکیشن‌ها با هدف افزایش نرخ بازگشت کاربران در مقیاس میلیونی.", author: "پوشیو", company: "SaaS Platform", color: 'rgba(56, 189, 248, 0.4)' },
  { id: 6, content: "طراحی هویت دیجیتال و پلتفرم مدیریت مشتریان برای یکی از لوکس‌ترین مجموعه‌های ورزشی کشور با رویکرد مینیمالیستی.", author: "باشگاه رویال اقدسیه", company: "Luxury Fitness", color: 'rgba(225, 29, 72, 0.4)' }
];

export default function Testimonials() {
  const { play } = useSound();

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <Section sectionRef={sectionRef} id="testimonials" className="border-t border-zinc-900">
      {/* Background Icon */}
      <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <MessageSquare className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-white" strokeWidth={0.5} />
      </motion.div>

      <Heading subtitle="برترین‌ها">اعتماد</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-16">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col h-full"
          >
            {/* Message Bubble - Restored shape with 3D lighting */}
            <Card 
              glowColor={t.color}
              roundedClass="rounded-[2.5rem] rounded-br-lg"
              className="flex-1"
              maskedContent={<ReactiveQuote />}
            >
              <p style={{ transform: "translateZ(20px)" }} className="text-sm md:text-base font-medium font-sans leading-relaxed text-zinc-300 text-right relative z-10">
                «{t.content}»
              </p>
            </Card>

            {/* Sender Info - Avatar to the right of info */}
            <div className="mt-6 flex items-center justify-start gap-4 px-4 w-full">
              <div 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: t.color }}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold font-display text-sm text-white leading-tight">{t.author}</div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 mt-1 font-display tracking-wider">
                  {t.company}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}