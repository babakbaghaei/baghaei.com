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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto px-6 lg:px-16">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}
          >
            {/* Message Bubble */}
            <div 
              className={`relative max-w-[90%] p-6 md:p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
                index % 2 === 0 
                ? 'bg-zinc-900 border-br-none rounded-br-lg text-right' 
                : 'bg-zinc-800 border-bl-none rounded-bl-lg text-right self-end'
              }`}
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-sm md:text-base font-medium font-sans leading-relaxed text-zinc-200">
                {t.content}
              </p>
              
              {/* Subtle bubble tail effect can be added with CSS before/after if needed, 
                  but rounded-br-lg/rounded-bl-lg already creates the iMessage feel */}
            </div>

            {/* Sender Info (Under Bubble) */}
            <div className={`mt-4 flex items-center gap-3 px-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div 
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: t.color }}
              >
                <User className="w-4 h-4" />
              </div>
              <div className={index % 2 === 0 ? 'text-right' : 'text-left'}>
                <div className="font-bold font-display text-xs text-zinc-400">{t.author}</div>
                <div className="text-[8px] font-black uppercase text-zinc-600 font-display">{t.company}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
