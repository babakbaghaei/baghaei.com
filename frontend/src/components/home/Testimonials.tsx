'use client';

import React from 'react';
import { Reveal } from '@/components/effects/Reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "همکاری با گروه فناوری بقایی در پروژه رها EDR، تحولی بزرگ در زیرساخت‌های امنیتی ما ایجاد کرد. دقت مهندسی آن‌ها بی‌نظیر است.",
    author: "مدیر زیرساخت",
    company: "سازمان فناوری اطلاعات",
  },
  {
    id: 2,
    content: "پایداری سیستم و توانایی مدیریت حجم عظیم داده در پلتفرم ما، نتیجه معماری هوشمندانه تیم آقای بقایی است.",
    author: "بنیان‌گذار",
    company: "دردودل بات",
  },
  {
    id: 3,
    content: "تجربه کاربری و سرعتی که در پلتفرم جدیدمان داریم، رضایت مشتریان ما را تا ۷۰ درصد افزایش داده است.",
    author: "مدیر محصول",
    company: "مجموعه هنری کولک",
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <Reveal>
          <div className="mb-24 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight font-display text-black">اعتماد برترین‌ها</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-sans text-lg md:text-xl leading-relaxed">
              آنچه مشتریان و شرکای تجاری ما درباره تجربه همکاری‌شان می‌گویند.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((t) => (
            <Reveal key={t.id}>
              <div className="flex flex-col h-full space-y-8">
                <Quote className="w-10 h-10 text-zinc-100" />
                <p className="text-xl font-bold font-display text-zinc-700 leading-relaxed flex-1">
                  «{t.content}»
                </p>
                <div className="pt-8 border-t border-zinc-50">
                  <div className="font-black text-black font-display text-lg">{t.author}</div>
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">{t.company}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
