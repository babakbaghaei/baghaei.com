import React from 'react';

export default function Hero() {
  return (
    <section id="hero" className="pt-40 pb-32 min-h-screen flex items-center relative overflow-hidden">
      <div id="hero-pattern" className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden z-0">
         {/* Simple placeholder for SVG pattern */}
         <div className="w-full h-full bg-grid-black/[0.05]" />
      </div>
      <div className="w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-4 py-2 bg-gray-100 border-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 text-gray-600">🚀</div>
                    <p className="text-sm font-medium text-gray-600 font-sans uppercase tracking-wider">راهکارهای سازمانی</p>
                  </div>
                </div>
                <h1 className="text-3xl font-black tracking-tight leading-tight font-display mt-12">
                  <span className="text-black">سیستم‌هایی که</span>
                  <br />
                  <span className="text-black">مقیاس می‌پذیرند</span>
                </h1>
              </div>

              <div className="space-y-4 max-w-2xl pt-4">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-sans">
                  ما نرم‌افزارهای سازمانی می‌سازیم که با رشد کسب‌وکار شما بزرگ می‌شوند. از طراحی تا راه‌اندازی و نگهداری.
                </p>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  <span className="font-black text-black">بیش از ۱۰ سال</span> تجربه در ساخت سیستم‌های بزرگ.
                  <span className="font-black text-black">۱۴+</span> شرکت بزرگ به ما اعتماد کرده‌اند.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <a href="#about" className="px-8 py-3 bg-black text-white text-sm font-black hover:opacity-80 transition-all duration-300">
                  دریافت مشاوره
                </a>
                <a href="#projects" className="px-8 py-3 border-2 border-gray-300 text-gray-900 text-sm font-black hover:border-black transition-all duration-300">
                  مشاهده نمونه کارها
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
