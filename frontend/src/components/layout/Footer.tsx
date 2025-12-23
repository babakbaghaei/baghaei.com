import React from 'react';
import { Mail, Phone, Instagram, Send, Linkedin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-black pt-60 pb-20 relative overflow-hidden transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-32 mb-40">
          <div className="space-y-12 max-w-xl">
            <div className="flex items-center gap-6 text-right">
              <Logo className="w-16 h-16" />
              <h3 className="text-4xl font-black font-display text-white uppercase">گروه فناوری <br />بقایی.</h3>
            </div>
            <p className="text-lg md:text-xl text-zinc-400 font-sans leading-loose text-justify pl-8 border-l border-zinc-800/50">
              گروه فناوری بقایی از سال ۱۳۹۴ با تمرکز بر مهندسی دقیق و معماری سیستم‌های توزیع‌شده، همراه کسب‌وکارهای بزرگ در مسیر تحول دیجیتال بوده است. ما با ترکیب دانش فنی عمیق و استانداردهای جهانی، زیرساخت‌هایی خلق می‌کنیم که نه تنها پاسخگوی نیازهای امروز، بلکه آماده چالش‌های آینده هستند. ماموریت ما ارتقای سطح کیفی نرم‌افزار در مقیاس سازمانی است.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-24 flex-1">
            <div className="space-y-10 text-right">
              <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Navigation</h4>
              <div className="flex flex-col gap-6 text-xl font-bold font-display text-white">
                <a href="#hero" className="hover:text-zinc-400 transition-all">خانه</a>
                <a href="#services" className="hover:text-zinc-400 transition-all">خدمات و تخصص</a>
                <a href="#projects" className="hover:text-zinc-400 transition-all">پروژه‌های منتخب</a>
                <a href="#philosophy" className="hover:text-zinc-400 transition-all">فلسفه و رویکرد</a>
                <a href="#testimonials" className="hover:text-zinc-400 transition-all">نظرات مشتریان</a>
                <a href="#contact" className="hover:text-zinc-400 transition-all">شروع همکاری</a>
              </div>
            </div>
            <div className="space-y-10 text-left flex flex-col items-end w-full">
              <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] self-end text-right">Contact</h4>
              <div className="flex flex-col gap-6 text-xl font-display text-white w-full items-end">
                <a href="tel:+989115790013" className="flex items-center justify-end gap-3 hover:text-zinc-400 transition-all font-en font-medium text-lg md:text-xl whitespace-nowrap" dir="ltr">
                  <Phone className="w-5 h-5 text-zinc-500" />
                  <span>+98 911 579 0013</span>
                </a>
                
                <div className="flex flex-wrap gap-4 pt-6 justify-end w-full">
                  <a href="mailto:baabakbaghaaei@gmail.com" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/babakbaghaei" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://t.me/babak_bagha_ei" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Send className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com/babak__baghaei" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Background Text */}
        <div className="text-[15vw] font-black text-zinc-900/50 leading-none select-none pointer-events-none mb-12 tracking-tighter">
          BAGHAEI TECH
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black text-zinc-700 uppercase tracking-wider text-center md:text-right">
            &copy; ۱۴۰۴ تمامی حقوق برای گروه فناوری بقایی محفوظ است.
          </div>
          <div className="flex gap-12 text-[10px] font-black text-zinc-600 uppercase">
            <a href="/terms" className="hover:text-white cursor-pointer transition-colors font-display">شرایط استفاده</a>
            <a href="/privacy" className="hover:text-white cursor-pointer transition-colors font-display">حریم خصوصی</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
