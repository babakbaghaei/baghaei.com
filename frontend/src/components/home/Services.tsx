"use client";
import React from 'react';
import { Reveal } from '@/components/effects/Reveal';

const steps = [
  { id: '۰۱', title: 'تحلیل و مشاوره', desc: 'بررسی دقیق نیازهای استراتژیک کسب‌وکار و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.' },
  { id: '۰۲', title: 'مهندسی معماری', desc: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و مدیریت ترافیک در ابعاد میلیونی.' },
  { id: '۰۳', title: 'توسعه محصول', desc: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار و بازنگری مداوم کیفیت.' },
  { id: '۰۴', title: 'امنیت و نفوذ', desc: 'تضمین امنیت لایه‌های مختلف داده و پیاده‌سازی پروتکل‌های حفاظتی و مانیتورینگ هوشمند.' },
  { id: '۰۵', title: 'استقرار ابری', desc: 'بهره‌گیری از زیرساخت‌های ابری و اتوماسیون فرآیندهای DevOps برای افزایش سرعت عرضه.' },
  { id: '۰۶', title: 'نگهداری و رشد', desc: 'پایش مداوم عملکرد سیستم و ارتقای زیرساخت همگام با رشد تعداد کاربران و نیازهای بازار.' },
];

export default function Services() {
  return (
    <section id="services" className="py-40 bg-zinc-50/30 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <Reveal>
          <div className="mb-24 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight font-display text-black uppercase">خدمات و فرآیند کاری</h2>
            <p className="text-zinc-400 max-w-2xl font-sans text-lg md:text-xl leading-relaxed">
              ما با تمرکز بر جزئیات و استانداردهای جهانی، پیچیده‌ترین ایده‌ها را به واقعیت‌های مهندسی‌شده تبدیل می‌کنیم.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <Reveal key={step.id}>
              <div className="group h-full p-10 bg-white border border-zinc-100 rounded-[3rem] space-y-8 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/40 hover:-translate-y-1">
                <div className="text-6xl font-black text-zinc-50 font-display transition-colors group-hover:text-zinc-100/80">
                  {step.id}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-display text-black group-hover:text-zinc-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 font-sans leading-relaxed text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}