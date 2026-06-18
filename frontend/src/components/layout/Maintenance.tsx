import React from 'react';

export default function Maintenance() {
 return (
  <div className="min-h-screen flex items-center justify-center bg-background font-sans text-right selection:bg-secondary" dir="rtl">
   <div className="max-w-md p-10 text-center space-y-8">
    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto border border-border">
     <span className="text-4xl">🏗️</span>
    </div>
    <div className="space-y-4">
     <h1 className="text-4xl font-black font-display text-foreground tracking-tight">در حال توسعه</h1>
     <p className="text-muted-foreground font-sans leading-relaxed text-lg">
      وب‌سایت گروه فناوری بقایی در حال بازسازی است.
      به زودی با تجربه‌ای متفاوت در خدمت شما خواهیم بود.
     </p>
    </div>
    <div className="pt-8 border-t border-border">
     <p className="text-[10px] text-muted-foreground font-en font-bold tracking-[0.3em] uppercase">Baghaei Tech Group</p>
    </div>
   </div>
  </div>
 );
}
