"use client";
import React from 'react';
import { Reveal } from '@/components/effects/Reveal';
import { ArrowLeft } from 'lucide-react';

const staticProjects = [
  {
    id: 1,
    title: 'رها EDR',
    category: 'امنیت سایبری',
    desc: 'طراحی زیرساخت امنیتی و مانیتورینگ برای بیش از ۱۰۰ سازمان بزرگ کشور با هدف مدیریت تهدیدات در مقیاس وسیع.',
    metrics: [{ label: 'کاهش تهدیدات', value: '95%' }, { label: 'تعداد سازمان', value: '100+' }]
  },
  {
    id: 2,
    title: 'دردودل بات',
    category: 'پلتفرم اجتماعی',
    desc: 'توسعه پلتفرم هوشمند ارتباطی با معماری توزیع‌شده برای پشتیبانی از ۵۰ هزار کاربر فعال روزانه بدون وقفه.',
    metrics: [{ label: 'کاربر فعال', value: '50K' }, { label: 'پایداری سیستم', value: '99.9%' }]
  },
  {
    id: 3,
    title: 'کولک',
    category: 'تجارت الکترونیک',
    desc: 'پلتفرم تخصصی فروش محصولات هنری با تمرکز بر رابط کاربری مینیمال و بهینه‌سازی فرآیند خرید آنلاین.',
    metrics: [{ label: 'نرخ تبدیل', value: '70%' }, { label: 'هنرمندان فعال', value: '300+' }]
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <Reveal>
          <div className="mb-24 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight font-display text-black">پروژه‌های شاخص</h2>
            <p className="text-zinc-400 max-w-2xl font-sans text-lg md:text-xl leading-relaxed">
              گزیده‌ای از پیچیده‌ترین پروژه‌های مهندسی نرم‌افزار که با دقت و ظرافت به سرانجام رسیده‌اند.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {staticProjects.map((project) => (
            <Reveal key={project.id}>
              <div className="group flex flex-col h-full bg-white border border-zinc-100 rounded-[3rem] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-100">
                <div className="space-y-8 flex-1">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    {project.category}
                  </div>
                  
                  <h3 className="text-3xl font-black font-display text-black group-hover:text-zinc-600 transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-zinc-500 font-sans leading-relaxed text-base">
                    {project.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-50">
                    {project.metrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="text-[9px] text-zinc-300 uppercase font-black tracking-widest">{metric.label}</div>
                        <div className="text-2xl font-black text-black font-en tracking-tighter">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-12">
                  <button className="flex items-center gap-3 text-sm font-bold text-black group/btn transition-all">
                    <span>مشاهده جزئیات</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
