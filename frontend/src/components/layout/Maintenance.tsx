import React from 'react';

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans text-right selection:bg-zinc-100" dir="rtl">
      <div className="max-w-md p-10 text-center space-y-8">
        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto border border-zinc-100">
          <span className="text-4xl">🏗️</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black font-display text-black tracking-tight">در حال توسعه</h1>
          <p className="text-zinc-400 font-sans leading-relaxed text-lg">
            وب‌سایت گروه فناوری بقایی در حال بازسازی است. 
            به زودی با تجربه‌ای متفاوت در خدمت شما خواهیم بود.
          </p>
        </div>
        <div className="pt-8 border-t border-zinc-50">
          <p className="text-[10px] text-zinc-300 font-en font-bold tracking-[0.3em] uppercase">Baghaei Tech Group</p>
        </div>
      </div>
    </div>
  );
}
