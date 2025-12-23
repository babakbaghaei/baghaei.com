import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-zinc-500 border-t border-zinc-100 py-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-black">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-black">ب</div>
              <span className="text-sm font-black uppercase tracking-widest font-display">گروه فناوری بقایی</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              پیشرو در ارائه راهکارهای نوین مهندسی نرم‌افزار و معماری سیستم‌های مقیاس‌پذیر سازمانی از سال ۱۳۹۴.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest">دسترسی سریع</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#projects" className="hover:text-black transition-colors">پروژه‌ها</a>
              <a href="#services" className="hover:text-black transition-colors">خدمات فنی</a>
              <a href="#contact" className="hover:text-black transition-colors">ارتباط با ما</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest">ارتباطات</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:business@baghaei.group" className="hover:text-black transition-colors font-en font-medium">business@baghaei.group</a>
              <p className="font-en font-medium">+98 911 579 0013</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-400">
          <div>&copy; ۱۴۰۳ تمامی حقوق برای گروه فناوری بقایی محفوظ است.</div>
          <div className="flex gap-8">
            <span>قوانین و مقررات</span>
            <span>حریم خصوصی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
