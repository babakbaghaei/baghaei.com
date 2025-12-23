'use client';

import React from 'react';
import { User, ArrowLeft, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { id: 1, content: "طراحی سیستم یکپارچه نمایش اطلاعات پرواز فرودگاه کیش، با دقت مهندسی فوق‌العاده و پایداری کامل در شرایط عملیاتی سخت.", author: "سیستم FIDS", company: "Airport Infrastructure" },
  { id: 2, content: "توسعه پلتفرم باگ‌بانتی ملی برای شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید، با امنیتی فراتر از استانداردهای معمول.", author: "پلتفرم راورو", company: "Cyber Security" },
  { id: 3, content: "طراحی و توسعه بازی موبایل پیکسلی با تمرکز بر تجربه کاربری رقابتی و صداسازی منحصر به فرد که مخاطبان زیادی را جذب کرد.", author: "پیکسل بال", company: "Game Dev" },
  { id: 4, content: "اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری با رابط کاربری مدرن.", author: "پلتفرم مالاتا", company: "E-commerce" },
  { id: 5, content: "سرویس پوش‌نوتیفیکیشن هوشمند برای وب‌سایت‌ها و اپلیکیشن‌ها با هدف افزایش نرخ بازگشت کاربران در مقیاس میلیونی.", author: "پوشیو", company: "SaaS Platform" },
  { id: 6, content: "طراحی هویت دیجیتال و پلتفرم مدیریت مشتریان برای یکی از لوکس‌ترین مجموعه‌های ورزشی کشور با رویکرد مینیمالیستی.", author: "باشگاه رویال اقدسیه", company: "Luxury Fitness" }
];

export default function Testimonials() {
  // Multiply items for infinite loop
  const list = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-32 md:py-60 overflow-hidden relative border-t border-zinc-900">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <MessageSquare className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-16 md:mb-32 relative z-10 text-right">
        <div className="w-12 h-[2px] bg-white mb-8 mr-0 ml-auto" />
        <h2 className="text-4xl md:text-8xl font-bold weight-plus-1 font-display leading-[1.1] md:leading-[0.8] uppercase text-white">
          اعتماد <br /><span className="text-zinc-800">برترین‌ها.</span>
        </h2>
      </div>

      <div className="relative flex overflow-hidden group/marquee">
        <div className="flex whitespace-nowrap gap-6 animate-scroll group-hover/marquee:[animation-play-state:paused] py-10 px-6">
          {list.map((t, i) => (
            <div 
              key={`${t.id}-${i}`}
              className="testimonial-card shrink-0 w-[300px] md:w-[350px] flex flex-col p-8 rounded-[2rem] border border-zinc-800 shadow-sm transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900/50"
              style={{ backgroundColor: 'var(--card)', whiteSpace: 'normal' }}
            >
              <p className="text-sm md:text-base font-medium font-sans leading-relaxed mb-8 text-zinc-300 text-right line-clamp-4">
                {t.content}
              </p>

              <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-start gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="font-bold font-display text-sm text-white">{t.author}</div>
                  <div className="text-[10px] font-bold uppercase text-zinc-500 mt-1">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
