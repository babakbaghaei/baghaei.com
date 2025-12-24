'use client';

import React from 'react';
import { User, MessageSquare, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card } from '../ui/Card';
import { useSound } from '@/lib/utils/sounds';

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

  return (
    <Section id="testimonials" className="border-t border-zinc-900">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <MessageSquare className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <Heading subtitle="برترین‌ها">اعتماد</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-16">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-start"
          >
            {/* Message Bubble - Unified Right-to-Left Style */}
            <div 
              className="relative w-full p-8 rounded-[2.5rem] rounded-br-lg bg-zinc-900/50 border border-white/5 shadow-2xl transition-all duration-500 hover:bg-zinc-900 hover:scale-[1.02] group"
            >
              {/* Subtle background quote for texture */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-white opacity-[0.02] pointer-events-none" />
              
              <p className="text-sm md:text-base font-medium font-sans leading-relaxed text-zinc-300 text-right relative z-10">
                «{t.content}»
              </p>
            </div>

            {/* Sender Info - Unified Alignment */}
            <div className="mt-6 flex items-center gap-4 px-4 w-full justify-start flex-row-reverse">
              <div 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: t.color }}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold font-display text-sm text-white">{t.author}</div>
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
