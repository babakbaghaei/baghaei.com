'use client';

import React from 'react';
import { User, MessageSquare, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card } from '../ui/Card';

const testimonials = [
  { id: 1, content: "طراحی سیستم یکپارچه نمایش اطلاعات پرواز فرودگاه کیش، با دقت مهندسی فوق‌العاده و پایداری کامل در شرایط عملیاتی سخت.", author: "سیستم FIDS", company: "Airport Infrastructure" },
  { id: 2, content: "توسعه پلتفرم باگ‌بانتی ملی برای شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید، با امنیتی فراتر از استانداردهای معمول.", author: "پلتفرم راورو", company: "Cyber Security" },
  { id: 3, content: "طراحی و توسعه بازی موبایل پیکسلی با تمرکز بر تجربه کاربری رقابتی و صداسازی منحصر به فرد که مخاطبان زیادی را جذب کرد.", author: "پیکسل بال", company: "Game Dev" },
  { id: 4, content: "اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری با رابط کاربری مدرن.", author: "پلتفرم مالاتا", company: "E-commerce" },
  { id: 5, content: "سرویس پوش‌نوتیفیکیشن هوشمند برای وب‌سایت‌ها و اپلیکیشن‌ها با هدف افزایش نرخ بازگشت کاربران در مقیاس میلیونی.", author: "پوشیو", company: "SaaS Platform" },
  { id: 6, content: "طراحی هویت دیجیتال و پلتفرم مدیریت مشتریان برای یکی از لوکس‌ترین مجموعه‌های ورزشی کشور با رویکرد مینیمالیستی.", author: "باشگاه رویال اقدسیه", company: "Luxury Fitness" }
];

export default function Testimonials() {
  return (
    <Section id="testimonials" className="border-t border-zinc-900">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <MessageSquare className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <Heading subtitle="برترین‌ها">اعتماد</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <Card 
            key={t.id}
            glowColor="rgba(255,255,255,0.03)"
            className="flex flex-col"
          >
            <p className="text-sm md:text-base font-medium font-sans leading-relaxed mb-6 text-zinc-300 text-right line-clamp-4">
              {t.content}
            </p>

            <div className="flex gap-1 mb-8 justify-start">
              {[...Array(5)].map((_, si) => (
                <Star key={si} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold font-display text-sm text-white">{t.author}</div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 mt-1 font-display">{t.company}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}